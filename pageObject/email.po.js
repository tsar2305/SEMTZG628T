exports.EmailPage =
    class EmailPage {
        constructor(page) {
            this.page = page;
            this.emailUrl = "https://www.mailinator.com";
            this.username = "//input[@id='search']";
            this.inboxTable = "(//table)[3]";

        }

        async navigateToPage(url) {
            await this.page.goto(url);
            await this.page.waitForLoadState('load');
        };
        async selectText(value) {
            await (await this.page.waitForSelector("//*[text()='" + value + "']")).click();
        }
    }