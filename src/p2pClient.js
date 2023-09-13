const { WebSocket } = require("ws")
const ChangeToView = require("./utils/changeToView.js")
const axios = require("axios")

module.exports = (bot) => {
    const ws = new WebSocket("wss://api.p2pquake.net/v2/ws")
    const c = new ChangeToView()

    ws.on("open", () => {
        console.log("p2pquake is connected")
    })

    ws.on("message", (data) => {
        const o = JSON.parse(data)
        console.log("Response P2P WebSocketServer. Code :" + o.code)

        if (o.code === 551) {
            let msindo = c.shindo(o.earthquake.maxScale)
            let atime = o.earthquake.time
            let domesticTsunami = o.earthquake.domesticTsunami
            let depth = o.earthquake.hypocenter.depth
            let magunitude = o.earthquake.hypocenter.magnitude
            let hyposentername = o.earthquake.hypocenter.name
            let pointskazu = o.points.length
            let eq = ""
            let info = ""
            let tsunamiwarning = ""

            if (depth === -1) return (depth = "[不明]")
            if (magunitude === -1) return (magunitude = "[不明]")
            if (hyposentername === undefined) return (hyposentername = "[不明]")

            if (domesticTsunami === "Warning")
                tsunamiwarning = "現在、津波警報が発表されています。"
            else tsunamiwarning = "この地震による津波の心配はありません。"

            let maxscaleplace = ""
            for (i of o.points) {
                if (i.scale === o.earthquake.maxScale) {
                    maxscaleplace += "**" + i.addr + "**\n"
                }
            }

            let title = `EarthQuakeInfo - 最大震度${msindo}`
            let placedescription = `最大震度${msindo}を\n${maxscaleplace}で観測しています。`
            if (o.earthquake.maxScale === -1 && maxscaleplace === "") {
                title = `EarthQuakeInfo - 震源情報`
                placedescription = ""
            }

            //bot.replySpeech(`〈震源と大きさ〉\n${hyposentername} M${magunitude} 最大震度${msindo}\n・震源の深さ : ${depth}km\n・発生時刻 : ${atime}\n\n${placedescription}\n**${tsunamiwarning}**`)
        }

        if (o.code === 554) {
            bot.replySpeech(
                `緊急地震速報です。強い揺れに警戒して下さい。\n緊急地震速報が発令された地域では、震度5弱以上の揺れが来るかもしれません。\n落ち着いて、身の安全を図ってください。`
            )
        }
    })
}

function zenkaku2Hankaku(str) {
    return str.replace(/[A-Za-z0-9]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    })
}
