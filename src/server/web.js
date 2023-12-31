const express = require("express")
const path = require("path")

const wsServer = require("./websocket.js")

class webServer {
    constructor(bot) {
        this.bot = bot
        this.app = express()
        this.server = this.app.listen(9886, () => {
            console.log("listening on *:9886")
        })
        this.wsServer = new wsServer(this.server, this.bot)

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static("public"))

        this.app.set("view engine", "ejs")
        this.app.set("views", path.join(__dirname, "../views"))

        this.app.get("/", (req, res) => {
            const commands = Object.keys(this.bot.commands).map((c) => ({
                name: c,
                description: this.bot.commands[c].description,
            }))

            const handleMessages = Object.keys(this.bot.handleMessages).map(
                (c) => ({
                    name: c,
                    description: this.bot.handleMessages[c].description,
                })
            )

            res.render("index", { commands, handleMessages })
        })

        /*this.app.get('/messages', (req, res) => {
            res.render('messages', { messages: this.bot.messages });
        })*/

        this.app.get("/commands", (req, res) => {
            const commands = Object.keys(this.bot.commands).map((c) => ({
                name: c,
                description: this.bot.commands[c].description,
            }))
            res.render("commands", { commands })
        })

        /*this.app.get('/api/messages', (req, res) => {
            res.json(this.bot.messages);
        });*/
    }
}

module.exports = webServer
