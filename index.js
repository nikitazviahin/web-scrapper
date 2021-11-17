import fs from "fs";
import { Parser } from "json2csv";
import { browser } from "./initialConfig.js";
import * as constants from "./constants.js";
import { stringFormatter } from "./utils.js";

(async () => {
  let olxData = [];

  //initial keyword processing
  await browser.url(constants.INITIAL_URL);
  await browser.$(constants.INPUT_SELECTOR).setValue(constants.KEY_WORD);
  await browser.$(constants.BUTTON_SELECTOR).click();
  await browser.$(constants.INITIAL_REDIRECT_SELECTOR).click();

  //the main data-parser loop, specify how many pages do you need to go through inside loop, 100 for now
  for (let index = 0; index < 100; index++) {
    //redirect to next similar product
    const redirectRef = await browser
      .$(constants.SELECTOR_TO_REDIRECT)
      .getAttribute("href");

    //to get data from first page after initial redirect, skip the redirect
    if (index !== 0) {
      await browser.url(constants.INITIAL_URL + redirectRef);
    }


    //selectors
    const title = await browser.$(constants.TITLE_SELECTOR).getText();
    const price = await browser.$(constants.PRICE_SELECTOR).getText();
    const description = await browser
      .$(constants.DESCRIPTION_SELECTOR)
      .getText();

    //trim and format data for csv file
    const phoneData = {
      title: stringFormatter(title),
      price: stringFormatter(price),
      description: stringFormatter(description),
    };

    olxData.push(phoneData);

    //save to csv file
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(olxData);

    fs.writeFileSync("./olx.csv", csv, "utf-8");
  }

  await browser.deleteSession();
})();
