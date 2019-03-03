import Log from "../util";
let Voxa = require("voxa");


export type AlexaEvent = any;

export function register(skill:any) {
    skill.onState("entry", {
        LaunchIntent: "launch",
        "AMAZON.HelpIntent": "help",
        "AMAZON.CancelIntent": "cancel",
    });


    skill.onState("launch", (alexaEvent: AlexaEvent) => {
        return {reply: "Intent.Launch", to: "entry"}
    });

    skill.onState("help", (alexaEvent: AlexaEvent) => {
        return {reply: "Intent.Help", to: "entry"}
    });

    skill.onState("cancel", () => {
        return {reply: "Intent.Cancel", to: "entry"}
    });
}

