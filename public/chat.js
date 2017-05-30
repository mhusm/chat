/**
 * Created by husmannm on 24.05.2017.
 */
'use strict';

let nickname = "Nickname";
let channel =  document.querySelector("li.selected").textContent;
let channelContent = [];

let enableNotifications = function enableNotifications () {
    let permissionSpan = document.querySelector("#permissions");
    permissionSpan.innerHTML = "TODO hier soll der Notification-Permission-Status angezeigt werden"

    //TODO Pruefen, ob der Browser Notifications unterstützt
    //TODO Falls ja, aktuellen Zustand der Permission für Notifications abfragen
    //TODO Label für Notification mit aktuellem Zustand aktualisieren
    //TODO Falls der User noch nicht gefragt wurde, soll eine Klick auf das Label die Abfrage auslösen.
    //TODO Das Label soll farbig markiert werden: permissionSpan.classList.add("active");
    //TODO Anschliessend das Label wieder korrekt aktualisieren

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
// TODO eine Notificiation mit den Argumenten absetzen
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

let displayMessage = function displayMessage(message, user, channel) {
    let newNode = document.createElement('div');
    let to = channel? ` to ${channel}`: "";
    newNode.innerHTML = `${user}${to}: ${message}`;
    document.querySelector("#chat-window").appendChild(newNode);
};

let handleMessageInput = function handleMessageInput(text) {
    // TODO die Nachricht an die anderen Chat-Teilnehmer schicken
    // TODO die Nachricht anzeigen
};

let setupSocketIO =  function setupSocketIO () {
    // TODO Verbindung zum Server aufnehmen
    // TODO socket.io Events empfangen

};

(function(){
    enableNotifications();

    document.querySelector("#chat-input").addEventListener("keypress", event => {
        if (event.key === "Enter") {
            handleMessageInput(document.querySelector("#chat-input").value);
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