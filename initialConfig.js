import { remote } from "webdriverio";

const browser = await remote({
  capabilities: {
    browserName: "chrome",
  },
});

export { browser };
