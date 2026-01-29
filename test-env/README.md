# Bitwig MCP Test Environment

This environment allows you to test the Bitwig MCP server using the MCP Inspector, a tool that simulates an LLM agent interacting with your tools.

## Prerequisites

- Bitwig Studio must be running
- The `BitwigPOC` controller script must be active in Bitwig
- Node.js dependencies must be installed

## Quick Start

1. **Ensure Bitwig is ready:**
   Open Bitwig Studio and check that the "Bitwig POC" controller is running.

2. **Run the CLI Test:**
   ```bash
   npm run test:inspector-cli
   ```
   This opens an interactive command-line interface where you can list tools and execute them.

   **Commands:**
   - `list tools`: See all available Bitwig tools
   - `call <tool_name> <json_args>`: Execute a tool
     - Example: `call transport_play {}`
     - Example: `call track_bank_set_volume {"index": 0, "value": 0.8}`

3. **Run the Web Inspector (Optional):**
   ```bash
   npm run test:inspector
   ```
   This opens a browser window with a graphical interface to explore and test tools.

## Testing Workflows

See [Example Prompts](example-prompts.md) for scenarios to test.

## Troubleshooting

- **Connection Refused:** Ensure Bitwig is running and the controller script is active.
- **Tools not showing:** Check the console output of the MCP server for any errors.
