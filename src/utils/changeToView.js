class ChangeToView {
    tsunami(warning) {
        switch (warning) {
            case "Warning":
                return (warning = "警報が発表されている地域があります")
                break
            case "Unknown":
                return (warning = "不明")
                break
            case "None":
                return (warning = "なし")
                break
            case "Checking":
                return (warning = "調査中")
                break
            case "NonEffective":
                return (warning = "若干の海面変動")
                break
            default:
                return (warning = "情報のフォーマットに失敗。")
                break
        }
    }
    shindo(sindo) {
        switch (sindo) {
            case 10:
                return (sindo = "1")
                break
            case 20:
                return (sindo = "2")
                break
            case 30:
                return (sindo = "3")
                break
            case 40:
                return (sindo = "4")
                break
            case 45:
                return (sindo = "5弱")
                break
            case 50:
                return (sindo = "5強")
                break
            case 55:
                return (sindo = "6弱")
                break
            case 60:
                return (sindo = "6強")
                break
            case 70:
                return (sindo = "7")
                break
            case -1:
                return (sindo = "[不明]")
                break
        }
    }
    icon(sindo) {
        switch (sindo) {
            case "5弱":
                return (sindo = "5m")
                break

            case "5強":
                return (sindo = "5p")
                break

            case "6弱":
                return (sindo = "6m")
                break

            case "6強":
                return (sindo = "6p")
                break

            default:
                return (sindo = sindo)
                break
        }
    }
    depth(depth) {
        switch (depth) {
            case "0":
                return (depth = "ごく浅い")

            default:
                return (depth = depth)
        }
    }
}

module.exports = ChangeToView
