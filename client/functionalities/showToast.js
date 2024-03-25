let body = document.querySelector("body")

export let showToast = (msg, type, extraStyle) => {
    // messageBox.style.display = "block"
    let messageBox = document.createElement("div")
    messageBox.innerHTML = msg
    messageBox.className = `message ${type}`;
    body.appendChild(messageBox)
    setTimeout(() => {
        messageBox.className = `message`
        if (extraStyle) extraStyle()
        body.removeChild(messageBox)
    }, 4800)
}