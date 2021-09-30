const cheerio = require('cheerio');
const request = require('request');

function getCovidData(){
    const covidUrl = "http://ncov.mohw.go.kr/bdBoardList_Real.do";

    return new Promise((resolve, rejects) => {
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
            let date = (year +"-"+mS).substr(0,9);
    
            let result = "현재날짜 :  " + date + "\n\n누적 : " + total + "  확진자 증가 : " + covid + "  국내발생 : " + covid_d + "  해외유입 : " + covid_o + "  \n\n격리자 : " + inPrison + "  격리자 증가 : " + inPrison_compare + "  \n\n격리해제 : " + freeCnt + "  격리해제 증가 : " + freeCnt_compare + "  \n\n사망자 : " + death + "  사망자 증가 : " + death_compare;
            resolve({result});
        });
    });
}

module.exports.getCovidData = getCovidData;