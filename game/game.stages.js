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
        .next('instructions')
        //.repeat('training', settings.TRAINING)
        .repeat('trials', settings.REPEAT)
        .next('end')
        .gameover();

    stager.extendStage('trials', {
      steps: [
        'game',
        'puntaje'
      ]
});
    // Modify the stager to skip one stage.
    stager.skip('instructions');

    return stager.getState();
};
