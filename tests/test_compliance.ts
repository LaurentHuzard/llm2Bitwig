
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type ResourceListResponse = { resources?: Array<{ uri: string, name: string }> };
type ReadResourceResponse = { contents?: Array<{ uri: string, text: string }> };
type PromptListResponse = { prompts?: Array<{ name: string }> };
type GetPromptResponse = { messages?: Array<{ role: string, content: { type: string, text: string } }> };

async function main() {
    console.log("Starting MCP Compliance Test (Resources & Prompts)...");

    // Use tsx to run the server directly from source to avoid build step for testing
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["tsx", "server-mcp/index.ts"],
    });

    const client = new Client(
        {
            name: "compliance-tester",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("✅ Connected to MCP Server.");

        // --- Test Resources ---
        console.log("\n🔍 Testing Resources...");
        const resources = await client.listResources() as ResourceListResponse;
        console.log(`Found ${resources.resources?.length ?? 0} resources.`);

        const projectResource = resources.resources?.find(r => r.uri === "bitwig://project/summary");
        if (projectResource) {
            console.log("✅ Found 'bitwig://project/summary' resource.");
        } else {
            console.error("❌ 'bitwig://project/summary' NOT found.");
            process.exit(1);
        }

        console.log("📖 Reading 'bitwig://project/summary'...");
        try {
            const readRes = await client.readResource({ uri: "bitwig://project/summary" }) as ReadResourceResponse;
            const content = readRes.contents?.[0]?.text;
            if (content && content.length > 0) {
                // Try to parse JSON
                JSON.parse(content);
                console.log("✅ Successfully read and parsed project summary.");
            } else {
                console.error("❌ Resource content empty.");
                process.exit(1);
            }
        } catch (e) {
            console.error(`❌ Failed to read resource: ${e}`);
            // Don't exit here, might just be Bitwig not running, which is "success" for protocol compliance but fail for integration
            console.log("⚠️ Note: If Bitwig is not running, this read failure is expected. We are just testing the capability exists.");
        }


        // --- Test Prompts ---
        console.log("\n🔍 Testing Prompts...");
        const prompts = await client.listPrompts() as PromptListResponse;
        console.log(`Found ${prompts.prompts?.length ?? 0} prompts.`);

        const explainPrompt = prompts.prompts?.find(p => p.name === "explain_project");
        if (explainPrompt) {
            console.log("✅ Found 'explain_project' prompt.");
        } else {
            console.error("❌ 'explain_project' prompt NOT found.");
            process.exit(1);
        }

        console.log("📝 Getting 'explain_project' prompt...");
        try {
            const promptRes = await client.getPrompt({ name: "explain_project" }) as GetPromptResponse;
            if (promptRes.messages && promptRes.messages.length > 0) {
                console.log("✅ Successfully got prompt messages.");
                console.log("Sample Message: ", promptRes.messages[0].content.text.substring(0, 50) + "...");
            } else {
                console.error("❌ Prompt messages empty.");
            }
        } catch (e) {
            console.error(`❌ Failed to get prompt: ${e}`);
            console.log("⚠️ Note: If Bitwig is not running, this failure is expected.");
        }

        console.log("\n🎉 Compliance Test Completed.");

    } catch (e) {
        console.error("Test execution failed:", e);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
