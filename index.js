/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
let names = require( path.resolve( __dirname, './names.js'));

app.use(express.static('public'));

let port = 8080;
http.listen(port);
console.log(`Server auf Port ${port}`);

io.on("connection", socket => {
    console.log(socket.id);
    socket.nickname = names.getName();

    socket.emit("nickname", socket.nickname);
    io.emit("users", getAllUsers());

    socket.on("chat", message => {
        console.log(message);
        if (message.to === "General") {
            socket.broadcast.emit("chat", message);
        } else {
            let recipientSocket = getSocket(message.to);
            if (recipientSocket) {
                recipientSocket.emit("chat", message);
            } else {
                console.log(`Recipient not found ${message.to}`);
            }
        }
    });

    socket.on("disconnect", reason => {
        console.log(reason);
        io.emit("users", getAllUsers())
    });
});

let getAllUsers = function getAllUsers() {
    let socketIds = Object.keys(io.sockets.connected);
    let users = [];
    socketIds.forEach(socketId => { users.push(io.sockets.connected[socketId].nickname)});
    return users;
   // let nicknames = Object.values(io.sockets.sockets).map(socket => socket.nickname);
};

let getSocket = function getSocket(nickname) {
    let socketIds = Object.keys(io.sockets.connected);
    let users = [];
    socketIds.forEach(socketId => {
        if (io.sockets.connected[socketId].nickname === nickname) {
            users.push(io.sockets.connected[socketId])
        }
    });
    return  users[0];

};