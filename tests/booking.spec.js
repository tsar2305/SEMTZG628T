const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../pageObject/booking.po');
const { EmailPage } = require('../pageObject/email.po');  
const { Data } = require('../pageObject/data.po');  
test.setTimeout(60000);
const{xlsx}=require('xlsx');
var page;
let testData =[];

// const { firefox } = require('playwright-extra');
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// firefox.use(StealthPlugin());

// test('Register Member using OTP Extraction', async () =>{

//   const browser = await firefox.launch({
//     headless: false,
//     slowMo: 100 // slow down actions to mimic human behavior
//   });
//   const context = await browser.newContext({
//     userAgent: 'Mozilla/141.0 (Windows NT 11.0; Win64; x64)',
//     viewport: { width: 1280, height: 800 },
//     locale: 'en-US'
//   });
//   const page1 = await context.newPage();
//   // Navigate to Booking.com registration page
//   const booking = new BookingPage(page1);
//   await page1.goto('https://www.booking.com/');
//   // Click on "Register"
//   await page1.click('text=Register');
//   // Wait for email input and simulate typing
//   await page1.waitForSelector('input[name="username"]');
//   await page1.type('input[name="username"]', 'testing2406@mailinator.com', { delay: 120 });
//   await page1.waitForTimeout(3000); 
//   // await page1.click('button[type="submit"]');
//   await page1.keyboard.press('Enter');
//   await page1.waitForTimeout(3000); 
// //   await page1.waitForSelector(booking.otpInput);

// });
test.describe('DataDriven Hotel Booking', () => {
  
  const data = new Data();
  //reading testData Sheet
  testData = data.readExcel('data/testData.xlsx', 'Sheet1');
   // array of dataset
  console.log('Loaded testData:', testData);


test.beforeEach('Open Url', async ({ browser }) => {
//Making new Page 
  page = await browser.newPage();
  page.waitForLoadState('load');
});
test.afterEach('Close all Pages',async()=>{
//Closing Page after Execution
    await page.close();
})
for(const dt of testData){
test('Search Filtering by date, location '+dt.SerialNo, async () => {
    // test('Search Filtering by date, location', async ({page}) => {
     /**Home Page========================================== */
    const booking = new BookingPage(page);
    //Navigation to Booking Url
    await booking.navigateToPage(booking.bookingUrl);
    await page.waitForSelector(booking.logo);
    //Assuring the page has loaded properly
    expect(await page.locator(booking.logo).isVisible()).toBeTruthy();
    expect(await page.locator(booking.currencyBtn).isVisible()).toBeTruthy();
    //Verifying and Changing Currency
    expect((await booking.checkCurrency(dt.Currency))).toHaveText(dt.Currency);
    //Destination Selection and Verification
    await booking.selectDestination(dt.Destination)
    expect(await page.locator(booking.destination).getAttribute('value')).toContain(dt.Destination);
    //Scheduling Visit via Calender
    let configDate = dt.Arrival.split('.');
    configDate =Number(configDate[0]) + ' ' + configDate[1];
    expect(await booking.selectDate(dt.Arrival)).toContain(configDate);
    configDate = dt.Departure.split('.');
    configDate = Number(configDate[0]) + ' ' + configDate[1];
    expect(await booking.selectDate(dt.Departure)).toContain(configDate);
    //Occupancy Selection
    await booking.occupancy("Individuals", dt.member);
    expect(await page.locator(booking.occupancyButton).textContent()).toContain(dt.member + " adult");
    await booking.occupancy("Rooms", dt.Room);
    expect(await page.locator(booking.occupancyButton).textContent()).toContain(dt.Room + " room");
    await booking.selectText('Search');
    /**Search Result Page========================================== */
    await page.waitForSelector(booking.searchResultHeader);
    await page.waitForSelector(booking.Nopaymnt);
    await page.click(booking.Nopaymnt);
    await booking.filters(dt.Filter)
    

    // page.locator().
    
})
test('Email Verification '+dt.SerialNo,async()=>{
    // test('Email Verification',async({page})=>{
 /**Email Credential Page========================================== */
    const email = new EmailPage(page);
    //Navition to email
    await email.navigateToPage(email.emailUrl);
    //Inputing Credentials to login
    await page.waitForSelector(email.username);
    await page.type(email.username,dt.email,{delay:120});
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    /**Inbox Page========================================== */
    // await page.waitForSelector(email.inboxTable);
     
})
}
});