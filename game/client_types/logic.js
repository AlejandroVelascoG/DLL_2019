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

    stager.extendStep('tutorialTraining', {
        cb: function() {
            console.log('tutorialTraining');
            entrenamiento();
        }
    });

    stager.extendStep('tutorialGame', {
        cb: function() {
            console.log('tutorialGame');
            perros();
        }
    });

    stager.extendStep('tiempo', {
    cb: function() {
        console.log('tiempo');
        }
    });

    stager.extendStep('recompensa', {
    cb: function() {
        console.log('recompensa');
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
