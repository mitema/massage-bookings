const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const util = require("util");
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
  // Load client secrets from a local file.
  const readFile = util.promisify(fs.readFile);
  const result = await readFile("./config/credentials.json");
  if (result) {
    // Authorize a client with credentials, then call the Google Calendar API.
    const authClient = await authorize(JSON.parse(result));
    if (authClient) {
      if (authClient.toString() != "undefined") {
        return authClient;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  const oauthClient = await readTokenFromFile(oAuth2Client);
  return oauthClient;
}
// Check if we have previously stored a token.
const readTokenFromFile = async oAuth2Client => {
  const readFile = util.promisify(fs.readFile);
  let token = null;
  try {
    token = await readFile(TOKEN_PATH);
    if (token) {
      if (token.toString() != "undefined") {
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
      } else {
        return null;
      }
    }
  } catch (err) {
    const res = await getAccessToken(oAuth2Client);
    if (res) {
      if (res.toString() != "undefined") {
        oAuth2Client.setCredentials(JSON.parse(res));
        return oAuth2Client;
      } else {
        return null;
      }
    }
  }
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
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

  const retrieveToken = async code => {
    return new Promise((res, reject) => {
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        if (token.toString() != "undefined") {
          res(token);
        } else {
          res(null);
        }
      });
    }).catch(err => {
      console.log(err);
    });
  };

  const token = await retrieveToken(code);
  // Store the token to disk for later program executions
  const writeToFile = util.promisify(fs.writeFile);
  const fileResult = writeToFile(TOKEN_PATH, JSON.stringify(token));
  if (fileResult) {
    console.log("Token stored to", TOKEN_PATH);
  } else {
    console.log("error storing token");
  }
  return token;
}

module.exports = getClientOBj;
