# Devy Client
Responds to [Devy] skill requests from Alexa.

## Description
The client application watches which files you are working on so that it can respond appropriately to requests. Depending on your workflow and environment, the app may also make requests to other APIs on your behalf (e.g. GitHub).

Note: the client app runs exclusively on your local machine. Only, the Alexa response message is sent to Amazon.

## Usage
The Devy client app uses [PM2] to daemonize the node application during deployment. See the pm2 [cheatsheet] for a list of commands you can use to manage the app.

To start the client, run
```sh
pm2 start devy-client
```

To stop the client, run
```sh
pm2 stop devy-client
```

## Installation
  1. Install [Node.js] (tested with v6.5.0).  
  2. Install PM2 `npm install pm2 -g` (tested with v2.4.6). Note: if you get an EACCES error [fix your npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions).  
      a. Configure the [PM2 startup script] `pm2 startup`.
  3. Download the latest release from the [Devy project] page.  
      a. Extract the client.zip and `cd` into the extracted directory.  
      b. Modify the `.env` file in the project root.  
      d. Run the deploy script `npm deploy`.  

## Supported voice commands
  - _"Alexa, ask Devy how many issues I have."_

## FAQ


[Devy]: https://nickbradley.github.io/devy
[PM2]: http://pm2.keymetrics.io/
[cheatsheet]: http://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet
[PM2 startup script]: http://pm2.keymetrics.io/docs/usage/quick-start/#setup-startup-script
[Devy project]: https://github.com/nickbradley/devy/releases
[Node.js]: https://nodejs.org/en/
