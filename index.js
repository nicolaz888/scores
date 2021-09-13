const { Cohort } = require('./models/cohort');
const { getScores } = require('./scraper');
const { sheets } = require('./sheets');
const { PROGRAM_SPECIALIZATIONS, PROGRAM_FOUNDATIONS } = require('./util/constants');
require('dotenv').config()

const cohortEleven = new Cohort(11, 33, PROGRAM_SPECIALIZATIONS, 6);
const cohortElevenBis = new Cohort(11, 97, PROGRAM_SPECIALIZATIONS, 6);
const cohortTwelve = new Cohort(12, 46, PROGRAM_SPECIALIZATIONS, 5);
const cohortThirteen = new Cohort(13, 58, PROGRAM_SPECIALIZATIONS, 4);
const cohortFourteen = new Cohort(14, 78, PROGRAM_FOUNDATIONS, 3);
const cohortFifteen = new Cohort(15, 113, PROGRAM_FOUNDATIONS, 2);

const arrCohorts = [cohortElevenBis, cohortTwelve, cohortThirteen, cohortFourteen, cohortFifteen];

main = async () => {
    try {
        for (const cohort of arrCohorts) {
            const result = await getScores(cohort);

            if (result) {
                sheets(cohort, result);
            }
            else {
                console.log('sin respuesta de la intranet');
            }
        }
    }
    catch (error) {
        console.log(`error en main: ${error}`);
    }
}

main();