const { getStudentsFromCohort } = require('./holberton');
const { Cohort } = require('./models/cohort');
const { getScores } = require('./scraper');
const { sheets } = require('./sheets');
const { PROGRAM_SPECIALIZATIONS, PROGRAM_FOUNDATIONS } = require('./util/constants');

// hola
const cohortEleven = new Cohort(11, 33, PROGRAM_SPECIALIZATIONS, 3);
const cohortTwelve = new Cohort(12, 46, PROGRAM_SPECIALIZATIONS, 2);
const cohortThirteen = new Cohort(13, 58, PROGRAM_SPECIALIZATIONS, 1);
const cohortFourteen = new Cohort(14, 78, PROGRAM_FOUNDATIONS, 3);
const cohortFifteen = new Cohort(15, 113, PROGRAM_FOUNDATIONS, 2);

cohorts = [cohortEleven]

main = async () => {
    try {
        const result = await getScores(cohortTwelve);

        if (result) {

            // const data = result.sort((a, b) => {
            //     return a.first_name == b.first_name ? 0 : a.first_name > b.first_name ? 1 : -1;
            // });

            // const scores = data.map(element => [element.product.average])

            // console.log(data);
            sheets(result);
        }
        else {
            console.log("sin rspuesta de la intranet");
        }
    }
    catch (error) {
        console.log(`error en main: ${error}`);
    }
}

main();