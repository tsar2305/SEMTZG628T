exports.BookingPage =
    class BookingPage {
        constructor(page) {
            this.page = page;
            this.bookingUrl = "https://www.booking.com/";
            this.userName = "//input[@name='username']";
            this.submitButton = "//button[@type='submit']";
            this.otpInput = "#otp_input";
            this.logo = "div[class='Header_logo']";
            this.currencyBtn = "(//button[@type='button'])[1]";
            this.currencyValues = "//span[@class='Picker_selection-text']";
            this.destination = "//*[@data-testid ='destination-container']//input";
            this.autoLocations = "//div[@id='autocomplete-results']//ul/li";
            this.datePicker = "//button[@data-testid='searchbox-dates-container']";
            this.nextDateButton = "//button[@aria-label='Next month']";
            this.currencyFrame = "(//iframe)[7]";
            this.currentDate = "(//h3[@aria-live='polite'])[1]";
            this.dates = "(//table[@role='grid']//tr/td/span)";
            this.signInClose = "button[aria-label='Dismiss sign-in info.']";
            this.occupancyButton = "button[data-testid='occupancy-config']";
            this.cntrlButton = "(//button[@tabindex='-1'])";
            this.occupancyValue = "(//span[@aria-hidden='true'])";
            this.searchResultHeader = "//*[contains(@aria-label,'Search results updated')]";
            this.sortButton = "//*[contains(@data-testid,'dropdown-trigger')]";
            this.Nopaymnt = "(//div[@data-testid='filters-group-container']//*[contains(text(),'No prepayment')])[1]";
            this.showDrpdwn = "(//div[contains(text(),'Show ')])";
        }

        async randomDelay(min = 300, max = 1200) {
            return Number(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        async navigateToPage(url) {
            await this.page.goto(url);
            // await this.page.reload();
            await this.page.waitForLoadState('load');
        }
        async closeSignIn() {
            let close = this.page.locator(this.signInClose);
            if (await close.isVisible()) {
                await close.click();
            }
        }
        async selectDestination(location) {
            await this.page.waitForLoadState('load');
            await this.page.waitForSelector(this.destination);
            await this.page.locator(this.destination).click();
            await this.page.locator(this.destination).clear();
            await this.page.locator(this.destination).fill(location);
            await this.autocomplete(location);
        };
        async autocomplete(value) {
            await this.page.waitForLoadState('load');
            await this.closeSignIn();
            await this.page.locator(("//div[text()='" + value + "']")).waitFor('visible')
            await this.page.locator(("//div[text()='" + value + "']")).click();
        }
        async dynamicText(value) {
            await this.closeSignIn();
            return ("//div[text()='" + value + "']");
        }
        async selectText(value) {
            await this.closeSignIn();
            await (await this.page.waitForSelector("//*[text()='" + value + "']")).click();
        }
        async checkCurrency(value) {
            let currencyTyp = await this.page.locator(this.currencyBtn).textContent();
            if (!(currencyTyp.includes(value))) {
                await this.page.waitForLoadState('load');
                await this.page.locator(this.currencyBtn).click();
                const currentFrame = await this.dynamicText(value);
                await this.page.waitForSelector(currentFrame);
                await this.page.locator(currentFrame).click();
            }
            await this.closeSignIn();
            return await this.page.locator(this.currencyBtn);
        };
        async selectDate(value) {
            let dateValue = value.split('.');
            let day = Number(dateValue[0]);
            let month = dateValue[1];
            let year = Number(dateValue[2]);
            let mnthYr;
            await this.page.waitForSelector(this.datePicker);
            while (true) {
                mnthYr = await this.page.locator(this.currentDate).textContent();
                if (mnthYr.includes(year) && mnthYr.includes(month)) {
                    break;
                }
                await this.page.click(this.nextDateButton);
            }
            const date = await this.page.$$(this.dates);
            await this.page.waitForSelector(this.dates + '[1]');
            for (var dt of date) {
                if ((await dt.textContent()).includes(day)) {
                    await dt.click();
                    await this.page.waitForLoadState('load');
                    return await dt.textContent() + ' ' + mnthYr;
                }
            }

        }
        async occupancy(type, value) {
            await this.page.waitForSelector(this.occupancyButton);
            await this.page.click(this.occupancyButton);
            switch (type) {
                case 'Individuals':
                    var ir = 2;
                    var irV = 14;
                    break;
                case 'Rooms':
                    var ir = 6;
                    var irV = 20;
                    break;
                default:
                    break;
            }
            // await this.page.waitForTimeout(000);
            var val = Number(value);
            var quantity = Number(await this.page.locator(this.occupancyValue + '[' + irV + ']').textContent());
            while (quantity != val) {
                var i = ir;
                if (val < quantity) {
                    i = (ir - 1);
                }
                await this.page.waitForSelector(this.cntrlButton + '[' + i + ']');
                await this.page.locator(this.cntrlButton + '[' + i + ']').click();
                quantity = Number(await this.page.locator(this.occupancyValue + '[' + irV + ']').textContent());
            }
            await this.selectText('Done');
        }
        async filters(value) {
            var valarray = [value];
            await this.closeSignIn();
            var drpdwns = await this.page.$$(this.showDrpdwn);
            for (var drpdwn of drpdwns) {
                await drpdwn.click();
            }
            if (value.includes(',')) {
                valarray = value.split(',');
            }
            for (var i = 0; i < valarray.length; i++) {
                var filter = await this.page.locator("(//div[@data-testid='filters-group-container']//*[contains(text(),'" + valarray[i] + "')])[1]");
                if (await filter.isVisible()) {
                    await this.closeSignIn();
                    await filter.click();
                } else {
                    continue;
                }
            }
        }
    }
