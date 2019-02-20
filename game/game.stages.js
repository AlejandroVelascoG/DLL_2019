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
        .repeat('prep', settings.TRAINING)
        .repeat('trials', settings.REPEAT)
        .next('end')
        .gameover();

    stager.extendStage('trials', {
      steps: [
        'game',
        'puntaje'
      ]
});

    stager.extendStage('prep', {
      steps: [
        'training',
        'puntaje'
      ]
    });
    // Modify the stager to skip one stage.
    stager.skip('instructions');
    //stager.skip('training');

    return stager.getState();
};
