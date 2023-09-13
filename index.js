require("dotenv").config()

const Bot = require("./src/bot.js")

const bot = new Bot()
bot.connect()

process.on("uncaughtException", (err) => {
    console.error(err)
})

process.on("unhandledRejection", (err) => {
    console.error(err)
})
