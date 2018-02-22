"use strict";

GameStates.makeAbout = function( game, shared ) {

    return {
        create: function () {
            var aboutTitle = game.add.text(80, 80, 'Game Info', { font: '50px Arial', fill: '#ffffff' });


        }
    };
};