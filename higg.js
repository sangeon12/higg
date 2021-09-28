const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token } = require('./config.json');
const cheerio = require('cheerio');
const request = require('request');

const covidUrl = "http://ncov.mohw.go.kr/bdBoardList_Real.do";

client.on('ready', () => {
  console.log('higg 봇이 대기중입니다!!');
});

client.login(token);

client.on('message', message => {
    if(message.content.indexOf("higg") === -1) return;

    let idx = message.content.indexOf(" ");
    if (idx < 0) {
        sendMsg('higg 입니다. 명령어 목록을 보려면 "higg help"를 입력해주세요.', message);
        return;
    }

    let command = message.content.substring(idx + 1);
    switch(command){
        case "help":
            sendMsg("c : 코로나 확진자, 격리자, 격리해제, 사망자 수를 보여줍니다.", message);
            break;
        case "c":
            request(covidUrl, (err, res, body)=>{
                const $ = cheerio.load(body);
                
                let total = $(".ca_value").eq(0).html();
                let covid = $(".inner_value").eq(0).html();
                let covid_d = $(".inner_value").eq(1).html();
                let covid_o = $(".inner_value").eq(2).html();
                
                let inPrison = $(".ca_value").eq(4).html();
                let inPrison_compare = $(".txt_ntc").eq(1).html();

                let freeCnt = $(".ca_value").eq(2).html();
                let freeCnt_compare = $(".txt_ntc").eq(0).html();

                let death = $(".ca_value").eq(6).html();
                let death_compare = $(".txt_ntc").eq(2).html();

                let mS = $(".t_date").eq(0).html().substring(1, 6).split(".").filter(x => x != ".").join("-");
                let year = new Date().getFullYear();
                let date = year +"-"+mS

                let result = "현재날짜 :  " + date.substr(0,9) + "\n\n누적 : " + total + "  확진자 증가 : " + covid + "  국내발생 : " + covid_d + "  해외유입 : " + covid_o + "  \n\n격리자 : " + inPrison + "  격리자 증가 : " + inPrison_compare + "  \n\n격리해제 : " + freeCnt + "  격리해제 증가 : " + freeCnt_compare + "  \n\n사망자 : " + death + "  사망자 증가 : " + death_compare;
                sendMsg(result, message);
            });
            break;
    }
});

function sendMsg(msg, message){
    message.channel.send(msg);  
}