const axios = require('axios');
const crypto = require('crypto');

const apiPath = '/api/v1/students/2247';
const url = 'https://intranet.hbtn.io' + apiPath;

const key = 'be68b42c-5f08-4e0a-9061-49f3ee2571f5';
const secret = 'ae1e460105f60cfc80347cd9d9a4c9afbe050c6ffe4c69ad9bd0b145c316c335342ec99696fa3128';

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

        console.log(result.data);
    }
    catch (error) {
        console.log(`foooc: ${error}`);
        return null;
    }
}

getStudentsFromCohort();
