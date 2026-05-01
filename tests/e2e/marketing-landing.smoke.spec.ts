import { expect, type Page, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;

    return documentWidth > viewportWidth + 1 || bodyWidth > viewportWidth + 1;
  });

  expect(hasOverflow).toBe(false);
}

async function expectHeroGraphFramed(page: Page) {
  const viewport = page.viewportSize();
  const stageBox = await page.locator('.marketing-hero__stage').boundingBox();

  expect(stageBox).not.toBeNull();
  expect(stageBox?.width).toBeGreaterThan(160);

  if (viewport) {
    expect(stageBox?.x).toBeGreaterThanOrEqual(0);
    expect((stageBox?.x ?? 0) + (stageBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width + 1);
  }
}

async function expectTruthLadderClearOfHero(page: Page) {
  const ladderBox = await page.locator('.marketing-truth-ladder').boundingBox();
  const stageBox = await page.locator('.marketing-hero__stage').boundingBox();

  expect(ladderBox).not.toBeNull();
  expect(stageBox).not.toBeNull();
  expect((ladderBox?.x ?? 0) - ((stageBox?.x ?? 0) + (stageBox?.width ?? 0))).toBeGreaterThanOrEqual(24);
}

async function expectEqualNavActionWidths(page: Page) {
  const widths = await page
    .locator(
      '.marketing-nav__actions .marketing-nav__link, .marketing-nav__actions .marketing-nav__cta, .marketing-nav__actions .marketing-nav__demo',
    )
    .evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().width)));

  expect(widths).toHaveLength(3);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
}

test.describe('marketing landing smoke @smoke', () => {
  test('renders V11 landing, stable anchors, replay, explorer, and footer', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.getByRole('heading', { name: /resolve business reality/i })).toBeVisible();
    await expect(page.locator('.marketing-hero__verdict')).toHaveText('RESOLVED');
    await expect(page.locator('.marketing-nav__links').getByRole('link', { name: 'Thesis' })).toBeVisible();
    await expect(page.locator('.marketing-nav__links').getByRole('link', { name: 'Ontology' })).toBeVisible();
    await expect(page.locator('.marketing-nav__links').getByRole('link', { name: 'Operations' })).toBeVisible();
    await expect(page.locator('.marketing-nav__links').getByRole('link', { name: 'Evidence' })).toBeVisible();
    await expect(page.locator('.marketing-nav__links').getByRole('link', { name: 'Verdict' })).toBeVisible();
    await expect(page.locator('.marketing-nav__links').getByRole('link')).toHaveCount(5);
    await expect(page.locator('.marketing-nav__actions').getByRole('link', { name: 'Sign-up' })).toBeVisible();
    await expect(page.getByText('Coming soon')).toHaveCount(0);
    await expectEqualNavActionWidths(page);
    await expect(page.locator('.marketing-scanline-ledger')).toBeVisible();
    await expect(page.locator('.marketing-truth-ladder')).toBeVisible();
    await expectHeroGraphFramed(page);
    await expectTruthLadderClearOfHero(page);
    await expectNoHorizontalOverflow(page);

    const beforeReplayUrl = page.url();
    await page.getByRole('button', { name: /replay the resolution sequence/i }).click();
    await expect(page).toHaveURL(beforeReplayUrl);
    await expect(page.locator('#hero')).toHaveClass(/marketing-hero--animate/);

    await page.locator('.marketing-scanline-ledger__tick[aria-label="Operating flow"]').click();
    await expect(page).toHaveURL(/#operations$/);
    await expect(page.locator('.marketing-scanline-ledger__tick.is-current')).toHaveAttribute('href', '#operations');

    await page.locator('.marketing-truth-ladder__anchor[aria-label="Control posture"]').click();
    await expect(page).toHaveURL(/#security$/);
    await expect(page.locator('.marketing-truth-ladder__anchor.is-current')).toHaveAttribute('href', '#security');

    await page.locator('.marketing-nav__links').getByRole('link', { name: 'Ontology' }).click();
    await expect(page).toHaveURL(/#ontology$/);
    await expect(page.getByRole('heading', { name: /one ontology/i })).toBeVisible();

    await page.getByRole('button', { name: /open live demo registration/i }).click();
    await expect(page.getByRole('dialog', { name: 'Register for live demo' })).toBeVisible();
    await page.getByLabel('Work email').fill('ops@example.com');
    await page.getByLabel(/I agree to the live memo T&C/i).click();
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('Registration received')).toBeVisible();
    await expect(page.getByText(/Registration queued\./i)).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog', { name: 'Register for live demo' })).toHaveCount(0);

    await page.getByRole('button', { name: /open object explorer/i }).click();
    await expect(page.getByRole('dialog', { name: 'Ontology object' })).toBeVisible();
    await page.getByRole('button', { name: /close explorer/i }).click();
    await expect(page.getByRole('dialog', { name: 'Ontology object' })).toHaveCount(0);

    const footer = page.locator('footer');
    await expect(footer.getByText('Business Machine')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Book a demo' })).toBeVisible();
  });

  test('keeps the first viewport usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.getByRole('heading', { name: /resolve business reality/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /replay the resolution sequence/i })).toBeVisible();
    await expect(page.locator('.marketing-scanline-ledger')).not.toBeVisible();
    await expect(page.locator('.marketing-truth-ladder')).not.toBeVisible();
    await expectHeroGraphFramed(page);
    await expectNoHorizontalOverflow(page);
  });
});
