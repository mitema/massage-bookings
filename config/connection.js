const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
//const config = require("config");
//const credentialsFilePath = config.get("mongoURI");

let oAuth2Client = null;
let clientObj = {};
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

const getClientOBj = async () => {
  return new Promise((res, reject) => {
    // Load client secrets from a local file.
    fs.readFile("./config/credentials.json", async (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Calendar API.
      const token = await authorize(JSON.parse(content));
      oAuth2Client.setCredentials(JSON.parse(token));
      res(oAuth2Client);
    });
  }).catch(err => {
    console.log(err);
  });
};
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  return new Promise(async (res, reject) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    const readTokenFromFile = async () => {
      return new Promise(async (res, reject) => {
        fs.readFile(TOKEN_PATH, async (err, token) => {
          if (err) {
            const token = await getAccessToken(oAuth2Client);
            oAuth2Client.setCredentials(JSON.parse(token));
          }
          res(token);
        });
      }).catch();
    };
    const token = await readTokenFromFile();
    res(token);
  }).catch(err => {
    console.log(err);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  return new Promise(async (res, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = async question => {
      return new Promise((res, rej) => {
        rl.question(question, answer => {
          res(answer);
          rl.close();
        });
      }).catch(err => {
        console.log(err);
      });
    };

    const code = await askQuestion("Enter code:");

    const retrieveToken = async codeVal => {
      new Promise((res, reject) => {
        Auth2Client.getToken(codeVal, (err, token) => {
          // if (err) return console.error("Error retrieving access token", err);
          res(token);
        });
      }).catch(err => {
        console.log(err);
      });
    };
    const token = await retrieveToken(code);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) return console.error(err);
      console.log("Token stored to", TOKEN_PATH);
    });
    res(token);
  }).catch(err => {
    console.error(err);
  });
}

module.exports = getClientOBj;
