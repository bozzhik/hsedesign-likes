import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export async function fetchLikes(profile: string): Promise<number> {
  const isProduction = process.env.NODE_ENV === 'production'

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: isProduction ? await chromium.executablePath() : undefined,
    headless: chromium.headless,
    ignoreDefaultArgs: false,
  })

  try {
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(true)

    await page.setViewport({width: 1280, height: 800})
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    await page.goto(`https://hsedesign.ru/designer/${profile}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait for the like count elements to be rendered
    await page.waitForSelector('.sc-hAPcZG.dVmFkd', {timeout: 5000})

    // Sum up all like counts
    const totalLikes = await page.$$eval('.sc-hAPcZG.dVmFkd', (elements) => {
      return elements.reduce((sum, element) => {
        const likeCount = parseInt(element.textContent || '0', 10)
        return sum + (isNaN(likeCount) ? 0 : likeCount)
      }, 0)
    })

    return totalLikes
  } catch (error) {
    console.error('Error fetching likes:', error)
    return 0
  } finally {
    await browser.close()
  }
}
