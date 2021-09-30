const Discord = require("discord.js");
// const { Client, Intents } = require('discord.js');
// const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const client = new Discord.Client();
const { token } = require('./config.json');
const ytdl = require("ytdl-core");
const yts = require('yt-search');

const { getCovidData } = require('./function/covid.js');
const { getTotalData } = require('./function/opgg.js');

client.on('ready', () => {
    console.log('higg 봇이 대기중입니다!!');
    client.user.setActivity('higg h', { type: 'LISTENING' });
});

client.login(token);

client.on('message', async message => {
    let msg = message.content;
    if (msg.indexOf("higg") === -1 || message.author.bot) return;

    let idx = msg.indexOf(" ");
    if (idx < 0) {
        sendMsg('higg 입니다. 명령어 목록을 보려면 "higg h"를 입력해주세요.', message)
        return;
    }

    let command = msg.substr(idx + 1, 1);
    switch (command) {
        case "h":
            sendMsg("[higg c] : 코로나 현황을 알 수 있습니다.\n[higg o 닉네임] : 전적을 검색 할 수 있습니다.\n[higg y 노래제목] : 노래를 재생할 수 있습니다.", message);
            break;
        case "c":
            getCovidData().then((v) => {
                sendMsg(v.result, message);
            });
            break;
        case "o":
            let opggValue = msg.substr(idx + 1);
            let nickName = opggValue.substr(2);
            getTotalData(nickName).then((v) => {
                sendMsg(v.result, message);
            });
            break;
        case "핑":
            sendMsg("퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁웊웊웊웊웊웊웊웊웊웊웊웊웊웊", message);
            break
        case "y":
            let musicName = msg.substr(idx + 3);
            if(msg.substring(idx + 2, idx + 3) !== " " || musicName.length <= 0){
                sendMsg("노래 제목이 안적혔거나, 명령어가 잘못 입력되었습니다.", message);
                return;
            }

            if(musicName === "s"){
                message.member.voice.channel.leave();
                return;
            } 
            if(message.member.voice.channel){
                const r = await yts(musicName);
                const videos = r.videos.slice(0, 1);
                let musicInfo = videos[0];

                const connection = await message.member.voice.channel.join().then(connection =>{
                    let ment = musicInfo.title + "를(을) 재생합니다.\n"+musicInfo.url;
                    sendMsg(ment, message);

                    const musicPaly = connection.play(
                        ytdl(musicInfo.url, { filter: "audioonly" })
                    );
                });
            }else{
                sendMsg("먼저 음성채팅에 접속해주세요.", message);
            }
            break
    }
});

function sendMsg(msg, message) {
    message.channel.send(msg);
}

function reply(msg, message) {
    message.reply(msg);
}
