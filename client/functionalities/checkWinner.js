export let checkWinner = (moves , winnerMsg , styleChanges) => {
    let winner;
    let winningMoves = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8]
    ]

    winningMoves.forEach((v) => {
        let [a, b, c] = v
        if (!!moves[a] && moves[a] === moves[b] && moves[b] === moves[c]) {
            winner = moves[a]
        }
    })

    if (winner === "cross") {
        styleChanges()
        winnerMsg.children[0].innerHTML = "Cross Has Won"

    } else if (winner === "circle") {
        styleChanges()
        winnerMsg.children[0].innerHTML = "Circle Has Won"
    }
    else if (moves.indexOf(null) == -1) {
        styleChanges()
        winnerMsg.children[0].innerHTML = "A Draw"
    }
}