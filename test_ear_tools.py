import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json
import base64

# Configuration
# Configuration
SERVER_SCRIPT = "/home/taenia/Code/Projects/beat-twin/server-mcp/index.ts"

async def run():
    print("Testing MCP Audio Ear...")
    
    server_params = StdioServerParameters(
        command="npx",
        args=["tsx", SERVER_SCRIPT, "--stdio"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # List tools
            print("\n--- Tools ---")
            tools = await session.list_tools()
            for t in tools.tools:
                if t.name.startswith("ear_"):
                    print(f" - {t.name}: {t.description}")
            
            # 1. Test Status
            print("\n--- Testing 'ear_status' ---")
            try:
                result = await session.call_tool("ear_status", {})
                print(f"Result: {result.content[0].text}")
            except Exception as e:
                print(f"Error: {e}")

            # 2. Test Get Levels
            print("\n--- Testing 'ear_get_levels' ---")
            try:
                result = await session.call_tool("ear_get_levels", {})
                print(f"Result: {result.content[0].text}")
            except Exception as e:
                print(f"Error: {e}")
                
            # 3. Test Listen (Short)
            print("\n--- Testing 'ear_listen' (1 sec) ---")
            try:
                # Ask used to play sound?
                # We can't ask user easily here. We just test if it returns data.
                result = await session.call_tool("ear_listen", {"seconds": 1})
                data = json.loads(result.content[0].text)
                if "data" in data and "encoding" in data and data["encoding"] == "base64":
                    print("Received Audio Data!")
                    print(f"Format: {data.get('format')}")
                    print(f"Seconds: {data.get('seconds')}")
                    # Decode to verify it's valid base64?
                    audio_bytes = base64.b64decode(data["data"])
                    print(f"Decoded bytes: {len(audio_bytes)}")
                else:
                    print(f"Unexpected result: {data}")
            except Exception as e:
                print(f"Error: {e}")
                
if __name__ == "__main__":
    asyncio.run(run())
