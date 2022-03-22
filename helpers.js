function successfullMessage(msg) {
    return "✅ *MJ-SIR*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "🛑 *MJ-SIR*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "⏺️ *MJ-SIR*:  ```" + msg + "```"
}


module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}