const moment = require("moment-timezone")
const cron = require("node-cron")

module.exports = (bot) => {
    cron.schedule("0 0 * * * *", () => {
        bot.reply(
            `[時報] ${moment()
                .tz("Asia/Tokyo")
                .format("YYYY年MM月DD日 HH時mm分ss秒")}です`
        )
    })
}
