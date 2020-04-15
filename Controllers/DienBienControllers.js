const mssql = require('mssql')
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/documents.readonly'];
const TOKEN_PATH = 'token.json';
const credentials = {"installed":{"client_id":"415187441562-g2pbakahcekf0cn3qua9jrnrg2anngvf.apps.googleusercontent.com","project_id":"quickstart-1582879478051","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"b9FthwPmibomWRYw8lAqFGjy","redirect_uris":["http://localhost/auth/callback"]}}
const { client_secret, client_id, redirect_uris } = credentials.installed;
global.o2Auth = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
)
fs.readFile(TOKEN_PATH, (err, token) => {
  if (err) return getAccessToken(gg_authen);
  o2Auth.setCredentials(JSON.parse(token));
});
function getAccessToken(oAuth2Client) {
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
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        // callback(oAuth2Client);
      });
    });
  }
exports.DuDieuKien = async (req,res) => {
    const fileid = '1V0Drkhfg5o4XYDRnDWj5It745PKlVBbdN2wM6YPrMTM'
    const docx = google.docs({version:'v1',auth:o2Auth})
}
