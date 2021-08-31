const { PROGRAM_FOUNDATIONS, PROGRAM_SPECIALIZATIONS } = require("../util/constants");

class Cohort {

    constructor(number, id, program, trimester) {
        this.number = number;
        this.id = id;
        this.program = program;
        this.trimester = trimester;
    }
}

module.exports = { Cohort }
