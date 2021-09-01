const puppeteer = require('puppeteer');
const { PROGRAM_FOUNDATIONS } = require('./util/constants');
require('dotenv').config()

async function scrap(cohort) {

    const scoresLink = cohort.program === PROGRAM_FOUNDATIONS ? "#scores_1" : "#scores_2";
    const scoresTable = cohort.program === PROGRAM_FOUNDATIONS ? '#scores_all_average_1' : '#scores_all_average_2';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    page.setDefaultTimeout(120000);
    await page.goto('https://intranet.hbtn.io');

    await page.type('#user_login', process.env.INTRANET_USER); // Types instantly
    await page.type('#user_password', process.env.INTRANET_PASSWORD); // Types instantly

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]'),
    ]);

    await page.goto(`https://intranet.hbtn.io/batches/${cohort.id}`);


    await page.click(`a[role="tab"][href="${scoresLink}"]`);

    await page.screenshot({ path: 'example.png' });

    const tdsQuery = `${scoresTable} table tbody tr td`;

    const tds = await page.$$eval(tdsQuery,
        elements => elements.map(element => element.textContent)
    );


    await browser.close();

    return tds;
}

async function getScores(cohort) {
    const tds = await scrap(cohort);

    let finalScores = [];

    let i = 1;
    let j = cohort.trimester + 1;

    for (const score of tds) {

        if (i % j == 0) {
            if (score !== ' ' && !tds[i - (cohort.trimester + 1)].includes('excluded from corrections')) {
                finalScores.push([score]);
            }
            j += cohort.trimester + 2;
        }

        i++;
    }

    return finalScores;
}

module.exports = {
    getScores
}

