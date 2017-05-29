/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';

let socket = io();
let nickname = "No name set";

let enableNotifications = function enableNotifications () {
// Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
    }

// Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        console.log("Notifications are enabled")
    }

// Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                console.log("notifications are enabled")
            } else {
                console.log(permission);
            }
        });
    } else {
        console.warn("The user has denied permission for notification");
    }
};


let sendMessage = function sendMessage(message) {
    socket.emit("chat", {from: nickname, message: message});
};

let displayMessage = function displayMessage(message, user) {
    let newNode = document.createElement('div');
    newNode.innerHTML = `${user}: ${message}`;
    document.querySelector("#chat-window").appendChild(newNode);
};
let spawnNotification = function spawnNotification(theBody,theIcon,theTitle) {

    let options = {
        body: theBody,
        icon: theIcon
    };
    let n = new Notification(theTitle,options);
    n.onclick = function () {
        window.focus();
        this.close();
    };
    n.onerror = function (error) {
        console.log(error)
    }
};


(function(){
    enableNotifications();

    socket.on("connect", () => {
        console.log(socket.id);
    });

    document.querySelector("#nickname").addEventListener("blur", event => {
        nickname = event.target.textContent;
    });

    socket.on("chat", data => {
        console.log(data);
        if (document.hidden) {
            console.log("hidden");

            spawnNotification(data.message, 'http://www.free-icons-download.net/images/chat-icon-68862.png', `new message from ${data.from}`);
   //         spawnNotification(data.message, `http://identicon.org?t=${data.from}&s=256`, `new message from ${data.from}`);
        } else {
            console.log("not hidden");
            console.log(data.message);
        }
        displayMessage(data.message, data.from);
    });

    socket.on("nickname", name => {
        nickname = name;
        document.querySelector("#nickname").textContent = name;

    });

    socket.on("users", users => {
        //TODO display all users
       console.log(users.filter(user => user !== nickname));
    });

    document.querySelector("#chat-input").addEventListener("keypress", event => {
        if (event.key === "Enter") {
            sendMessage(event.target.value);
            displayMessage(event.target.value, nickname);
            document.querySelector("#chat-input").value = ""; // reset the text in the input
        }
    });

}());