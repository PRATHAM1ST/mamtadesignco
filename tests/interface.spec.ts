import {test, expect} from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright';

test('homepage is keyboard accessible and passes WCAG AA checks', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Skip to content'})).toBeFocused();
  const result = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('navigation dialog contains focus and restores its trigger', async ({page}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', {name:'Open navigation'});
  await trigger.click();
  const dialog = page.getByRole('dialog', {name:'Explore', exact:true});
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 12; index++) await page.keyboard.press('Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

for (const width of [320,390,768,1440]) {
  test(`responsive homepage remains within ${width}px viewport`, async ({page}) => {
    await page.setViewportSize({width, height:900});
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
    await expect(page.getByRole('link',{name:'Find your Chaniya',exact:true}).first()).toBeVisible();
  });
}

test('reduced motion uses native scrolling and preserves search', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
  await page.locator('.header').getByRole('link',{name:'Search',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Find something beautiful'})).toBeVisible();
});

test('favorites persist identifiers and refresh live product data', async ({page}) => {
  await page.goto('/shop');
  await page.getByRole('button',{name:'Save to favorites'}).first().click();
  await page.goto('/favorites');
  await expect(page.locator('.product-item')).toHaveCount(1);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mamta:favorites:v1') || '[]') as Record<string,unknown>[]);
  expect(Object.keys(saved[0]).sort()).toEqual(['handle','id']);
  await page.getByRole('button',{name:'Remove from favorites'}).click();
  await expect(page.getByText('A little room for favourites.')).toBeVisible();
});
