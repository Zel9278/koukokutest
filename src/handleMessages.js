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
            const results = ["わんわん", "よん！"]
            msg.bot.reply(
                `[Bot] ${results[Math.floor(Math.random() * results.length)]}`
            )
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
    後何時: {
        description: "一日の終わりまでの時間を表示します",
        exec(msg) {
            if (!msg) return
            const now = moment().tz("Asia/Tokyo")
            const end = moment()
                .tz("Asia/Tokyo")
                .set({ date: now.date() + 1, hour: 0, minute: 0, second: 0 })

            const diff = moment.duration(end.diff(now))
            const percent = Math.floor(
                (1 - diff.asMilliseconds() / 86400000) * 100
            )

            msg.bot.reply(
                `[Bot] 日付が変わるまであと${Math.floor(
                    diff.asHours()
                )}時間${diff.minutes()}分${diff.seconds()}秒(${percent}%)です`
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
