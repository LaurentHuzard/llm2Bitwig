import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json

# Configuration
SERVER_SCRIPT = "/home/taenia/Code/Projects/beat-twin/server-mcp/index.ts"

async def run():
    print("Testing MCP Ear Devices...")
    
    server_params = StdioServerParameters(
        command="npx",
        args=["tsx", SERVER_SCRIPT, "--stdio"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # 1. Test List Devices
            print("\n--- Testing 'ear_list_devices' ---")
            try:
                result = await session.call_tool("ear_list_devices", {})
                devices_data = json.loads(result.content[0].text)
                print(f"Devices found: {len(devices_data.get('devices', []))}")
                for dev in devices_data.get('devices', [])[:3]:
                    print(f" - [{dev['index']}] {dev['name']} ({dev['channels']} ch)")
                
                active_index = devices_data.get('active_index')
                print(f"Active Device Index: {active_index}")

            except Exception as e:
                print(f"Error: {e}")

            # 2. Test Set Device (if devices exist)
            if devices_data.get('devices'):
                target_index = devices_data['devices'][0]['index']
                print(f"\n--- Testing 'ear_set_device' to {target_index} ---")
                try:
                    result = await session.call_tool("ear_set_device", {"index": target_index})
                    print(f"Result: {result.content[0].text}")
                except Exception as e:
                    print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
