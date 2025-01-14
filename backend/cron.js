import cron from 'cron'
import https from 'https'

const URL = "http://..."

const job = new cron.CronJob("*/14 * * * *", function(){
    https.get(URL, (res)=> {
        if (res.statusCode == 200) {
            console.log("Get request sent successfully");
        }else{
            console.log("Get request failed", res.statusCode);
            
        }
    }).on("error", (e)=>{
        console.log("Error while sending request", e)
    })
})

export default job