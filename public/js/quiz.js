(function QUIZ(answers) {

    var node =  parent.node,
        J = parent.JSUS,
        W = parent.W;

    var results = {
        correct: false
    };

    function checkAnswer(a) {
        if (!a || !answers) return;

        var checked = getCheckedValue(a);
        return checked != answers[a.name];
    }

    function checkAnswers(submitButton) {
        var correct, counter = 0;
        J.each(document.forms, function(a) {
            if (!results[a.name]) results[a.name] = [];
            correct = checkAnswer(a);

            if (correct) {
                W.highlight(a, 'ERR');
                switch(a.id){
                  case 'rounds':
                    document.getElementById(a.id + '_result').innerHTML = 'Incorrecto! El juego consiste en clasificar correctamente los perros';
                    break;
                  case 'objetos':
                    document.getElementById(a.id + '_result').innerHTML = 'Incorrecto! El juego tiene <b>20 rondas</b> de entrenamiento';
                    break;
                  case 'puntos':
                    document.getElementById(a.id + '_result').innerHTML = 'Incorrecto! Hay <b>4 categorías</b> de clasificación';
                    break;
                  case 'umbral':
                    document.getElementById(a.id + '_result').innerHTML = 'Incorrecto! Son <b>60 segundos</b> para las rondas de entrenamiento y <b>80 segundos</b> en las rondas de juego';
                    break;
                }
                // document.getElementById(a.id + '_result').innerHTML = 'Incorrecto. Intente de nuevo.';
                results[a.name].push(0);
            }
            else {
                W.highlight(a, 'OK');
                document.getElementById(a.id + '_result').innerHTML = '¡Correcto!';
                results[a.name].push(1);
                counter++;
            }
        });

        document.getElementById('answers_counter').innerHTML = counter + ' / ' + document.forms.length;

        if (counter === document.forms.length) {
            submitButton.disabled = true;
            results.correct = true;
        }
        return results;
    }

    function getCheckedValue(radioObj) {
        if (!radioObj) return;

        if (radioObj.length) {
            for (var i = 0; i < radioObj.length; i++) {
                if (radioObj[i].checked) {
                    return radioObj[i].value;
                }
            }
        }

        return radioObj.checked;
    }

    // set the radio button with the given value as being checked
    // do nothing if there are no radio buttons
    // if the given value does not exist, all the radio buttons
    // are reset to unchecked
    function setCheckedValue(radioObj, newValue) {
        if (!radioObj)
            return;
        var radioLength = radioObj.length;
        if (radioLength == undefined) {
            radioObj.checked = (radioObj.value == newValue.toString());
            return;
        }
        for (var i = 0; i < radioLength; i++) {
            radioObj[i].checked = false;
            if (radioObj[i].value == newValue.toString()) {
                radioObj[i].checked = true;
            }
        }
    }

    window.QUIZ = {
        setCheckedValue: setCheckedValue,
        getCheckedValue: getCheckedValue,
        checkAnswers: checkAnswers
    };

})({
    rounds: 15,
    objetos: 4,
    puntos: 2,
    umbral: 2
});
