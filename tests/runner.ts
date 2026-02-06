/**
 * Test Runner
 * Orchestrates the Mock Bitwig Server and runs all test files.
 */
import { spawn, type ChildProcess } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import net from "net";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function isPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.once('connect', () => {
            client.destroy();
            resolve(true);
        });
        client.once('error', () => {
            resolve(false);
        });
        client.connect(port, "127.0.0.1");
    });
}

async function startMockServer(): Promise<ChildProcess | null> {
    if (await isPortInUse(8888)) {
        console.log("⚠️ Port 8888 is already in use. Assuming Bitwig Studio (or another mock) is running.");
        console.log("Skipping Mock Server startup and running tests against existing instance.");
        return null;
    }

    console.log("Starting Mock Bitwig Server...");
    const serverProcess = spawn("node", ["--import", "tsx", "tests/mock-bitwig.ts"], {
        stdio: "inherit",
        detached: false
    });

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    return serverProcess;
}

async function runTests(): Promise<boolean> {
    const testFiles = fs.readdirSync(__dirname)
        .filter(file => file.startsWith("test_") && file.endsWith(".ts"));

    let failed = false;

    for (const file of testFiles) {
        console.log(`\n--------------------------------------------------------------`);
        console.log(`Running test: ${file}`);
        console.log(`--------------------------------------------------------------\n`);

        const currentPort = 2625 + (testFiles.indexOf(file) * 10);
        console.log(`Running test on WS Port: ${currentPort}`);

        const exitCode = await new Promise<number | null>((resolve) => {
            const p = spawn("node", ["--import", "tsx", path.join(__dirname, file)], {
                stdio: "inherit",
                env: { ...process.env, BITWIG_MCP_WS_PORT: String(currentPort) }
            });
            p.on("close", (code: number | null) => resolve(code));
        });

        if (exitCode !== 0) {
            console.error(`❌ Test ${file} FAILED with code ${exitCode}`);
            failed = true;
        } else {
            console.log(`✅ Test ${file} PASSED`);
        }

        // Give time for ports to release
        await new Promise(r => setTimeout(r, 3000));
    }

    return failed;
}

async function main(): Promise<void> {
    let serverProcess: ChildProcess | null = null;
    try {
        serverProcess = await startMockServer();

        const failed = await runTests();

        if (failed) {
            console.error("\n❌ Some tests failed.");
            process.exit(1);
        } else {
            console.log("\n✅ All tests passed!");
            process.exit(0);
        }

    } catch (err) {
        console.error("Runner failed:", err);
        process.exit(1);
    } finally {
        if (serverProcess) {
            console.log("Stopping Mock Server...");
            serverProcess.kill();
        }
    }
}

main();
