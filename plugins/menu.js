const fs = require('fs')
const Asena = require('../Utilis/events');
const {MessageType, Mimetype } = require('@adiwajshing/baileys');

    Asena.addCommand({on: 'text', fromMe: true}, (async (message, match) => {   


        var uri = encodeURI(match[1])
const array = ['MENU','DETAILS']
array.map( async (a) => {
let pattern = new RegExp(`\\b${a}\\b`, 'g');
if(pattern.test(message.message)){
  if (a==='MENU') {
    await message.client.sendMessage(message.jid,'MENU SELECTED',MessageType.text);
  }else{
    await message.client.sendMessage(message.jid,'DETAILS SELECTED',MessageType.text);
}
});

}));