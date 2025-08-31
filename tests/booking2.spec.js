const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../pageObject/booking.po');
const { EmailPage } = require('../pageObject/email.po');  
const { Data } = require('../pageObject/data.po');  
test.setTimeout(60000);
test('Search Filtering by date, location', async ({page}) => {
     /**Home Page========================================== */
    const booking = new BookingPage(page);
    //Navigation to Booking Url
    await booking.navigateToPage(booking.bookingUrl);
    await page.waitForSelector(booking.logo);
    //Assuring the page has loaded properly
    expect(await page.locator(booking.logo).isVisible()).toBeTruthy();
    expect(await page.locator(booking.currencyBtn).isVisible()).toBeTruthy();
    //Verifying and Changing Currency
    expect((await booking.checkCurrency('INR'))).toHaveText('INR');
    //Destination Selection and Verification
    await booking.selectDestination('Kolkata')
    expect(await page.locator(booking.destination).getAttribute('value')).toContain('Kolkata');
    //Scheduling Visit via Calender
    // let configDate = dt.Arrival.split('.');
    // configDate =Number(configDate[0]) + ' ' + configDate[1];
    expect(await booking.selectDate('01.Sept.2025')).toContain('01.Sept.2025');
    // configDate = dt.Departure.split('.');
    // configDate = Number(configDate[0]) + ' ' + configDate[1];
    expect(await booking.selectDate('02.Sept.2025')).toContain('02.Sept.2025');
    //Occupancy Selection
    await booking.occupancy("Individuals", 2);
    expect(await page.locator(booking.occupancyButton).textContent()).toContain(2 + " adult");
    await booking.occupancy("Rooms", 1);
    expect(await page.locator(booking.occupancyButton).textContent()).toContain(1 + " room");
    await booking.selectText('Search');
    /**Search Result Page========================================== */
    await page.waitForSelector(booking.searchResultHeader);
    await page.waitForSelector(booking.Nopaymnt);
    await page.click(booking.Nopaymnt);
    await booking.filters(dt.Filter)
    

    // page.locator().
    
})
    test('Email Verification@run',async({page})=>{
 /**Email Credential Page========================================== */
    const email = new EmailPage(page);
    //Navition to email
    await email.navigateToPage(email.emailUrl);
    //Inputing Credentials to login
    await page.waitForSelector(email.username);
    await page.type(email.username,'testing24061459@mailinator.com',{delay:120});
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    /**Inbox Page========================================== */
    
    // await page.waitForSelector(email.inboxTable);
     
})