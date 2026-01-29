#!/bin/bash

# Bitwig MCP Test Runner
# Checks environment and launches MCP Inspector CLI

echo "🎹 Bitwig MCP Test Environment Setup"
echo "====================================="

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔍 Checking for Bitwig connection..."
# We can't easily check if Bitwig is running from here without netcat or similar, 
# so we'll rely on the user following instructions.
echo "⚠️  Ensure Bitwig Studio is running with the 'Bitwig POC' controller active."

echo ""
echo "🚀 Launching MCP Inspector CLI..."
echo "type 'list tools' to see available commands."
echo "type 'call <tool_name> <args>' to execute commands."
echo "---------------------------------------------------"

npm run test:inspector-cli
