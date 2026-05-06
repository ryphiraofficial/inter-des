const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 800 });
  await page.goto('http://localhost:5173/staff/dashboard', { waitUntil: 'networkidle2' });
  
  const headerLayout = await page.evaluate(() => {
    const header = document.querySelector('.page-header');
    const left = document.querySelector('.header-left');
    const actions = document.querySelector('.header-actions');
    const h1 = document.querySelector('.welcome-text h1');
    const h1Text = h1 ? h1.innerText : 'null';
    
    if (!header) return 'No header found';
    
    return {
      header: {
        width: header.getBoundingClientRect().width,
        display: getComputedStyle(header).display,
        justifyContent: getComputedStyle(header).justifyContent,
      },
      left: {
        width: left.getBoundingClientRect().width,
        x: left.getBoundingClientRect().x,
        display: getComputedStyle(left).display,
        flex: getComputedStyle(left).flex
      },
      actions: {
        width: actions.getBoundingClientRect().width,
        x: actions.getBoundingClientRect().x,
        display: getComputedStyle(actions).display
      },
      h1: {
        text: h1Text,
        width: h1 ? h1.getBoundingClientRect().width : 'null',
        display: h1 ? getComputedStyle(h1).display : 'null'
      }
    };
  });
  
  console.log(JSON.stringify(headerLayout, null, 2));
  await browser.close();
})();
