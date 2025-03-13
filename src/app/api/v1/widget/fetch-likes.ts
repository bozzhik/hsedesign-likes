import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'

export async function fetchLikes(profile: string): Promise<number> {
  const isProduction = process.env.NODE_ENV === 'production'
  let browser = null

  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: isProduction ? await chromium.executablePath() : undefined,
      headless: chromium.headless,
      ignoreDefaultArgs: false,
    })

    const page = await browser.newPage()
    await page.setJavaScriptEnabled(true)

    await page.setViewport({width: 1280, height: 800})
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    // Add error handling for navigation
    const response = await page.goto(`https://hsedesign.ru/designer/${profile}`, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000,
    })

    if (!response || !response.ok()) {
      console.error(`Failed to load page: ${response?.status() || 'unknown status'}`)
      return 0
    }

    // Wait for the specific element with a more reliable selector
    const selector = '.sc-hAPcZG.dVmFkd'
    await page.waitForFunction((sel) => document.querySelectorAll(sel).length > 0, {timeout: 5000}, selector)

    // Get likes count with error handling
    const totalLikes = await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel)
      return Array.from(elements).reduce((sum, element) => {
        const likeCount = parseInt(element.textContent || '0', 10)
        return sum + (isNaN(likeCount) ? 0 : likeCount)
      }, 0)
    }, selector)

    return totalLikes
  } catch (error) {
    console.error('Error fetching likes:', error)
    return 0
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (error) {
        console.error('Error closing browser:', error)
      }
    }
  }
}
