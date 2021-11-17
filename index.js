import fs from "fs";
import { Parser } from "json2csv";
import { browser } from "./initialConfig.js";
import * as constants from "./constants.js";
import { stringFormatter } from "./utils.js";

(async () => {
  let olxData = [];
  await browser.url(constants.INITIAL_URL);
  await browser.$(constants.INPUT_SELECTOR).setValue(constants.KEY_WORD);
  await browser.$(constants.BUTTON_SELECTOR).click();
  //FIX TO REDIRECT FROM SEARCH SCREEN
  const initialRedirect = await browser
    .$('a[data-cy="listing-ad-title"]')
    .getAttribute("href");
  //REMOVE THIS REDIRECT LATER
  await browser.url("https://www.olx.ua/d/obyavlenie/prodam-iphone-8-IDN3pl5.html?sd=1#573a179f52;promoted");
  for (let index = 0; index < 100; index++) {
    const redirectRef = await browser
      .$(constants.SELECTOR_TO_REDIRECT)
      .getAttribute("href");

    if (index !== 0) {
      await browser.url(constants.INITIAL_URL + redirectRef);
    }

    const title = await browser.$(constants.TITLE_SELECTOR).getText();
    const price = await browser.$(constants.PRICE_SELECTOR).getText();
    const description = await browser
      .$(constants.DESCRIPTION_SELECTOR)
      .getText();

    const phoneData = {
      title: stringFormatter(title),
      price: stringFormatter(price),
      description: stringFormatter(description),
    };

    olxData.push(phoneData);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(olxData);

    fs.writeFileSync("./olx.csv", csv, "utf-8");
  }

  await browser.deleteSession();
})();
