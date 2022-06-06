import {
  Builder, By, IWebDriverCookie, until, WebDriver
} from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import { log } from '~/config/logger';
import env from '~/config/env';

async function isLoginScreen(driver: WebDriver) {
  try {
    await driver.wait(until.elementLocated(By.css('form[name="user"]')), 1000);
    return true;
  } catch (err) {
    return Promise.resolve(false);
  }
}

async function isHomeScreen(driver: WebDriver) {
  try {
    log.debug('[auth] awaiting url resolve');
    await driver.wait(until.urlContains('https://pmscloud.com/app/home'), 1000);
    return true;
  } catch (err) {
    return Promise.reject(false);
  }
}

async function getCookies(driver: WebDriver) {
  const cookies = await driver.manage().getCookies();
  log.debug('[get cookies invoke] my new cookies', cookies);
  return cookies;
}

async function performLogin(driver: WebDriver) {
  log.debug('[auth] performing login...');
  await driver.findElement(By.name('hotel')).sendKeys(env.pmsCloudId as string);
  log.debug('[login] typed id');
  await driver.findElement(By.name('login')).sendKeys(env.pmsCloudLogin as string);
  log.debug('[login] typed login');
  await driver.findElement(By.name('password')).sendKeys(env.pmsCloudPw as string);
  log.debug('[login] typed password');
  await driver.findElement(By.id('submit')).click();
  log.debug('[login] clicked submit');
}

async function authAndGetCookies(retry = 0): Promise<IWebDriverCookie[]> {
  log.info('creating browser...');
  const chromeOptions = new Options();
  chromeOptions.addArguments('--headless');
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .setChromeService(new ServiceBuilder(env.chromePath))
    .build();
  log.info('created');
  try {
    await driver.get('https://pmscloud.com/app/login');
    log.debug('[auth] got to https://pmscloud.com/app/login and got cookies');
    await getCookies(driver);
    if (await isLoginScreen(driver)) {
      log.debug('[auth] it\'s login screen , logging in');
      await performLogin(driver);
    }
    if (await isHomeScreen(driver)) {
      log.debug('[auth] it\'s home screen, returning cookies');
      return await getCookies(driver);
    }
    log.debug('[auth] it\'s not home screen, retrying...');
    if (retry > env.maxApiRetries) {
      throw new Error('Max retries exceeded');
    }
    return await authAndGetCookies(retry + 1);
  } finally {
    await driver.quit();
  }
}

export { authAndGetCookies };
