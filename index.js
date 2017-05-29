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
        socket.broadcast.emit("chat", message);
    });

    socket.on("disconnect", reason => {
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