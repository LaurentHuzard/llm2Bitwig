import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';
import OpenAI from 'openai';
import { Send, Settings, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';

// Use same port as server-mcp/index.ts (default 2624)
const MCP_SERVER_URL = 'ws://localhost:2624';

interface Message {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    name?: string;
    tool_call_id?: string;
    isError?: boolean;
}

export const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', content: 'Welcome to the Bitwig AI Assistant. I can help you control Bitwig Studio.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
    const [showSettings, setShowSettings] = useState(!apiKey);
    const [mcpClient, setMcpClient] = useState<Client | null>(null);
    const [mcpConnected, setMcpConnected] = useState(false);
    const [availableTools, setAvailableTools] = useState<any[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Connect to MCP Server
    useEffect(() => {
        const connectMCP = async () => {
            try {
                const transport = new WebSocketClientTransport(new URL(MCP_SERVER_URL));
                const client = new Client(
                    { name: 'bitwig-chat-client', version: '1.0.0' },
                    { capabilities: {} }
                );

                await client.connect(transport);
                setMcpClient(client);
                setMcpConnected(true);
                console.log('Connected to MCP Server');

                const tools = await client.listTools();
                setAvailableTools(tools.tools);
                console.log('Available tools:', tools.tools.length);
            } catch (error) {
                console.error('Failed to connect to MCP Server:', error);
                setMcpConnected(false);
            }
        };

        connectMCP();

        return () => {
            mcpClient?.close().catch(console.error);
        };
    }, []); // Run once on mount

    const handleSendMessage = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true // Client-side only
            });

            // 1. Send prompt to LLM with tools
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o', // Or gpt-3.5-turbo
                messages: [
                    { role: 'system', content: 'You are a helpful assistant controlling Bitwig Studio via MCP. Use the provided tools to execute user commands.' },
                    ...messages.map(m => ({
                        role: m.role,
                        content: m.content,
                        name: m.name,
                        tool_call_id: m.tool_call_id
                    }) as any),
                    { role: 'user', content: userMessage }
                ],
                tools: availableTools.map(tool => ({
                    type: 'function',
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: tool.inputSchema
                    }
                }))
            });

            const choice = completion.choices[0];
            const responseMessage = choice.message;

            // 2. Check for tool calls
            if (responseMessage.tool_calls) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Executing commands...' }]);

                const toolResponses = [];
                for (const toolCall of responseMessage.tool_calls) {
                    if (mcpClient) {
                        console.log(`Calling tool: ${toolCall.function.name}`);
                        try {
                            const result = await mcpClient.callTool({
                                name: toolCall.function.name,
                                arguments: JSON.parse(toolCall.function.arguments)
                            });

                            // Handle result structure from MCP SDK
                            toolResponses.push({
                                tool_call_id: toolCall.id,
                                role: 'tool',
                                name: toolCall.function.name,
                                content: JSON.stringify(result)
                            });
                        } catch (err: any) {
                            toolResponses.push({
                                tool_call_id: toolCall.id,
                                role: 'tool',
                                name: toolCall.function.name,
                                content: `Error: ${err.message}`
                            });
                        }
                    }
                }

                // 3. Send tool outputs back to LLM for final response
                const finalCompletion = await openai.chat.completions.create({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant controlling Bitwig Studio via MCP.' },
                        ...messages.map(m => ({
                            role: m.role,
                            content: m.content,
                            name: m.name,
                            tool_call_id: m.tool_call_id
                        }) as any),
                        { role: 'user', content: userMessage },
                        responseMessage,
                        ...toolResponses
                    ] as any
                });

                setMessages(prev => [...prev, { role: 'assistant', content: finalCompletion.choices[0].message.content || 'Action completed.' }]);

            } else {
                // Just a text response
                setMessages(prev => [...prev, { role: 'assistant', content: responseMessage.content || '' }]);
            }

        } catch (error: any) {
            console.error('LLM Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}`, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('openai_api_key', key);
        setShowSettings(false);
    };

    return (
        <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-100px)] bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
            {/* Chat Component Header */}
            <div className="bg-gray-800/80 p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Bot className="text-purple-400" size={24} />
                    <div>
                        <h2 className="font-semibold text-gray-200">Bitwig AI Assistant</h2>
                        <div className="flex items-center space-x-2 text-xs">
                            <span className={`inline-block w-2 h-2 rounded-full ${mcpConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-gray-400">{mcpConnected ? 'MCP Connected' : 'MCP Disconnected'}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-gray-800 p-6 border-b border-gray-700 animate-in slide-in-from-top-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">API Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">OpenAI API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => saveApiKey(apiKey)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-medium transition-colors"
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => {
                    if (msg.role === 'tool') return null; // Don't show raw tool outputs in chat

                    return (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                max-w-[80%] p-3 rounded-lg text-sm
                ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-none'
                                    : msg.isError
                                        ? 'bg-red-900/50 border border-red-700 text-red-200'
                                        : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}
              `}>
                                <div className="flex items-center space-x-2 mb-1 opacity-50 text-xs">
                                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    <span className="capitalize">{msg.role}</span>
                                </div>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700 flex items-center space-x-2">
                            <RefreshCw className="animate-spin text-purple-400" size={16} />
                            <span className="text-gray-400 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type a message to control Bitwig..."
                        disabled={isLoading || !apiKey}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !apiKey || !input.trim()}
                        className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
                {!apiKey && (
                    <p className="text-xs text-center mt-2 text-yellow-500 flex items-center justify-center space-x-1">
                        <AlertCircle size={12} />
                        <span>Please configure your API Key to start chatting.</span>
                    </p>
                )}
            </div>
        </div>
    );
};
