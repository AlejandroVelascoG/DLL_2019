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

      var players = node.game.pl.id.getAllKeys();

      var as = [];
      var bs = [];
      var cs = [];
      var ds = [];
      var send = []
      var dict = {};

      for (var i=1; i < 25; i++) {
        as[i - 1] = 'A' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        bs[i - 1] = 'B' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        cs[i - 1] = 'C' + i + '.jpg';
      }

      for (var i=1; i < 25; i++) {
        ds[i - 1] = 'D' + i + '.jpg';
      }

      for(var i = 1; i < 25; i++){
        dict[as[i]] = "Cairn Terrier";
      }

      for(var i = 1; i < 25; i++){
        dict[bs[i]] = "Irish Wolfhound";
      }

      for(var i = 1; i < 25; i++){
        dict[cs[i]] = "Norwich Terrier";
      }

      for(var i = 1; i < 25; i++){
        dict[ds[i]] = "Scottish Deerhound";
      }

      var perros = as.concat(bs, cs, ds);

      perros.sort(function(a, b){return 0.5 - Math.random()});

      for(var i = 1; i < 6; i++){
        send.push(perros[i]);
      }
      console.log(send);

      // console.log(perros);


      node.say('Settings', players[0], [players[1], send, dict]);
      node.say('Settings', players[1], [players[0], send, dict]);
    }

};
