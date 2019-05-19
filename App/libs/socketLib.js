const socketio = require('socket.io');

let setServer = (server) => {

    let io = socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection', (socket) => {

        console.log("Socket Connection Done");

        socket.on('order', (data) => {
            socket.broadcast.emit('update', data);  
        });
    });
}

module.exports = {
    setServer: setServer
}