const moment = require("moment-timezone")

module.exports = {
    ねこ: {
        description: "にゃーん",
        exec(msg) {
            msg.bot.reply("[Bot] にゃーん")
        },
    },
    いぬ: {
        description: "わんわん",
        exec(msg) {
            msg.bot.reply("[Bot] わんわん")
        },
    },
    今何時: {
        description: "現在の時刻を表示します",
        exec(msg) {
            msg.bot.reply(
                "[Bot] 今は" +
                    moment()
                        .tz("Asia/Tokyo")
                        .format("YYYY年MM月DD日 HH時mm分ss秒") +
                    "です"
            )
        },
    },
    ぬるぽ: {
        description: "ガッ",
        exec(msg) {
            msg.bot.reply("[Bot] ガッ")
        },
    },
    めるぽ: {
        description: "騙されないぞ",
        exec(msg) {
            msg.bot.reply("[Bot] 騙されないぞ")
        },
    },
    おみくじ: {
        description: "おみくじを引きます",
        exec(msg) {
            const results = ["大吉", "中吉", "小吉", "吉", "凶", "大凶"]
            msg.bot.reply(
                `[Bot] ${results[Math.floor(Math.random() * results.length)]}`
            )
        },
    },
}
