let views = (function views() {
    return {
        Intent: {
            Launch: {
                ask: "Hi there, I'm Devy, your personal programming assistant. What can I help you with?",
                reprompt: "Not sure what I can do for you? No problem! Just say help and I'll let you know.",
            },
            Help: {
                ask: "You can see a full list of things I can do in the companion app.",
                reprompt: "Say a command listed in the companion app.",
            },
            Cancel: {
                tell: "Goodbye.",
            },
            Unreachable: {
                tell: "You shouldn't be hearing this."
            },
        }
    }
});

module.exports = views;
