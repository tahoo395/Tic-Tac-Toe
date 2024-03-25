let winnerMsg = document.querySelector(".winner")
let container = document.querySelector(".container")


export let eraseGameData = () => {
    document.querySelectorAll(".container .box").forEach(c => c.innerHTML = "")
    winnerMsg.style.display = "none"
    container.style.opacity = "100%"
}