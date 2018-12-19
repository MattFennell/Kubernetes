import webdriver from 'selenium-webdriver';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'geckodriver';
import 'chromedriver';

const expect = chai.expect;
const By = webdriver.By;
const until = webdriver.until;

chai.use(chaiAsPromised);

let url = 'http://gradbankapp-elb-dev-169200502.eu-west-2.elb.amazonaws.com/login';
let browser = 'firefox';

describe('Transactions page', function() {
  let driver;

  describe('should display', function() {
    describe('for all users', function() {
      let name;
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('username')).sendKeys('user');
        await driver.findElement(By.id('passcode')).sendKeys('123456');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.wait(until.elementLocated(By.id('AccountBalance-Text'))).getText();
        name = await driver.wait(until.elementLocated(By.id('name'))).getText();
      });
      after(function() {
        driver.quit();
      });
      it('account owners name', function() {
        expect(name).to.equal('Gary Campbell');
      });
    });
    describe('for user with transactions', function() {
      let payee;
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('username')).sendKeys('user');
        await driver.findElement(By.id('passcode')).sendKeys('123456');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.wait(until.elementLocated(By.id('AccountBalance-Text'))).getText();
        payee = await driver.wait(until.elementLocated(By.className('payee'))).getText();
      });
      after(function() {
        driver.quit();
      });
      it('payee name', function() {
        expect(payee).to.not.equal(null);
      });
    });
    describe('for users with no transactions', function() {
      let newUserMessage;
      before(async function() {
        driver = await new webdriver.Builder().forBrowser(browser).build();
        await driver.get(url);
        await driver.findElement(By.id('username')).sendKeys('tester');
        await driver.findElement(By.id('passcode')).sendKeys('123456');
        await driver.findElement(By.id('btnLogin')).click();
        newUserMessage = await driver
          .wait(until.elementLocated(By.id('no-transactions-message')))
          .getText();
      });
      after(function() {
        driver.quit();
      });
      it('payee name', function() {
        expect(newUserMessage).to.equal('Hi! Thanks for joining Scott Cash!');
      });
    });
  });
});
