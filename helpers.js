function successfullMessage(msg) {
    return "β *MJ-SIR*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "π *MJ-SIR*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "βΊοΈ *MJ-SIR*:  ```" + msg + "```"
}


module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}