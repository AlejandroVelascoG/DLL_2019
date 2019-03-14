/**
 * # Game stages definition file
 * Copyright(c) 2019 Alejandro Velasco <javier.velasco@urosario.edu.co>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */


 module.exports = function(stager, settings) {

      stager
         .repeat('prep', settings.TRAINING)
         .repeat('trials', settings.REPEAT)
         .next('demograf')
         .next('debrief')
         .next('end')
         .gameover();

      stager.extendStage('prep', {
           steps: [
             'training',
             'puntaje'
           ]
      });

      stager.extendStage('trials', {
         steps: [
           'game',
           'puntaje'
         ]
      });

     // Modify the stager to skip one stage.
     // stager.skip('prep');
     // stager.skip('trials');
     // stager.skip('demograf');
     stager.skip('debrief');
     // stager.skip('end');

     return stager.getState();
 };
