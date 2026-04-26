import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json

# Configuration
SERVER_SCRIPT = "/home/taenia/Code/Projects/beat-twin/server-mcp/index.ts"

async def run():
    print("Testing Phase 3: Creative Note & Audio Tools...")

    server_params = StdioServerParameters(
        command="npx",
        args=["tsx", SERVER_SCRIPT, "--stdio"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List tools
            print("\n--- Checking New Tools ---")
            tools = await session.list_tools()
            new_tools = [
                "note_input_assign_expression", "note_input_set_mpe",
                "note_input_set_key_translation", "note_input_set_velocity_translation",
                "drumpad_get_status", "drumpad_select"
            ]

            for nt in new_tools:
                found = any(t.name == nt for t in tools.tools)
                print(f"Tool '{nt}': {'FOUND' if found else 'MISSING'}")

            # 1. Test Note Expression mapping (Simulation)
            print("\n--- Testing 'note_input_assign_expression' ---")
            try:
                # We expect an error if Bitwig is not running, but we want to see it reach the handler
                result = await session.call_tool("note_input_assign_expression", {
                    "channel": 0,
                    "expression": "TIMBRE",
                    "pitchRange": 48
                })
                print(f"Result: {result.content[0].text}")
            except Exception as e:
                print(f"Note: Bitwig might not be connected, which is fine for tool discovery test.")
                print(f"Caught error: {e}")

            # 2. Test MPE Enable
            print("\n--- Testing 'note_input_set_mpe' ---")
            try:
                result = await session.call_tool("note_input_set_mpe", {
                    "enabled": True,
                    "baseChannel": 0,
                    "pitchBendRange": 48
                })
                print(f"Result: {result.content[0].text}")
            except Exception as e:
                print(f"Caught error: {e}")

            # 3. Test Drum Pad Status
            print("\n--- Testing 'drumpad_get_status' ---")
            try:
                result = await session.call_tool("drumpad_get_status", {})
                print(f"Result: {result.content[0].text}")
            except Exception as e:
                print(f"Caught error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
