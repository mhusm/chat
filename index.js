/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';
let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let names = require( path.resolve( __dirname, './names.js'));
// TODO Socket.io importieren

app.use(express.static('public'));

let port = 8080;
http.listen(port);
console.log(`Server auf Port ${port}`);

// TODO Socket.io warten auf Verbindungen und Events

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