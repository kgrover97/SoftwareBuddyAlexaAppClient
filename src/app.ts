import Log from "./util";
import WebSocketClient from "./webSocketClient";

let Voxa = require("voxa");
let views = require("./skill/views");
let controllers = require("./skill/controllers");

// This can be found in the Amazon devloper portal either by clicking "View Skill ID",
// or by trying to send a request from the skill testing web page.
// https://developer.amazon.com/edw/home.html#/skills
const appId = "amzn1.ask.skill.7b0f5538-bfcf-4c29-9c7e-dd7e640f0826";

// Validate that all required environment variables have been set
if (!process.env.PROXY_ADDRESS) {
  Log.error(`FATAL - Required environment variable 'PROXY_ADDRESS' is not set.`);
  process.exit(1);
}
if (!process.env.ALEXA_USERID) {
  Log.error(`APP - Required environment variable 'ALEXA_USERID' is not set.`);
  process.exit(1);
}


(async () => {
  let host = process.env.PROXY_ADDRESS;
  let user = process.env.ALEXA_USERID;

  let ws = new WebSocketClient(host, user);
  Log.info(`APP - Connecting to proxy ${host}...`);

  ws.open().then(async () => {
    Log.info(`APP - Connected to proxy.`);
    Log.trace("APP - Starting Alexa request handler...");

    let skill = new Voxa({ views });
    controllers.register(skill);
    ws.registerMessageListener(async (req:any) => {
      Log.info(`APP - Received Alexa ${req.request.type} in ${req.session.new ? "a new" : "an existing"} session.`);
      if (req.request.intent)
        console.log(`\tIntent name: ${req.request.intent.name}`);
      if (req.session.attributes) {
        console.log(`\tIntent state: ${req.session.attributes.state || "NONE" }`)
        console.log(`\tModel data:`, req.session.attributes.modelData || {});
      }
      return await skill.execute(req);
    });

    Log.trace("APP - **READY**. Waiting for requests.");
  }).catch((err) => {
    Log.error(`Failed to start Devy-client. ${err}`);
  });
})();
