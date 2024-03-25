import { io } from "socket.io-client";


import { checkWinner } from './functionalities/checkWinner'
import { addWeapon } from "./functionalities/addWeapon";
import { showToast } from "./functionalities/showToast";
import { stateScreen } from "./functionalities/stateScreen";
import { isMyTurn } from "./functionalities/isMyTurn";
import { eraseGameData } from "./functionalities/eraseGameData";
import { ifInputNotValidated } from "./functionalities/ifInputNotValidated";


const socket = io("http://localhost:5000");



let name = document.querySelector(".room .name");
let roomInput = document.querySelector(".room .roomInput");
let roomButton = document.querySelector(".room .roomButton");

let player1 = document.querySelector(".players .player1")
let player2 = document.querySelector(".players .player2")

let roomId;



let winnerMsg = document.querySelector(".winner")
let weapon;
let container = document.querySelector(".container")
let moves = Array(9).fill(null)
let turn;
let restartButton = document.querySelector(".winner .restart ")
let backButton = document.querySelector(".winner .back")


roomButton.addEventListener("click", () => {
    console.log(name , roomInput)
    if (!ifInputNotValidated(name.value , roomInput.value)) {
        socket.emit("roomId", {
            roomId: roomInput.value,
            name: name.value,
            userId: socket.id,
        });
        socket.on("receiveInfo", (info) => {
            moves = Array(9).fill(null)
            if (!info) {
                showToast("Sorry , Two players have already joined &#128533;", "error")
            }
            else if (info.length == 1) {
                stateScreen("loading")
                setTimeout(() => {
                    showToast("No players have found &#128533;", "error")
                    stateScreen("room")
                }, 1 * 60 * 1000)
            }
            else if (info.length == 2) {
                stateScreen("game")
                let myIndex = info.findIndex(v => v.userId == socket.id)
                let opponentsIndex = myIndex == 0 ? 1 : 0

                weapon = info[myIndex].weapon
                roomId = info[0].roomId
                player1.children[0].innerHTML = `${info[myIndex].name} ( ${info[myIndex].weapon == "circle" ? "O" : "X"} )`
                player2.children[0].innerHTML = `${info[opponentsIndex].name} ( ${info[opponentsIndex].weapon == "circle" ? "O" : "X"} )`

                turn = weapon == "circle" ? true : false
                isMyTurn(turn)
            }
        });
    }
    else if(ifInputNotValidated(name.value , roomInput.value)) {
        showToast(ifInputNotValidated(name.value , roomInput.value) , "error")
    }
});

container.addEventListener('click', (k) => {

    if (!k.target.children[0] && k.target.tagName != "IMG" && turn) {

        addWeapon(weapon, k.target)

        if (weapon == "circle") {
            moves[Number(k.target.id - 1)] = "circle"
        }
        else if (weapon == "cross") {
            moves[Number(k.target.id - 1)] = "cross"
        }

        socket.emit('moves', {
            moves,
            change: {
                move: weapon,
                index: k.target.id - 1
            },
            roomId
        })

        turn = false
        isMyTurn(turn)

        checkWinner(moves, winnerMsg, () => {
            container.style.opacity = "50%"
            winnerMsg.style.display = "flex"
        })

    }
})

socket.on("receiveMoves", (m) => {
    moves = m.moves

    addWeapon(m.change.move, container.children[m.change.index])

    turn = true
    isMyTurn(turn)
    checkWinner(moves, winnerMsg, () => {
        container.style.opacity = "50%"
        winnerMsg.style.display = "flex"
    })
})




// The following code checks if the player wants to rematch with opponent

let IWantToRematch = false
let opponentWantsToRematch = false


restartButton.onclick = () => {
    console.log("rematch button clicked")
    socket.emit("rematch", roomId);
    IWantToRematch = true

    rematch()

}

socket.on("rematch", () => {
    opponentWantsToRematch = true
    rematch()
})



let rematch = () => {
    if (IWantToRematch && opponentWantsToRematch) {
        eraseGameData()
        moves = Array(9).fill(null)

        console.log(moves)

        let messageBox = document.querySelector(".message");
        messageBox.style.transform = "translateX(calc(100% + 30px)"

        IWantToRematch = false
        opponentWantsToRematch = false
    }
    else if (IWantToRematch && !opponentWantsToRematch) {
        restartButton.style.opacity = "60%"
        restartButton.style.cursor = "not-allowed"
        showToast("Rematch Request Send", "success", () => {
            restartButton.style.opacity = "100%"
            restartButton.style.cursor = "pointer"
        })
    }
    else if (!IWantToRematch && opponentWantsToRematch) {
        showToast("Opponent Wants to Rematch, click Play again to do so", "success")
    }
}

// The code above checks if the player wants to rematch with opponent

window.addEventListener('beforeunload', () => {
    let room = document.querySelector(".room")
    let game = document.querySelector(".game")
    let loading = document.querySelector(".loading")

    if (roomId && weapon && game.style.display != "none" && loading.style.display == "none" && room.style.display == "none") {
        socket.emit("gameClosed", roomId)
    }
})

socket.on("gameClosed", () => {
    winnerMsg.children[0].innerHTML = "Opponent Left"
    winnerMsg.children[1].children[0].style.display = "none"
    winnerMsg.style.display = "flex"
    showToast("Your opponent has left the game", "error")
    socket.emit("gameClosed" , roomId)
    winnerMsg.children[1].children[1].onclick = () => {
        eraseGameData()
        moves = Array(9).fill(null)
        stateScreen("room")
        winnerMsg.children[1].children[0].style.display = ""
    }
})



backButton.onclick = () => {
    console.log("back button clicked")
    eraseGameData()
    moves = Array(9).fill(null)
    stateScreen("room")

    socket.emit("gameClosed", roomId)
}







