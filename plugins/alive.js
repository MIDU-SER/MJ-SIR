/* Amalser Bot
Re-edit Amalser
*/

const Midu = require('../Utilis/events');
const {MessageType, GroupSettingChange, Mimetype, MessageOptions} = require('@adiwajshing/baileys');
const fs = require('fs');


Midu.addCommand({pattern: 'alive', fromMe: true, dontAddCommandList: true}, (async (message, match) => {
    const buttons = [
        {buttonId: 'id1', buttonText: {displayText: 'MENU' }, type: 1},
        {buttonId: 'id2', buttonText: {displayText: 'DETAILS' }, type: 1}
      ]
      
      const buttonMessage = {
          contentText: "```I'm Alive....😍```\n\n\n_Click Below For More_",
          footerText: '© MIDLAJ',
          buttons: buttons,
          headerType: 1
      }
      
      await message.client.sendMessage(message.jid, buttonMessage, MessageType.buttonsMessage)

}));
