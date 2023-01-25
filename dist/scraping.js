"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(async () => {
    (await Promise.resolve().then(() => __importStar(require('dotenv')))).config();
    const { SERVER_PORT } = process.env;
    const dayjs = await Promise.resolve().then(() => __importStar(require('dayjs')));
    const puppeteer = await Promise.resolve().then(() => __importStar(require('puppeteer-core')));
    const browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://chrome-1:3000'
    });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com/fr');
    const images = await page.$$eval('figure[itemprop="image"]', (elements) => {
        return elements.map((element) => {
            const img = element.querySelector('img[itemprop="thumbnailUrl"]');
            return {
                src: img?.getAttribute('src'),
                alt: img?.getAttribute('alt')
            };
        });
    });
    page.close();
    (await Promise.resolve().then(() => __importStar(require('node:fs')))).writeFile('./tmp/images.json', JSON.stringify(images, null, 4), (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('ok');
        }
    });
})();
