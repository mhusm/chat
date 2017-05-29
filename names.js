"use strict";
let fs = require('fs');
let path = require('path');

function Names () {
    this.animals = [];
    this.adjectives = [];

    fs.readFile(path.join(__dirname, 'animals.csv'), (err,data) =>  {
        if(err) {
            console.log(err);
        }
        else {
            this.animals = data.toString().replace(/ /g, "_").split("\r\n");
            console.log(this.animals);
        }
    });
    fs.readFile(path.join(__dirname, 'adjectives.csv'), (err,data) =>  {
        if(err) {
            console.log(err);
        }
        else {
            this.adjectives = data.toString().split("\r\n");
        }
    });

}

Names.prototype.getName = function () {
    let animal = this.animals[Math.floor(Math.random() * this.animals.length)];
    let adjective = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    return adjective+animal;
};

module.exports = new Names();