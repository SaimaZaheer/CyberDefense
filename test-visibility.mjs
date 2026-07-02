import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });

    const result = await page.evaluate(() => {
        const el = document.querySelector('.header-title');
        if (!el) return 'Element not found';
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        return {
            text: el.innerText,
            opacity: computed.opacity,
            visibility: computed.visibility,
            display: computed.display,
            zIndex: computed.zIndex,
            color: computed.color,
            rect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                bottom: rect.bottom
            },
            html: el.outerHTML
        };
    });

    console.log('Result:', JSON.stringify(result, null, 2));

    // Also check parent container
    const parentResult = await page.evaluate(() => {
        const el = document.querySelector('.dashboard-header');
        if (!el) return 'Parent Element not found';
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
            opacity: computed.opacity,
            visibility: computed.visibility,
            display: computed.display,
            zIndex: computed.zIndex,
            rect: { width: rect.width, height: rect.height },
            html: el.outerHTML
        }
    });

    console.log('Parent Result:', JSON.stringify(parentResult, null, 2));

    await browser.close();
})();
