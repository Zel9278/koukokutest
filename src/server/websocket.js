const { Server } = require("ws")
const { inspect } = require("util")
const child_process = require("child_process")

class websocketServer {
    constructor(server, bot) {
        this.connections = []
        this.adminConnections = []
        this.wss = new Server({ server })

        this.wss.on("connection", (ws, req) => {
            console.log("connected")
            if (req.url === "/admin") {
                const auth =
                    req.headers.authorization ||
                    req.headers["sec-websocket-protocol"]
                if (!auth || auth !== process.env.WS_AUTH) {
                    ws.send("Unauthorized")
                    ws.close()
                    return
                }
                this.adminConnections.push(ws)

                ws.on("message", async (data) => {
                    if (data.toString("utf-8").startsWith(">")) {
                        const command = data.slice(1).toString("utf-8")
                        bot.replySpeech(`[Bot Admin] Notification\n${command}`)
                        return
                    }

                    if (data.toString("utf-8").startsWith("$")) {
                        const command = data.slice(1).toString("utf-8")
                        child_process.exec(command, (err, stdout, stderr) => {
                            if (stderr || err) {
                                bot.replySpeech(
                                    `[Bot Admin] Exec Error\ninput: ${command}\nresult: ${
                                        stderr || err.message
                                    }`
                                )
                            }

                            if (stdout) {
                                bot.replySpeech(
                                    `[Bot Admin] Exec Stdout\ninput: ${command}\n${stdout}`
                                )
                            }
                        })

                        return
                    }

                    if (data.toString("utf-8").startsWith("!")) {
                        const command = data.slice(1).toString("utf-8")
                        let timer = process.hrtime()

                        try {
                            let evalData = await eval(command.toString("utf-8"))
                            let evaled = inspect(evalData, { depth: 1 })
                            timer = process.hrtime(timer)
                            const timerData = `*Executed in ${
                                timer[0] > 0 ? `${timer[0]}s ` : ""
                            }${timer[1] / 1000000}ms.*`

                            bot.replySpeech(
                                `[Bot Admin] Eval\n${timerData}\ninput: ${command}\nresult:\n${evaled}`
                            )
                        } catch (error) {
                            bot.replySpeech(
                                `[Bot Admin] Eval\ninput: ${command}\nresult: ${error.message}`
                            )
                        }
                        return
                    }

                    if (data.toString("utf-8").startsWith("??")) {
                        this.adminBroadcast({
                            type: "message",
                            text: `Help\n> 演説\n$ exec\n! eval\n?? help`,
                        })
                    }

                    bot.reply(`[Bot Admin] ${data}`)
                })
            } else {
                this.connections.push(ws)
                this.adminBroadcast({
                    type: "connectedCount",
                    count: this.connections.length,
                })
            }

            ws.on("close", () => {
                console.log("disconnected")
                if (req.url === "/admin") {
                    this.adminConnections = this.adminConnections.filter(
                        (conn) => conn !== ws
                    )
                } else {
                    this.connections = this.connections.filter(
                        (conn) => conn !== ws
                    )
                }
            })
        })
    }

    broadcast(data) {
        this.connections.forEach((conn) => {
            conn.send(JSON.stringify(data))
        })
    }

    adminBroadcast(data) {
        this.adminConnections.forEach((conn) => {
            conn.send(JSON.stringify(data))
        })
    }
}

module.exports = websocketServer
