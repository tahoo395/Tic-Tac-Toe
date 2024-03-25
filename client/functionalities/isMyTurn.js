let player1 = document.querySelector(".players .player1")
let player2 = document.querySelector(".players .player2")


export let isMyTurn = (turn) => {
    player1.dataset.turn = turn
    player2.dataset.turn = !turn
}