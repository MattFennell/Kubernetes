import webdriver from 'selenium-webdriver';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import randomstring from 'randomstring';
import 'geckodriver';
import 'chromedriver';

const expect = chai.expect;
const By = webdriver.By;
const until = webdriver.until;

chai.use(chaiAsPromised);

let url = 'http://gradbankapp-elb-dev-169200502.eu-west-2.elb.amazonaws.com/login';
let browser = 'firefox';

describe('Log-in page', function() {
  describe('should allow a user to log-in', function() {
    describe('with a valid username and passcode', function() {
      let driver;
      let text;
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('username')).sendKeys('tester');
        await driver.findElement(By.id('passcode')).sendKeys('123456');
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver.wait(until.elementLocated(By.id('AccountBalance-Text'))).getText();
      });
      it('should navigate to balance page', function() {
        expect(text).to.equal('Account Balance');
      });
      after(function() {
        driver.quit();
      });
    });
  });

  describe('should NOT allow a user to log-in', function() {
    describe('with an invalid username and passcode', function() {
      let driver;
      let text;
      let errorText = 'Login Unsuccessful';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver
          .findElement(By.id('username'))
          .sendKeys(randomstring.generate({ length: 20, charset: 'alphanumeric' }));
        await driver
          .findElement(By.id('passcode'))
          .sendKeys(randomstring.generate({ length: 6, charset: 'numeric' }));
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "Login Unsuccessful"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });

    describe('with only a username and no passcode', function() {
      let driver;
      let text;
      let errorText = 'All fields must be filled in';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver
          .findElement(By.id('username'))
          .sendKeys(randomstring.generate({ length: 20, charset: 'alphanumeric' }));
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "All fields must be filled in"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });

    describe('with only a passcode and no username', function() {
      let driver;
      let text;
      let errorText = 'All fields must be filled in';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver
          .findElement(By.id('passcode'))
          .sendKeys(randomstring.generate({ length: 6, charset: 'numeric' }));
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "All fields must be filled in"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });

    describe('with no username and no passcode', function() {
      let driver;
      let text;
      let errorText = 'All fields must be filled in';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "All fields must be filled in"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });

    describe('with an invalid passcode', function() {
      let driver;
      let text;
      let errorText = 'Username or Passcode not recognised';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver
          .findElement(By.id('username'))
          .sendKeys(randomstring.generate({ length: 20, charset: 'alphanumeric' }));
        await driver
          .findElement(By.id('passcode'))
          .sendKeys(randomstring.generate({ length: 5, charset: 'numeric' }));
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "Username or Passcode not recognised"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });

    describe('with an invalid username', function() {
      let driver;
      let text;
      let errorText = 'Username or Passcode not recognised';
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('username')).sendKeys('!£$%^&*()');
        await driver
          .findElement(By.id('passcode'))
          .sendKeys(randomstring.generate({ length: 6, charset: 'numeric' }));
        await driver.findElement(By.id('btnLogin')).click();
        text = await driver
          .wait(
            until.elementTextIs(driver.findElement(By.className('error-text')), errorText),
            5000
          )
          .getText();
      });
      it('should display error message "Username or Passcode not recognised"', function() {
        expect(text).to.equal(errorText);
      });
      after(function() {
        driver.quit();
      });
    });
  });
});
