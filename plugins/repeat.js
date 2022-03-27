const Midu = require('../Utilis/events');
const {MessageType} = require('@adiwajshing/baileys');
const Config = require('../config');
const fs = require('fs');

const RE_DESC = "Repeat text simply."
    
    Midu.addCommand({pattern: 're', fromMe: true, desc: RE_DESC}, (async (message, match) => {    
      const items = match.split(",")
      if (items.length < 2) return await message.sendMessage("\n```Example .re hi,2");
      const text = items[0];
      const amo = items[1];
      
      const result = text.repeat(amo);
      
            await message.sendMessage(message.jid, result, MessageType.text);

    }));