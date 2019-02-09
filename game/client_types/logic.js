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

        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('game', {
        // matcher: {
        //     roles: [ 'DICTATOR', 'OBSERVER' ],
        //     match: 'round_robin',
        //     cycle: 'mirror_invert',
        //     sayPartner: false
        //     skipBye: false,
        //
        // },
        cb: function() {
            console.log('\n--------------------------------')
            console.log('Game round: ' + node.player.stage.round);
            perros();
        }
    });

    stager.extendStep('end', {
        cb: function() {
            node.game.memory.save(channel.getGameDir() + 'data/data_' +
                                  node.nodename + '.json');
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

    function perros(){

      var as = [];
      var bs = [];
      var cs = [];
      var ds = [];

      for (var i=1; i < 25; i++) {
        as[i - 1] = 'A/A' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        bs[i - 1] = 'B/B' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        cs[i - 1] = 'C/C' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        ds[i - 1] = 'D/D' + i + '.jpg';
      }

      node.say('Settings', [as, bs, cs, ds]);
    }

};
