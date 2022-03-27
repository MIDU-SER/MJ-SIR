/* Copyright (C) 2022 MIDU-SER.*/

const Midu = require('../Utilis/events');
const {MessageType} = require('@adiwajshing/baileys');
const con = require('../config');

const ENDESC = "Roll dice randomly."
const ENSEN = "🍀 ```Rolling Dice!``` 🎲"
const ENSON = "```Dice Rolled:``` "

        Midu.addCommand({pattern: 'roll', fromMe: true, desc: ENDESC}, (async (message, match) => {

            await message.client.sendMessage(message.jid, ENSEN, MessageType.text);
            await new Promise(r => setTimeout(r, 4000));

            // Numbers
            var r_text = new Array ();
            r_text[0] = "🎲 *1* 🎲";
            r_text[1] = "🎲 *2* 🎲";
            r_text[2] = "🎲 *3* 🎲";
            r_text[3] = "🎲 *4* 🎲";
            r_text[4] = "🎲 *5* 🎲";
            r_text[5] = "🎲 *6* 🎲";

            var i = Math.floor(6*Math.random())

            await message.client.sendMessage(message.jid, ENSON + `${r_text[i]}`, MessageType.text);

        }));