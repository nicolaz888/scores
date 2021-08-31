require('dotenv').config()
const axios = require('axios');
const crypto = require('crypto');

const apiPath = '/api/v1/cohorts/113/students';
const url = 'https://intranet.hbtn.io' + apiPath;

const key = process.env.API_KEY;
const secret = process.env.API_SECRET;

const timestamp = Math.floor(Date.now() / 1000);

const method = 'GET';

const preSignature = `timestamp=${timestamp}&${method}${apiPath}${secret}`;
// console.log('preSignature: ' + preSignature);

// const signature = crypto.createHash('sha1').update(preSignature).digest('hex').toLowerCase();
const signature = crypto.createHash('sha1').update(preSignature).digest('hex');
// console.log('signature: ' + signature);

const token = Buffer.from(`${key}:${signature}`).toString('base64');
// console.log('token: ' + token);

const options = {
    method: 'GET',
    url,
    headers: {
        'HBTN_TOKEN': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    params: {
        timestamp
    }
}

async function getStudentsFromCohort() {
    try {
        const result = await axios(options);

        return result.data.items;
    }
    catch (error) {
        console.log(`foooc: ${error}`);
        return null;
    }
}

module.exports = {
    getStudentsFromCohort
}
