process.env.PORT = 7000;
process.env.NODE_ENV = 'development';

const app = require("../app.js");
// const path = require("path");
// process.env['PATH'] = process.env['PATH'].substring(0, process.env['PATH'].length-1);
// process.env['PATH']+=`${__dirname};.`;

require('chromedriver');
const { webdriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const mongoose = require('mongoose');

let driver;
    
describe('教職員入口', function(){
    const driver = new Builder().forBrowser('chrome').build();

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('填寫表單', async () => {
        await driver.get('localhost:3000');
        await driver.findElement(By.xpath('/html/body/div[2]/div[1]/a/div/div')).click();
        
        await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/a[1]')).click();
        await driver.sleep(1000);
        await driver.findElement(By.xpath('//*[@id="createNewFormNum"]')).sendKeys('123');
        await driver.findElement(By.xpath('//*[@id="createNewFormBtn"]')).click();
        await driver.sleep(1000);

        const html = await driver.getPageSource();

        expect(html).to.contains('表單填寫');
    });

    describe('進度查詢', function(){
        it('暫存中', async () => {
            await driver.get('localhost:3000');
            await driver.findElement(By.xpath('/html/body/div[2]/div[1]/a/div/div')).click();
            
            await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/a[1]')).click();
            await driver.sleep(1000);
            // 填寫教師ID
            await driver.findElement(By.xpath('//*[@id="createNewFormNum"]')).sendKeys('123');
            await driver.findElement(By.xpath('//*[@id="createNewFormBtn"]')).click();
            await driver.sleep(1000);
            // 暫存
            await driver.findElement(By.xpath('//*[@id="savebt"]')).click();
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//*[@id="btnFinishSaving"]')).click();
            await driver.sleep(1000);

            // 教師入口
            await driver.findElement(By.xpath('/html/body/div[2]/div[1]/a/div/div')).click();
            
            await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/a[4]')).click();
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//*[@id="progressNum"]')).sendKeys('123');
            await driver.findElement(By.xpath('/html/body/div[4]/div/div/div[3]/button[2]')).click();
            await driver.sleep(1000);
            await driver.switchTo().alert().then(() => driver.switchTo().alert().accept(), () => {});

            const html = await driver.getPageSource();

            expect(html).to.contains('暫存中');
        });
        it('查詢錯誤', async () => {
            await driver.get('localhost:3000');
            await driver.findElement(By.xpath('/html/body/div[2]/div[1]/a/div/div')).click();
            
            await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div/a[4]')).click();
            await driver.sleep(1000);
            await driver.findElement(By.xpath('//*[@id="progressNum"]')).sendKeys('123');
            await driver.findElement(By.xpath('/html/body/div[4]/div/div/div[3]/button[2]')).click();
            await driver.sleep(1000);
            await driver.switchTo().alert().then(() => driver.switchTo().alert().accept(), () => {throw Error('沒有pop up')});
        });
    });

    after(() => {
        
        mongoose.connection.db.dropDatabase().then(()=>{
            driver.quit().then(()=>process.exit());
        });
    });
});
