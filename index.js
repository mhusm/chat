/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';
let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let names = require( path.resolve( __dirname, './names.js'));

app.use(express.static('public'));

let port = 8080;
http.listen(port);
console.log(`Server auf Port ${port}`);


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