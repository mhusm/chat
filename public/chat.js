/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';

let nickname = "No name set";
let channel =  document.querySelector("li.selected").textContent;
let channelContent = [];

let enableNotifications = function enableNotifications () {
// Let's check if the browser supports notifications
    let permissionSpan = document.querySelector("#permissions");
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        permissionSpan.innerHTML = "This browser does not support desktop notification";
    }

// Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        console.log("Notifications are enabled");
        permissionSpan.innerHTML = "Notifications sind aktiviert";
    }

// Otherwise, we need to ask the user for permission
    else if (Notification.permission === "default") {
        permissionSpan.innerHTML = "Hier klicken um Notifications zu aktivieren";
        permissionSpan.addEventListener("click", askForPermission);
        permissionSpan.classList.add("active");
    } else {
        permissionSpan.innerHTML = "Notifications sind deaktiviert";
        console.warn("The user has denied permission for notification");
    }
};

let askForPermission = function askForPermission () {
    let permissionSpan = document.querySelector("#permissions");
    Notification.requestPermission(permission => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            console.log("notifications are enabled");
            permissionSpan.innerHTML = "Notifications sind aktiviert";
            permissionSpan.classList.remove("active");
            permissionSpan.removeEventListener("click", askForPermission);
        } else if (Notification.permission === "denied"){
            permissionSpan.removeEventListener("click", askForPermission);
            permissionSpan.innerHTML = "Notifications sind deaktiviert";
            permissionSpan.classList.remove("active");
            console.log(permission);
        }
    });


};


let sendMessage = function sendMessage(message, to) {
    socket.emit("chat", {from: nickname, message: message, to: to});
};

let displayMessage = function displayMessage(message, user, channel) {
    let newNode = document.createElement('div');
    let to = channel? ` to ${channel}`: "";
    newNode.innerHTML = `${user}${to}: ${message}`;
    document.querySelector("#chat-window").appendChild(newNode);
};

let displayUsers = function displayUsers(users) {
    let userliitems = users.map(user => `<li>${user}</li>`);
    document.querySelector("#users").innerHTML = userliitems.join("");
    let userelements = Array.from(document.querySelector("#users").children);
    markChannel(channel);
    for (let i in userelements) {
        userelements[i].addEventListener("click", event => {
            changeChannel(event.target.textContent);
        });
    }

};

let markChannel = function selectChannel(channel) {
    // remove selection from old channel
    let current =  document.querySelector("li.selected");
    if (current) {
        document.querySelector("li.selected").classList.remove("selected");
    }

    // find channel element, if it exists
    let items = Array.from(document.querySelectorAll("li"));
    let selected = items.filter(item => item.textContent === channel);
    if (selected.length > 0) {
        selected[0].classList.add("selected");
    } else {
        changeChannel(items[0].textContent);
    }
};


let spawnNotification = function spawnNotification(theBody,theIcon,theTitle) {

    let options = {
        body: theBody,
        icon: theIcon
    };
    let n = new Notification(theTitle, options);

    n.onclick = function () {
        window.focus();
        this.close();
    };

    n.onerror = function (error) {
        console.log(error)
    }
};


let changeChannel = function changeChannel(newChannel) {
    if (newChannel !== channel) {
        channel = newChannel;
        markChannel(channel);
    }

};

let setNickname = function setNickname(name) {
    nickname = name;
    document.querySelector("#nickname").textContent = name;
};

let handleMessageInput = function handleMessageInput(text) {
    sendMessage(text, channel);
    displayMessage(text, nickname, channel);
};

let setupSocketIO =  function setupSocketIO () {
    window.socket = io();

    socket.on("connect", () => {
        console.log(socket.id);
    });

    socket.on("chat", data => {
        console.log(data);
        if (document.hidden) {
            console.log("hidden");

            spawnNotification(data.message,
                'http://www.free-icons-download.net/images/chat-icon-68862.png',
                `new message from ${data.from}`);
            //         spawnNotification(data.message, `http://identicon.org?t=${data.from}&s=256`, `new message from ${data.from}`);
        } else {
            console.log("not hidden");
            console.log(data.message);
        }
        displayMessage(data.message, data.from, data.to);
    });

    socket.on("nickname", name => {
        setNickname(name);
    });

    socket.on("users", users => {
        let  other_users = users.filter(user => user !== nickname);
        displayUsers(other_users);
    });

};

(function(){
    enableNotifications();

    document.querySelector("#chat-input").addEventListener("keypress", event => {
        if (event.key === "Enter") {
            handleMessageInput(event.target.value);
            document.querySelector("#chat-input").value = ""; // reset the text in the input
        }
    });

    let channels = Array.from(document.querySelector("#channels").children);
    for (let i in channels) {
        channels[i].addEventListener("click", event => {
            changeChannel(event.target.textContent);
        });
    }

    setupSocketIO();
}());