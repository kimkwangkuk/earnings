const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail(screenshotPath) {
  // 이메일 전송 설정
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  // 이메일 옵션 설정
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: '일일 스크린샷 알림',
    text: '오늘의 스크린샷이 첨부되어 있습니다.',
    attachments: [{
      filename: 'screenshot.png',
      path: screenshotPath
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--lang=ko-KR,ko',
        '--font-render-hinting=medium'
      ]
    });

    const page = await browser.newPage();
    
    // 한글 폰트 및 언어 설정
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ko-KR,ko;q=0.9'
    });

    await page.setViewport({
      width: 1920,
      height: 1080
    });

    // 페이지 로드 전에 폰트 설정
    await page.evaluateOnNewDocument(() => {
      document.documentElement.lang = 'ko';
      document.documentElement.style.fontFamily = 
        "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif";
    });

    await page.goto('https://earnings-three.vercel.app/', {
      waitUntil: 'networkidle0',
    });

    // 폰트 로딩을 위한 잠시 대기
    await page.waitForTimeout(1000);

    const screenshotPath = './screenshots/screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    await browser.close();
    
    console.log('Screenshot taken successfully!');
    await sendEmail(screenshotPath);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

takeScreenshot();