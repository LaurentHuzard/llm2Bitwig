package com.beattwin.mcp.tools;

import com.beattwin.mcp.bitwig.BitwigClient;
import com.beattwin.mcp.ear.EarServiceClient;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BitwigToolsTest {
    @Test
    void testToolsInstantiation() {
        BitwigClient bitwigMock = new BitwigClient();
        EarServiceClient earMock = new EarServiceClient();
        BitwigTools tools = new BitwigTools(bitwigMock, earMock);

        assertNotNull(tools);
        // Full registration test will happen in app startup tests
    }

    @Test
    void coreProfileExposesCompactAgentSurface() {
        BitwigClient bitwigMock = new BitwigClient();
        EarServiceClient earMock = new EarServiceClient();
        BitwigTools tools = new BitwigTools(bitwigMock, earMock);

        var coreTools = tools.getTools("core");
        var fullTools = tools.getTools("full");

        assertEquals(39, coreTools.size());
        assertEquals(166, fullTools.size());
        assertTrue(coreTools.size() < fullTools.size());
    }

    @Test
    void domainProfilesCanBeCombined() {
        BitwigClient bitwigMock = new BitwigClient();
        EarServiceClient earMock = new EarServiceClient();
        BitwigTools tools = new BitwigTools(bitwigMock, earMock);

        var transportAndEarTools = tools.getTools("transport,ear");

        assertEquals(34, transportAndEarTools.size());
    }
}
