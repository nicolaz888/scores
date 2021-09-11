const puppeteer = require('puppeteer');
const { PROGRAM_FOUNDATIONS } = require('./util/constants');

async function scrap(cohort) {

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


    await page.click(`a[role="tab"][href="#scores"]`);

    await page.screenshot({ path: 'example.png' });

    const tdsQuery = `${scoresTable} table tbody tr td`;

    const tds = await page.$$eval(tdsQuery,
        elements => elements.map(element => element.textContent)
    );


    await browser.close();

    return tds;
}

async function getScores(cohort) {
    try {
        const tds = await scrap(cohort);

        let finalScores = [];

        const trimester = cohort.program == PROGRAM_FOUNDATIONS ? cohort.trimester : cohort.trimester - 3;

        let i = 1;
        let j = trimester + 1;

        for (const score of tds) {

            if (i % j == 0) {
                if (score !== ' ' && !tds[i - (trimester + 1)].includes('excluded from corrections') && !tds[i - (trimester + 1)].includes('inactive')) {
                    finalScores.push([parseFloat(score)]);
                }
                j += trimester + 2;
            }

            i++;
        }

        console.log(finalScores);

        return finalScores;
    }
    catch (error) {
        console.log(`error en getScores: ${error}`);
    }
}

module.exports = {
    getScores
}

