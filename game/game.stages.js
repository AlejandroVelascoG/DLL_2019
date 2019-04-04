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
         .next('bienvenida')
         .next('instructions')
         .next('tutorial_training')
         .next('tutorial_game')
         .next('quiz')
         .gameover();

     stager.extendStage('tutorial_training', {
       steps: [
         'tutorialTraining',
         'puntaje_training'
       ]
     });

     stager.extendStage('tutorial_game', {
       steps: [
         'tutorialGame',
         'puntaje_game',
         'tiempo',
         'recompensa'
       ]
     });

     // Modify the stager to skip one stage.
     stager.skip('bienvenida');
     stager.skip('instructions');
     stager.skip('tutorial_training');
     stager.skip('tutorial_game');

     //stager.skip('quiz');

     return stager.getState();
 };
