# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.js >> Landing Page E2E Tests >> should load the landing page and display the main hero section
- Location: e2e/landing.spec.js:4:3

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Beatmaker Twin/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    9 × unexpected value ""

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: graphic_eq
        - generic [ref=e6]: BEATMAKER TWIN
      - navigation [ref=e7]:
        - link "STUDIO" [ref=e8] [cursor=pointer]:
          - /url: "#"
        - link "PROTOCOL" [ref=e9] [cursor=pointer]:
          - /url: "#"
        - link "OSCILLATORS" [ref=e10] [cursor=pointer]:
          - /url: "#"
      - button "INITIALIZE" [ref=e11] [cursor=pointer]
  - main [ref=e12]:
    - generic [ref=e15]:
      - generic [ref=e18]: "System Status: Operational"
      - heading "Your AI Music Co-Pilot" [level=1] [ref=e19]
      - paragraph [ref=e20]: Bridge Bitwig Studio with MCP using intelligent AI agents. Synthesize ideas faster than ever through a direct neural link to your DAW.
      - generic [ref=e21]:
        - button "Explore the Magic" [ref=e22] [cursor=pointer]
        - button "View Demo" [ref=e23] [cursor=pointer]
    - generic [ref=e24]:
      - heading "Core Capabilities" [level=2] [ref=e26]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e31]: speed
          - generic [ref=e32]:
            - generic [ref=e33]: play_circle
            - heading "Transport Control" [level=3] [ref=e34]
            - paragraph [ref=e35]: Real-time playback and sync via AI prompts. Orchestrate your entire session timeline through natural language commands.
        - generic [ref=e36]:
          - generic [ref=e38]: equalizer
          - generic [ref=e39]:
            - generic [ref=e40]: tune
            - heading "Track & Mixer" [level=3] [ref=e41]
            - paragraph [ref=e42]: Modulate parameters with LLM logic. Dynamically adjust gains, EQ curves, and effects chains based on spectral analysis.
        - generic [ref=e43]:
          - generic [ref=e45]: visibility
          - generic [ref=e46]:
            - generic [ref=e47]: layers
            - heading "Project Context" [level=3] [ref=e48]
            - paragraph [ref=e49]: Full visibility into your musical environment. The AI understands your project structure, sample choices, and arrangement.
    - generic [ref=e51]:
      - generic [ref=e52]:
        - heading "See it in Action" [level=2] [ref=e53]
        - paragraph [ref=e54]: The bridge between your creativity and the machine. Witness the seamless protocol handshake between your DAW and the intelligence layer.
        - generic [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e58]: token
            - generic [ref=e60]: memory
            - generic [ref=e62]: data_object
          - generic [ref=e63]: 32ms Latency / Optimized
      - generic [ref=e64]:
        - generic [ref=e70]: MCP_TERMINAL_V.2.0
        - generic [ref=e72]:
          - paragraph [ref=e73]: "[SYSTEM] Initializing core..."
          - paragraph [ref=e74]: "[DAW] Bitwig Link established."
          - paragraph [ref=e75]: "[AGENT] Listening for prompts..."
          - paragraph [ref=e76]: "> \"Apply dark reverb to track 4\""
          - paragraph [ref=e77]: "[LINK] Injecting VST parameters..."
          - paragraph [ref=e78]: "[SUCCESS] Modulation active."
        - img
    - generic [ref=e88]:
      - heading "Ready to sync?" [level=2] [ref=e90]
      - generic [ref=e91]:
        - button "GET STARTED FOR FREE" [ref=e92] [cursor=pointer]
        - button "READ THE DOCS" [ref=e93] [cursor=pointer]
  - contentinfo [ref=e94]:
    - generic [ref=e95]:
      - generic [ref=e96]:
        - generic [ref=e97]: BEATMAKER TWIN
        - paragraph [ref=e98]: © 2024 BEATMAKER TWIN // THE SONIC SYNTHESIST PROTOCOL
      - navigation [ref=e99]:
        - link "SYNTHS" [ref=e100] [cursor=pointer]:
          - /url: "#"
        - link "OSCILLATORS" [ref=e101] [cursor=pointer]:
          - /url: "#"
        - link "CONNECT" [ref=e102] [cursor=pointer]:
          - /url: "#"
        - link "TERMS" [ref=e103] [cursor=pointer]:
          - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Landing Page E2E Tests', () => {
  4  |   test('should load the landing page and display the main hero section', async ({ page }) => {
  5  |     // Navigate to the base URL (which is set to localhost:5173 in playwright.config.js)
  6  |     await page.goto('/');
  7  | 
  8  |     // Check if the title is correct
> 9  |     await expect(page).toHaveTitle(/Beatmaker Twin/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  10 | 
  11 |     // Check for the glitch heading
  12 |     const heroHeading = page.locator('h1.glitch-text');
  13 |     await expect(heroHeading).toBeVisible();
  14 |     await expect(heroHeading).toContainText('Your AI Music Co-Pilot.');
  15 | 
  16 |     // Check for the 'Explore the Magic' CTA button
  17 |     const exploreBtn = page.locator('button#start-tour');
  18 |     await expect(exploreBtn).toBeVisible();
  19 |     await expect(exploreBtn).toHaveText('Explore the Magic');
  20 |   });
  21 | 
  22 |   test('should smoothly scroll to features when clicking Explore CTA', async ({ page }) => {
  23 |     await page.goto('/');
  24 | 
  25 |     const exploreBtn = page.locator('button#start-tour');
  26 |     await exploreBtn.click();
  27 | 
  28 |     // The section with id 'features' should eventually be in the viewport
  29 |     const featuresSection = page.locator('#features');
  30 |     await expect(featuresSection).toBeInViewport();
  31 |   });
  32 | 
  33 |   test('should display all three feature cards', async ({ page }) => {
  34 |     await page.goto('/');
  35 | 
  36 |     // Check the three feature cards are visible
  37 |     const featureCards = page.locator('.feature-card');
  38 |     await expect(featureCards).toHaveCount(3);
  39 | 
  40 |     // Validate the content of one of the cards
  41 |     await expect(featureCards.nth(0)).toContainText('Transport Control');
  42 |     await expect(featureCards.nth(1)).toContainText('Track & Mixer');
  43 |     await expect(featureCards.nth(2)).toContainText('Project Context');
  44 |   });
  45 | 
  46 |   test('should run terminal simulation when clicking Run Auto-Demo', async ({ page }) => {
  47 |     await page.goto('/');
  48 | 
  49 |     // Validate Terminal exists
  50 |     const terminalTitle = page.locator('.terminal-title');
  51 |     await expect(terminalTitle).toHaveText('bash - mcp-client');
  52 | 
  53 |     const runBtn = page.locator('#run-demo-btn');
  54 |     await expect(runBtn).toBeVisible();
  55 |     await expect(runBtn).toHaveText('Run Auto-Demo');
  56 | 
  57 |     // Click run and check if it disables and changes text
  58 |     await runBtn.click();
  59 |     await expect(runBtn).toHaveText('Running...');
  60 |     await expect(runBtn).toBeDisabled();
  61 | 
  62 |     // Check output contains the typed command
  63 |     const firstCommand = page.locator('.terminal-body .command').first();
  64 |     await expect(firstCommand).toContainText('Call tool "transport_play"');
  65 | 
  66 |     // Wait for the Auto-Demo to finish processing all steps
  67 |     // The play indicator should light up active
  68 |     const playIndicator = page.locator('#play-indicator');
  69 |     await expect(playIndicator).toHaveClass(/active/, { timeout: 10000 });
  70 | 
  71 |     // The Lead Synth fader level should update to 0.9
  72 |     const levelSynth = page.locator('#level-synth');
  73 |     await expect(levelSynth).toHaveText('0.9', { timeout: 10000 });
  74 |   });
  75 | });
  76 | 
```