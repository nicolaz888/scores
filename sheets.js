const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { arrColumnIndex } = require('./util/constants');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
function sheets(cohort, values) {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), updateSheet, cohort, values);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, cohort, values) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, cohort, values);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function updateSheet(auth, cohort, values) {

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = process.env.SHEET_ID;

        let sheet = `C${cohort.number} T${cohort.trimester}`;

        //TODO: temp brrar cuando no haya cohorte bis
        if (cohort.id == 97) {
            sheet = `C${cohort.number}BIS T${cohort.trimester}`;
        }

        const request = {
            spreadsheetId,
            range: `${sheet}!B2:N2`
        };

        const responseData = (await sheets.spreadsheets.values.get(request)).data;

        const today = new Date();

        const dateWeeks = responseData.values;

        let column = 'Q';
        let i = 1;

        for (const item of dateWeeks[0]) {

            const date = new Date(`${item}, 2021`);
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + 6);

            if (date <= today && today <= newDate) {
                console.log(item);
                column = arrColumnIndex[--i].column;
                break;
            }

            i++;
        }

        const range = `${sheet}!${column}3:${column}${values.length + 2}`;

        const valueInputOption = 'RAW';
        const resource = {
            values,
        };

        sheets.spreadsheets.values.update(
            {
                spreadsheetId,
                range,
                valueInputOption,
                resource,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('%d cells updated.', result.data.updatedCells);
                }
            }
        );

    }
    catch (error) {
        console.log(`Error in updateSheet: ${error}`);
    }
}


module.exports = {
    sheets
}