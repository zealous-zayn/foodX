const socketio = require('socket.io');

let setServer = (server) => {

    let io = socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection', (socket) => {
        socket.on('order', (data) => {
            socket.broadcast.emit('update', data);  
        });
    });
}

module.exports = {
    setServer: setServer
}