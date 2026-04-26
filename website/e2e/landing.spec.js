import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E Tests', () => {
  test('should load the landing page and display the main hero section', async ({ page }) => {
    // Navigate to the base URL (which is set to localhost:5173 in playwright.config.js)
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/Beatmaker Twin/);

    // Check for the glitch heading
    const heroHeading = page.locator('h1.glitch-text');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Your AI Music Co-Pilot.');

    // Check for the 'Explore the Magic' CTA button
    const exploreBtn = page.locator('button#start-tour');
    await expect(exploreBtn).toBeVisible();
    await expect(exploreBtn).toHaveText('Explore the Magic');
  });

  test('should smoothly scroll to features when clicking Explore CTA', async ({ page }) => {
    await page.goto('/');

    const exploreBtn = page.locator('button#start-tour');
    await exploreBtn.click();

    // The section with id 'features' should eventually be in the viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();
  });

  test('should display all three feature cards', async ({ page }) => {
    await page.goto('/');

    // Check the three feature cards are visible
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(3);

    // Validate the content of one of the cards
    await expect(featureCards.nth(0)).toContainText('Transport Control');
    await expect(featureCards.nth(1)).toContainText('Track & Mixer');
    await expect(featureCards.nth(2)).toContainText('Project Context');
  });

  test('should run terminal simulation when clicking Run Auto-Demo', async ({ page }) => {
    await page.goto('/');

    // Validate Terminal exists
    const terminalTitle = page.locator('.terminal-title');
    await expect(terminalTitle).toHaveText('bash - mcp-client');

    const runBtn = page.locator('#run-demo-btn');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toHaveText('Run Auto-Demo');

    // Click run and check if it disables and changes text
    await runBtn.click();
    await expect(runBtn).toHaveText('Running...');
    await expect(runBtn).toBeDisabled();

    // Check output contains the typed command
    const firstCommand = page.locator('.terminal-body .command').first();
    await expect(firstCommand).toContainText('Call tool "transport_play"');

    // Wait for the Auto-Demo to finish processing all steps
    // The play indicator should light up active
    const playIndicator = page.locator('#play-indicator');
    await expect(playIndicator).toHaveClass(/active/, { timeout: 10000 });

    // The Lead Synth fader level should update to 0.9
    const levelSynth = page.locator('#level-synth');
    await expect(levelSynth).toHaveText('0.9', { timeout: 10000 });
  });
});
