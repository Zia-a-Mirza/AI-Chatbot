const { messageLink } = require("discord.js");

module.exports = (response) => {

    //Generate a random number to determine response variation
    let random = Math.floor(Math.random() * 4) + 1;
    console.log(response);

    //Replace the emotions with their corresponding emojis
    const emotes = {
        "<excited>": [":smile:", ":relieved:"],
        "<happy>": [":smile:", ":blush:"],
        "<sad>": [":cry:", ":sob:"],
        "<angry>": [":face_with_symbols_over_mouth:", ":angry:"],
        "<confused>": [":face_with_raised_eyebrow:", ":face_with_monocle:"],
        "<disapointed>": [":unamused:", ":pensive:", ":disappointed:"],
        "<nervous>": ":sweat:",
        "<mad>": ":rage:",
        "<offended>": ":head_bandage:",
        "<smug>": ":smirk:",
        "<calm>": ":face_exhaling:",
        "<shy>": ":sweat:",
        "<relieved>": ":sweat_smile:",
        "<curious>": ":thinking:",
        "<worried>": ":cold_sweat:",
        "<proud>": ":innocent:",
        "<depressed>": ":cry:",
        "<love>": ":smiling_face_with_3_hearts:",
        "<bored>": ":yawning_face:",
        "<annoyed>": ":neutral_face:",
        "<defiant>": ":triumph:",
        "<nervous>": ":no_mouth:",
        "<shocked>": ":exploding_head:",
        "<blushing>": ":flushed:",
        "<conflicted>": ":worried:",
        "<tired>": ":sleeping:",
        "<scared>": ":cold_sweat:"
    };
    
    Object.keys(emotes).forEach(emote => {
        let newEmote = emotes[emote];
        if (response.includes(emote)) {
            if (Array.isArray(newEmote)) {
                newEmote = newEmote[random > 2 ? 0 : 1];
            }
            response = response.replace(emote, newEmote);
            //Add in extra words depending on the context
            if (emote === "<shocked>" && random > 2) {
                response = "Wow" + response;
            } else if (emote === "<nervous>" && random > 2) {
                response = "Uhh" + response;
            }
        }
    });

    //Cut off undefined emotes
    response.trim;
    if (response.includes("<") && !response.includes("<:")) {
        response = response.split("<")[0];
    } 
    

    //Change the vocabulary of the bot to be more casual
    const vocab = [
        { old: "be right back", new: "brb" },
        { old: "definitely", new: "def" },
        { old: "so much", new: "sm" },

    ];
    
    vocab.forEach(word => {
        response = response.replace(word.old, word.new);
    });

    return response;

}