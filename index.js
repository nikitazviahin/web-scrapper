import fs from "fs";
import { Parser } from "json2csv";
import { browser } from "./initialConfig.js";
import * as constants from "./constants.js";
import { stringFormatter } from "./utils.js";

(async () => {
  let olxData = [];
  await browser.url(constants.INITIAL_URL);
  for (let index = 0; index < 100; index++) {
    const redirectRef = await browser
      .$(constants.SELECTOR_TO_REDIRECT)
      .getAttribute("href");

    if (index !== 0) {
      await browser.url("https://www.olx.ua" + redirectRef);
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
