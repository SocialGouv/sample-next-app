exports.config = {
  output: "./output",
  rerun: {
    // run 4 times until 1st success
    minSuccess: 1,
    maxReruns: 5,
  },
  helpers: {
    Puppeteer: {
      restart: true,
      keepCookies: false,
      uniqueScreenshotNames: true,
      chrome: {
        args: process.env.CI
          ? ["--no-sandbox", "--disable-setuid-sandbox"]
          : ["--window-size=1024,1024"],
        defaultViewport: {
          width: 1024,
          height: 1024,
        },
        executablePath:
          (process.env.CI && "/usr/bin/chromium-browser") ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: process.env.CI ? true : !process.env.CODECEPT_HEADED,
      },
      url: process.env.CODECEPT_BASEURL || "http://localhost:3000",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  mocha: {},
  bootstrap: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: "../../features/**/*.feature",
    steps: ["./step_definitions/global.js"],
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
    autoLogin: {
      enabled: true,
      saveToFile: false,
      inject: "loginAs",
      users: {
        admin: {
          login: (I) => {
            I.amOnPage("/login");
            I.fillField("input[type=email]", "sre@fabrique.social.gouv.fr");
            I.fillField("input[type=password]", "admin");
            I.click("Se connecter", "form");
          },
          // Todo: make the check work
          // check: (I) => {
          //   I.amOnPage("/admin");
          // },
          // fetch: () => true,
        },
        unknown: {
          login: (I) => {
            I.amOnPage("/login");
            I.fillField("input[type=email]", "unknown@somewhere.com");
            I.fillField("input[type=password]", "password");
            I.click("Se connecter", "form");
          },
        },
      },
    },
  },
  tests: "./specs/*_test.js",
  name: "sample-next-app",
};
