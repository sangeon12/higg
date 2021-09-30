const cheerio = require('cheerio');
const request = require('request');

function getTotalData(nickName){
    const opggUrl = "https://www.op.gg/summoner/userName="+encodeURI(nickName);  


    return new Promise((resolve, rejects) => {
        request(opggUrl , (err, res, body)=>{
            const $ = cheerio.load(body);
            
            let ranking = $(".ranking").eq(0).html();
            let tierRank = $(".TierRank").eq(0).html();
            let wins = $(".wins").eq(0).html();
            let losses = $(".losses").eq(0).html();
            let winratio = $(".winratio").eq(0).html(); 

            let result;
            if(ranking === null){
                result = nickName + "님은 랭킹이 없습니다.";
            }else{
                let info = "["+nickName + "]  [" + ranking+"]위  [" + tierRank + "]\n["  + wins + "]/[" + losses + "]   [" + winratio + "]";
                result = info;
            }

            resolve({result});
        });
    });
}

module.exports.getTotalData = getTotalData;