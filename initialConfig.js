import { remote } from "webdriverio";

//browser configuration
const browser = await remote({
  capabilities: {
    browserName: "chrome",
  },
});

export { browser };
