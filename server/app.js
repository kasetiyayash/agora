const http = require("http");
const express = require("express");

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const port = process.env.PORT || 5000;

const appID = "bcbe8ec0346c48f9864327cb900f820c";
const appCertificate = "c2466cfc69b4474ba3eb57d65fa191a1";

const expirationTimeInSeconds = 7200;
const role = RtcRole.PUBLISHER;

const app = express();

const generateRtcToken = function (req, resp) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const channel = req.query.channel;

  // use 0 if uid is not specified
  const uid = req.query.uid || 0;
  if (!channel) {
    return resp.status(400).json({ error: "channel name is required" }).send();
  }

  const key = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channel,
    uid,
    role,
    privilegeExpiredTs
  );

  resp.header("Access-Control-Allow-Origin", "*");
  return resp.json({ key: key }).send();
};

const generateRtmToken = function (req, resp) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const account = req.query.account;
  if (!account) {
    return resp.status(400).json({ error: "account is required" }).send();
  }

  const key = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole,
    privilegeExpiredTs
  );

  resp.header("Access-Control-Allow-Origin", "*");
  return resp.json({ key: key }).send();
};

app.get("/token/rtc", generateRtcToken);
app.get("/token/rtm", generateRtmToken);

http.createServer(app).listen(port, function () {
  console.log("Agora Sign Server starts at " + port);
});
