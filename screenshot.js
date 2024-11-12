const puppeteer = require('puppeteer');

async function takeScreenshot() {
  try {
    // 브라우저 실행
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 새 페이지 생성
    const page = await browser.newPage();
    
    // 뷰포트 설정
    await page.setViewport({
      width: 1920,
      height: 1080
    });

    // 웹사이트 접속
    await page.goto('https://earnings-three.vercel.app/', {
      waitUntil: 'networkidle0',
    });

    // 스크린샷 촬영
    await page.screenshot({
      path: './screenshots/screenshot.png',
      fullPage: true
    });

    // 브라우저 종료
    await browser.close();
    
    console.log('Screenshot taken successfully!');
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  }
}

takeScreenshot(); 