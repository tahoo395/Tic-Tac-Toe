let room = document.querySelector(".room")
let game = document.querySelector(".game")
let loading = document.querySelector(".loading")

export let stateScreen = (state) => {
    if (state == "room") {
        room.style.display = "grid"
        game.style.display = "none"
        loading.style.display = "none"
    }
    else if (state == "game") {
        room.style.display = "none"
        game.style.display = "grid"
        loading.style.display = "none"
    }
    else if (state == "loading") {
        room.style.display = "none"
        game.style.display = "none"
        loading.style.display = "grid"
    }
}