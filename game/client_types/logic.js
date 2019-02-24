/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2019 Alejandro Velasco <javier.velasco@urosario.edu.co>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var stepRules = ngc.stepRules;
var constants = ngc.constants;
var J = ngc.JSUS;
var counter = 0;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    // Increment counter.
    counter = counter ? ++counter : settings.SESSION_ID || 1;

    stager.setOnInit(function() {

      node.on.data('quiz-over', function(msg) {
          // Move client to part2.
          // (async so that it finishes all current step operations).
          setTimeout(function() {
              console.log('pasando a interaccion: ', msg.from);
              channel.moveClientToGameLevel(msg.from, 'interaccion',
                                            gameRoom.name);
          }, 10);
    });
});

    stager.extendStep('bienvenida', {
        cb: function() {
            console.log('Bienvenida');
        }
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('quiz', {
        cb: function() {
            console.log('Quiz');
        }
    });

    stager.setOnGameOver(function() {

        // Something to do.

    });

    // Here we group together the definition of the game logic.
    return {
        nodename: 'lgc' + counter,
        // Extracts, and compacts the game plot that we defined above.
        plot: stager.getState(),

    };

};
