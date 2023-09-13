const child_process = require("child_process")
const package = require("../package.json")
const handleMessages = require("./handleMessages.js")

module.exports = {
    アドレス: {
        description: "あなたのアドレスを表示します",
        exec(msg) {
            msg.bot.reply("[Bot] あなたのアドレスは" + msg.address + "です")
        },
    },
    ダイス: {
        description: "ダイスを振ります | 例: ダイス 1d6",
        exec(msg) {
            if (!msg) return
            try {
                const match = msg?.text?.match(/ダイス (\d+)d(\d+)/)
                if (!match)
                    return msg.bot.replySpeech(
                        "Diceroll\nダイスの数と面数を指定してください、例は「ダイス 1d6」です。"
                    )

                const [_, count, max] = match

                if (isNaN(count))
                    return msg.bot.replySpeech(
                        "Diceroll\nダイスの数は数字で指定してください"
                    )
                if (isNaN(max))
                    return msg.bot.replySpeech(
                        "Diceroll\nダイスの面数は数字で指定してください"
                    )

                if (count > 256)
                    return msg.bot.replySpeech(
                        "Diceroll\n256回以上は振れません"
                    )
                if (max > 256)
                    return msg.bot.replySpeech(
                        "Diceroll\n256面以上は振れません"
                    )

                const results = []
                for (let i = 0; i < count; i++) {
                    results.push(Math.floor(Math.random() * max) + 1)
                }
                msg.bot.replySpeech(
                    `Diceroll\ninput: ${count}d${max}\nresult: ${results.join(
                        ", "
                    )} (${results.reduce((a, b) => a + b)}合計)`
                )
            } catch (error) {
                console.error(error)
                msg.bot.replySpeech(
                    "[Bot] エラーが発生しました: " + error.message
                )
            }
        },
    },
    ping: {
        description: "koukoku.shadan.open.ad.jpにpingを送信します",
        exec(msg) {
            const child = child_process.execSync(
                "ping -c 5 koukoku.shadan.open.ad.jp"
            )
            msg.bot.replySpeech(`[Bot] ${child.toString("utf-8")}`)
        },
    },
    /*"バックログ": {
        description: "バックログを表示します | 例: バックログ 10",
        exec(msg) {
            const [_, count] = msg?.text?.match(/バックログ (\d+)/);
            if (!count) return msg.bot.reply('[Bot] バックログの数を指定してください');

            const log = msg.bot.messages.slice(-parseInt(count, 10));
            const text = log.map((l,i) => `「${l.text}」[${l.time} by ${l.address}]`).join('\n');

            if (text.split('\n').length > 30) return msg.bot.reply(`[Bot] バックログは30行までしか表示できません`);

            msg.bot.replySpeech(text.normalize());
        }
    },*/
    情報: {
        description: "コマンドリストを表示します",
        exec(msg) {
            //msg.bot.replySpeech(`コマンドリスト\n${Object.keys(module.exports).map(c=>`> ${c} - ${module.exports[c].description}`).sort().map(c=>c).join('\n')}\n以上のコマンドが使用できます、ほかには https://koukoku.c30.life/messages でメッセージの履歴が見れます。`);
            const msgs = [
                "ヘルプ",
                "- インフォメーション",
                `| Bot Name: ${package.name}`,
                `| Bot Author: ${package.author.name}( ${package.author.url} )`,
                `| Bot Prefix: ${msg.bot.prefix}`,
                `| Node.js: ${process.version} on ${process.platform}`,
                `| Bot Version: ${package.version}`,
                "| Bot URL: https://koukoku.c30.life",
                "",
                "- コマンドリスト",
                ...Object.keys(module.exports)
                    .map(
                        (c) =>
                            `| ${msg.bot.prefix}${c} - ${module.exports[c].description}`
                    )
                    .sort()
                    .map((c) => c),
                "以上のコマンドが使用できます。",
                "- メッセージに反応するもの",
                ...Object.keys(handleMessages)
                    .map((m) => `| ${m} - ${handleMessages[m].description}`)
                    .sort()
                    .map((c) => c),
                "以上のメッセージに反応するものが使用できます。",
            ]
            msg.bot.replySpeech(msgs.join("\n"))
        },
    },
}
