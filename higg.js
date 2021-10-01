const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
// const { Client, Intents } = require('discord.js');
// const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const client = new Discord.Client();
const { token } = require('./config.json');
const ytdl = require("ytdl-core");
const yts = require('yt-search');
const db = require('quick.db');

const { getCovidData } = require('./function/covid.js');
const { getTotalData } = require('./function/opgg.js');

client.on('ready', () => {
    console.log('higg 봇이 대기중입니다!!');
    status("개발 테스트용 봇입니다.");
    let mdb = new db.table('music');//음악이 재생되고 있는지 여부
    mdb.set('musicPlay', {idx : false});
}); 

client.login(token);

client.on('message', async message => {
    let msg = message.content;
    if (msg.indexOf("higg") === -1 || message.author.bot) return;

    let idx = msg.indexOf(" ");
    if (idx < 0) {
        embed('환영합니다!!', 0x00faa2, '안녕하세요! higg 입니다! 사용법을 모르시면 [higg h] 를 입력해주세요!', message);
        return;
    }

    let command = msg.substr(idx + 1, 1);
    switch (command) {
        case "h":
            embed('명령어 목록입니다!!', 0x00faa2, "[higg c] : 코로나 현황을 알 수 있습니다!\n[higg o 닉네임] : 전적을 검색 할 수 있습니다!\n[higg y 노래제목] : 노래를 재생할 수 있습니다!\n[higg y l] : higg 봇을 음성채널에서 내보낼 수 있습니다.ㅠㅠ\n[higg p] : 현재 재생되고 있는 플레이리스트를 볼 수 있습니다.\n[higg r] : 현재 재생되고 있는 플레이 리스트를 제거할 수 있습니다!", message);
            break;
        case "c":
            getCovidData().then((v) => {
                embed("코로나 현황 입니다!!", 0xfa0000, v.result, message);
            });
            break;
        case "o":
            let opggValue = msg.substr(idx + 1);
            let nickName = opggValue.substr(2);
            getTotalData(nickName).then((v) => {
                embed("검색된 전적입니다!!",0x00faa2,v.result, message);
            });
            break;
        case "핑":
            embed("퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁웊웊웊웊웊웊웊웊웊웊웊웊웊웊",0xf6fa00,"퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁웊웊웊웊웊웊웊웊웊웊웊웊웊웊", message);
            break
        case "y":
            let musicName = msg.substr(idx + 3);
            let musicChannel = message.member.voice.channel;

            if(musicName === "l"){
                musicChannel.leave();
                return;
            } 
            if(musicChannel){
                if(msg.substring(idx + 2, idx + 3) !== " " || musicName.length <= 0){
                    embed("오류", 0xfa0000, "노래 제목이 안적혔거나, 명령어가 잘못 입력되었습니다.", message);
                    return;
                }
                
                const r = await yts(musicName);
                const videos = r.videos.slice(0, 1);
                let musicInfo = videos[0];

                title = musicInfo.title;
                url = musicInfo.url;
                let pdb = new db.table('musicplayList');//음악 플레이 리스트
                let mdb = new db.table('music');//음악이 재생되고 있는지 여부
                // pdb.delete('고3들상황');
                // pdb.delete('수능망친고3');
                pdb.set(musicName, {title:title, url:url});
                const connection = await musicChannel.join();
                console.log(pdb.all());
                play_music();

                async function play_music(){
                    if(pdb.all().length <= 0) return;
                    if(mdb.get('musicPlay').idx) return;

                    sendMsg(pdb.get(pdb.all()[0].ID).title + "를(을) 재생합니다.\n"+pdb.get(pdb.all()[0].ID).url, message);
                        const musicPaly = connection.play(
                            ytdl(pdb.get(pdb.all()[0].ID).url, { filter: "audioonly" })
                        );
                        mdb.set('musicPlay', {idx : true});

                        musicPaly.on("finish", () => {
                            if(pdb.all().length > 0) pdb.delete(pdb.all()[0].ID);
                            mdb.set('musicPlay', {idx : false});
                            play_music();
                        });
                }

            }else{
                embed("오류",0xfa0000,"먼저 음성채팅에 접속해주세요.", message)
            }
            break
        case "r":
            let pdb = new db.table('musicplayList');
            let mdb = new db.table('music');
            if(pdb.all().length <= 0){
                embed("오류", 0xfa0000, "삭제할 플레이리스트가 없습니다!", message);            
                return;
            }
            
            pdb.all().forEach( (e) => {
                pdb.delete(e.ID);
            });
            mdb.set('musicPlay', {idx : false});

            embed("플레이리스트 삭제!!", 0x00faa2, "플레이리스트가 삭제되었어요!", message);
            break
        case "p":
            let pdb2 = new db.table('musicplayList');
            let mdb2 = new db.table('music');
            let playListValue = [];
            if(pdb2.all().length <= 0){
                embed("오류", 0xfa0000, "현재 플레이리스트에 아무것도 없습니다!", message);            
                return;
            }

            pdb2.all().forEach( (e) => {
                playListValue.push(pdb2.get(e.ID).title);
            });
            mdb2.set('musicPlay', {idx : false});
            
            embed("플레이리스트 입니다!!", 0x00faa2, playListValue, message);
            break
    }
});

function sendMsg(msg, message) {
    message.channel.send(msg);
}

function reply(msg, message) {
    message.reply(msg);
}

function embed(title, color, content, message){
    const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setDescription(content);
    sendMsg(embed, message);
}

function status(musicName){
    //client.user.setActivity(musicName, { type: 'LISTENING' });
    client.user.setActivity(musicName);
}
