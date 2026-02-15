import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json

# Configuration
SERVER_SCRIPT = "/home/taenia/Code/Projects/beat-twin/server-mcp/index.ts"

async def run():
    print("Testing MCP Audio Analysis...")
    
    server_params = StdioServerParameters(
        command="npx",
        args=["tsx", SERVER_SCRIPT, "--stdio"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # List tools to verify it exists
            print("\n--- Checking Tools ---")
            tools = await session.list_tools()
            found = False
            for t in tools.tools:
                if t.name == "ear_analyze":
                    print(f"FOUND: {t.name}: {t.description}")
                    found = True
                    break
            
            if not found:
                print("ERROR: ear_analyze tool not found!")
                return

            # Test Analysis
            print("\n--- Testing 'ear_analyze' (1 sec) ---")
            try:
                # This requires ear-service to be running on port 8001
                result = await session.call_tool("ear_analyze", {"seconds": 1.0})
                
                # Result content is a list of TextContent
                text_result = result.content[0].text
                print(f"Raw Result: {text_result[:200]}...") # Print first 200 chars
                
                data = json.loads(text_result)
                
                if "features" in data and "centroid" in data:
                    print("\nSUCCESS: Analysis data received.")
                    print(f"Centroid: {data['centroid']:.2f} Hz")
                    print(f"RMS: {data['rms']:.4f}")
                    print("Spectral Features:")
                    for band, energy in data['features'].items():
                        print(f" - {band}: {energy:.4f}")
                else:
                    print(f"ERROR: Unexpected response structure: {data.keys()}")

            except Exception as e:
                print(f"Error calling tool: {e}")
                print("Make sure 'ear-service' is running: 'uvicorn main:app --port 8001'")

if __name__ == "__main__":
    asyncio.run(run())
