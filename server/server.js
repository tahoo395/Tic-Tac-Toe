let players = []

const io = require('socket.io')(process.env.PORT, {
    cors: {
        origin: '*',
    }
})


io.on('connection', (socket) => {
    
    socket.on("roomId", (p) => {
        let sameRoomPeople = players.filter(v => v.roomId == p.roomId)
        
        if (sameRoomPeople.length == 0) {
            players.push(p)
            sameRoomPeople.push(p)
            sameRoomPeople[0].weapon = "circle"
            socket.join(p.roomId)
            io.in(p.roomId).emit('receiveInfo', sameRoomPeople)
        } else if (sameRoomPeople.length == 1) {
            players.push(p)
            sameRoomPeople.push(p)
            sameRoomPeople[1].weapon = "cross"
            socket.join(p.roomId)
            io.in(p.roomId).emit('receiveInfo', sameRoomPeople)
        }
        else if (sameRoomPeople.length >= 2) {
            // console.log("hi")
            io.to(p.userId).emit('receiveInfo', null)
        }
    })

    socket.on("rematch", (p) => {
        socket.to(p).emit('rematch')
    })

    socket.on('moves', (m) => {
        socket.to(m.roomId).emit("receiveMoves", m)
    })

    socket.on("ready", (roomId) => {
        // let sameRoomPeople = players.filter(v => v.roomId == roomId)
        io.to(roomId).emit("ready" , "sameRoomPeople")
    })

    socket.on("gameClosed", (roomId) => {
        players = players.filter(p => p.roomId != roomId)
        socket.to(roomId).emit("gameClosed")
        socket.leave(roomId)
    })
})