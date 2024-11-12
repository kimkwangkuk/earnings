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

  // 이메일 전송
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
}

async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });

    await page.goto('https://earnings-three.vercel.app/', {
      waitUntil: 'networkidle0',
    });

    const screenshotPath = './screenshots/screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    await browser.close();
    
    console.log('Screenshot taken successfully!');

    // 스크린샷 촬영 후 이메일 전송
    await sendEmail(screenshotPath);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

takeScreenshot();