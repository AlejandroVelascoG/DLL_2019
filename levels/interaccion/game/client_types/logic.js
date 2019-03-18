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

    stager.extendStep('training', {
        cb: function() {
            console.log('Training');
            entrenamiento();
        }
    });

    stager.extendStep('game', {
        cb: function() {
            console.log('\n--------------------------------');
            console.log('Game round: ' + node.player.stage.round);
            perros();
        }
    });

    stager.extendStep('puntaje', {
        cb: function() {
            console.log('Score');
        }
    });

    stager.extendStep('debrief', {
        cb: function() {
            console.log('Debrief');
        }
    });

    stager.extendStep('demograf', {
    cb: function() {
      console.log('demograf...');
    }
});

    stager.extendStep('end', {
        cb: function() {
            rands();
            node.game.memory.save(channel.getGameDir() + 'data/data_' +
                                  node.nodename + '.json');

            node.on.data('Recompensa', function(msg) {
              console.log('Recompensa:', msg.from, ' ', msg.data);
            });
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

    function rands(){

      var players = node.game.pl.id.getAllKeys();

      var rand1 = 1;
      var rand2 = 2;
      // var rand1 = Math.floor(Math.random()*4)+2;
      // var rand2 = Math.floor(Math.random()*4)+2;
      if(rand1 == rand2){
        if (rand2 == 5){
          rand2 -= 1;
        } else {
          rand2 += 1;
        }
      }

      // var rand1 = Math.floor(Math.random()*30) + 21;
      // var rand2 = Math.floor(Math.random()*30) + 21;
      // if(rand1 == rand2){
      // 	if (rand2 == 50){
      // 		rand2 -= 1;
      // 	} else {
      // 		rand2 += 1;
      // 	}
      // }
      node.say('Rondas', players[0], [rand1, rand2]);
      node.say('Rondas', players[1], [rand1, rand2]);
    }

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
        dict[as[i]] = "A";
      }

      for(var i = 1; i < 25; i++){
        dict[bs[i]] = "B";
      }

      for(var i = 1; i < 25; i++){
        dict[cs[i]] = "C";
      }

      for(var i = 1; i < 25; i++){
        dict[ds[i]] = "D";
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

    function entrenamiento() {
      var players = node.game.pl.id.getAllKeys();

      var as = [];
      var bs = [];
      var cs = [];
      var ds = [];
      var sendt = []
      var sendh = []
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
        dict[as[i]] = "A";
      }

      for(var i = 1; i < 25; i++){
        dict[bs[i]] = "B";
      }

      for(var i = 1; i < 25; i++){
        dict[cs[i]] = "C";
      }

      for(var i = 1; i < 25; i++){
        dict[ds[i]] = "D";
      }

      var terrier = as.concat(cs);
      var hound = bs.concat(ds);

      terrier.sort(function(a, b){return 0.5 - Math.random()});
      hound.sort(function(a, b){return 0.5 - Math.random()});

      for(var i = 1; i < 6; i++){
        sendt.push(terrier[i]);
        sendh.push(hound[i]);
      }

      node.say('Settings', players[0], [players[1], sendt, dict, 'terrier']);
      node.say('Settings', players[1], [players[0], sendh, dict, 'hound']);

    }

};
