const axios = require("axios")
const child_process = require("child_process")
const iconv = require("iconv-lite")
const fs = require("fs")
const path = require("path")

//const p2pClient = require('./src/p2pClient.js');
const webServer = require("./server/web.js")
const jihou = require("./jihou.js")

class bot {
    constructor() {
        this.commands = require("./commands.js")
        this.handleMessages = require("./handleMessages.js")
        this.messages = require("./data/messages.json")
        this.webServer = new webServer(this)
        this.connected = false
        this.prefix = ">"
    }

    connect() {
        this.child = child_process.spawn("telnet", [
            "koukoku.shadan.open.ad.jp",
        ])
        this.child.stdin.write("nobody\n")

        this.connected = true

        this.child.stdout.on("data", (data) => {
            if (!data) return

            const shift_jis = iconv.decode(data, "Shift_JIS")

            if (shift_jis.includes(">> 「 ")) {
                console.log(`stdout: ${shift_jis.replace(/\n/g, "")}`)

                const messageData = messageParser(shift_jis)

                if (!messageData) return
                this.messages.push(messageData)
                this.webServer.wsServer.broadcast(messageData)
                fs.writeFileSync(
                    path.join(__dirname, "./data/messages.json"),
                    JSON.stringify(this.messages, null, 4)
                )

                if (messageData.isMe) return

                if (
                    Object.keys(this.handleMessages).find((c) =>
                        messageData.text.includes(c)
                    )
                ) {
                    const command = Object.keys(this.handleMessages).find((c) =>
                        messageData.text.includes(c)
                    )

                    this.handleMessages[command].exec({
                        bot: this,
                        ...messageData,
                    })
                    return
                }

                if (!messageData.text.startsWith(this.prefix)) return

                const args = messageData.text
                    .slice(this.prefix.length)
                    .trim()
                    .split(/ +/)
                const commandName = args.shift().toLowerCase()
                const command = this.commands[commandName]

                if (command) {
                    command.exec({ bot: this, ...messageData, args })
                    return
                }
            } else {
                console.log(`stdout: ${shift_jis.replace(/\n/g, "")}`)
            }
        })

        this.child.stderr.on("data", (data) => {
            console.log(data.toString())
        })

        this.child.on("error", (err) => {
            console.error(err)
        })

        this.child.on("close", (code) => {
            console.log(
                `child process exited with code ${code}, reconnecting...`
            )
            this.connected = false
            this.connect()
        })

        jihou(this)
    }

    reply(text) {
        if (!this.connected) return
        this.child.stdin.write(hankaku2Zenkaku(`${text}\n`))
    }

    replyRaw(text) {
        if (!this.connected) return
        this.child.stdin.write(`${text}\n`)
    }

    async replySpeech(text) {
        if (!this.connected) return

        try {
            const id = Math.floor(Math.random() * 2556555)

            const res = await axios({
                method: "post",
                url: `https://f.c30.life/api/upload`,
                data: Buffer.from(`[Bot - Speech/${id}] ${text}`),
                headers: {
                    "Content-Type": "plain/text;charset=shift-jis",
                    filename: "speech.txt",
                    authentication: process.env.FILES_AUTH,
                },
            })

            this.replyRaw(`${res.data}`)
        } catch (error) {
            console.error(error)
            this.reply(`[Bot] Error occured`)
        }
    }
}

module.exports = bot

function messageParser(message) {
    message = message.replace(/\n/g, "")
    const regex =
        />> 「 (.+) 」\(チャット放話 - (.+) \((.+)\) (.+) by (.+) 君( 〈＊(.+)＊〉)?|( \(※ (.+)\)?)\) <</
    const match = message.match(regex)
    if (!match) return null

    const [_, text, date, day, time, address, __, me] = match
    return {
        text,
        date,
        day,
        time,
        isCounterfeit: address.includes("※ 贋作 DNS 逆引の疑い"),
        address: address.replace(" (※ 贋作 DNS 逆引の疑い)", ""),
        isMe: me === "あなた様",
    }
}

function hankaku2Zenkaku(str) {
    return str.replace(/[A-Za-z0-9]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    })
}
