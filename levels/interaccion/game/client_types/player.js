/**
 * # Player type implementation of the game stages
 * Copyright(c) 2019 Alejandro Velasco <javier.velasco@urosario.edu.co>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var stepRules = ngc.stepRules;
var constants = ngc.constants;
var publishLevels = constants.publishLevels;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var game;

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header);

        // this.doneButton = node.widgets.append('DoneButton', header);

        this.contadorComunicacion = 1;
        this.contadorComunicacionMensajes = 1;
        this.contadorMensajes = 0;
        this.indiceMensaje = 0;
        var dict = {};
        this.puntajeAcumulado = dict;
        this.check = [];
        this.perrosPantalla = [];
        this.respuestasRonda = [];
        // this.perrosMensajes = [];
        // this.contadorMensajesRonda = 0;

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('training', {
        donebutton: false,
        frame: 'training.htm',
        cb: function(){

          node.on.data('Settings', function(msg) {

            var MESSAGE = msg.data; //Datos enviados desde logic con informacion para la ronda
            var ronda = node.player.stage.round; //Ronda en curso

            node.game.puntajeAcumulado[ronda] = 0;
            // node.game.contadorComunicacion = 1;
            node.game.check = [];
            node.game.perrosPantalla = [];
            node.game.respuestasRonda = [];
            var selectPerro1 = W.getElementById('select1');
            var selectPerro2 = W.getElementById('select2');
            var selectPerro3 = W.getElementById('select3');
            var selectPerro4 = W.getElementById('select4');
            var selectPerro5 = W.getElementById('select5');

            var otroJugador = MESSAGE[0];
            var perros = MESSAGE[1];
            var claves = MESSAGE[2];
            var raza = MESSAGE[3];

			var revision;

			revision = function(){
				var choice1 = selectPerro1.selectedIndex;
	            var choice2 = selectPerro2.selectedIndex;
	            var choice3 = selectPerro3.selectedIndex;
	            var choice4 = selectPerro4.selectedIndex;
	            var choice5 = selectPerro5.selectedIndex;

	            var ans1 = selectPerro1.options[choice1].value;
	            var ans2 = selectPerro2.options[choice2].value;
	            var ans3 = selectPerro3.options[choice3].value;
	            var ans4 = selectPerro4.options[choice4].value;
	            var ans5 = selectPerro5.options[choice5].value;

	            var clasif = [ans1, ans2, ans3, ans4, ans5];
              node.game.respuestasRonda = clasif;
              console.log('Respuestas en game', node.game.respuestasRonda);

	            var key1 = claves[perros[0]];
	            var key2 = claves[perros[1]];
	            var key3 = claves[perros[2]];
	            var key4 = claves[perros[3]];
	            var key5 = claves[perros[4]];

              for (var i = 0; i < 5; i++) {
                node.set({ParaK: [perros[i], clasif[i]]});
              }

	            var keys = [key1, key3, key3, key4, key5];

	            if (ans1 == key1){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans2 == key2){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans3 == key3){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans4 == key4){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans5 == key5){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            // console.log('puntos', node.game.check);
              var sum = 0;
              for (var i=0; i < node.game.check.length; i++) {
                sum += node.game.check[i];
              }
	            // var sum = node.game.check.reduce(function(a, b) { return a + b; }, 0);
	            node.game.puntajeAcumulado[ronda] = sum;
	            // console.log('puntos', sum);
	            // console.log('LISTA: ', node.game.perrosMensajes);
	            node.set({Puntaje:[clasif, keys, sum]});
			};

            var crono = node.game.timer;
            var act = crono.hooks;
            act.push(revision);
            crono.update = 60000;

                  // carga las imágenes de los cinco perros

            for(var i = 1; i < 6; i++){
              var foto = 'Perro' + i;
              var ubicacion = 'carpetaPerros/' + perros[i-1];
              node.game.perrosPantalla.push(ubicacion);
              W.getElementById(foto).src = ubicacion;
              if(raza == 'terrier'){
                W.getElementById('opB'+i).style.display = "none";
                W.getElementById('opD'+i).style.display = "none";
              }
              if(raza == 'hound'){
                W.getElementById('opA'+i).style.display = "none";
                W.getElementById('opC'+i).style.display = "none";
              }
            }

            node.on('Solicitud', function(msg){
              if(msg == 'terminar'){
              	revision();
                node.done();
              }
              if(msg == 'seguir'){
                W.getElementById('confirmarRonda').style.display = "none";
              }
            });

            var continuar;
            continuar = W.getElementById('continuar');
            continuar.onclick = function() {
              W.getElementById('confirmarRonda').style.display = "block";
            };

          });
        }
    });

    stager.extendStep('game', {
        donebutton: false,
        frame: 'game.htm',
        cb: function(){

          node.on.data('Settings', function(msg) {

            var MESSAGE = msg.data; //Datos enviados desde logic con informacion para la ronda
            var ronda = node.player.stage.round; //Ronda en curso
            var mensajeEnviado = ['A', 'B', 'C', 'D'];
            var respuestas = ['Si', 'No', 'No se'];

            var rondasTraining = node.game.settings.TRAINING;
            console.log('Oops', node.game.puntajeAcumulado);
            node.game.puntajeAcumulado[rondasTraining + ronda] = 0;
            node.game.indiceMensaje = 0;
            node.game.contadorComunicacion = 1;
            node.game.contadorComunicacionMensajes = 1;
            node.game.contadorMensajes = 0;
            node.game.check = [];
            node.game.perrosPantalla = [];
            node.game.respuestasRonda = [];
            // node.game.perrosMensajes = [];
            // node.game.contadorMensajesRonda = 0;
            var selectMensajes = W.getElementById('soflow-color'); // La lista de mensajes recibidos
            var selectPerro1 = W.getElementById('select1');
            var selectPerro2 = W.getElementById('select2');
            var selectPerro3 = W.getElementById('select3');
            var selectPerro4 = W.getElementById('select4');
            var selectPerro5 = W.getElementById('select5');
            selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " mensajes";

            var otroJugador = MESSAGE[0];
            var perros = MESSAGE[1];
            var claves = MESSAGE[2];

            var partner_done = true;

            var revision;

			revision = function(){
				      var choice1 = selectPerro1.selectedIndex;
	            var choice2 = selectPerro2.selectedIndex;
	            var choice3 = selectPerro3.selectedIndex;
	            var choice4 = selectPerro4.selectedIndex;
	            var choice5 = selectPerro5.selectedIndex;

	            var ans1 = selectPerro1.options[choice1].value;
	            var ans2 = selectPerro2.options[choice2].value;
	            var ans3 = selectPerro3.options[choice3].value;
	            var ans4 = selectPerro4.options[choice4].value;
	            var ans5 = selectPerro5.options[choice5].value;

	            var clasif = [ans1, ans2, ans3, ans4, ans5];
              node.game.respuestasRonda = clasif;
              console.log('Respuestas en game', node.game.respuestasRonda);

	            var key1 = claves[perros[0]];
	            var key2 = claves[perros[1]];
	            var key3 = claves[perros[2]];
	            var key4 = claves[perros[3]];
	            var key5 = claves[perros[4]];

              for (var i = 0; i < 5; i++) {
                node.set({ParaK: [perros[i], clasif[i]]});
              }

	            var keys = [key1, key3, key3, key4, key5];

	            if (ans1 == key1){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans2 == key2){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans3 == key3){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans4 == key4){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            if (ans5 == key5){
	              node.game.check.push(1);
	            } else {
	              node.game.check.push(0);
	            }
	            // console.log('puntos', node.game.check);
              var sum = 0;
              for (var i=0; i < node.game.check.length; i++) {
                sum += node.game.check[i];
              }
	            // var sum = node.game.check.reduce(function(a, b) { return a + b; }, 0); // PILAS QUE PUEDE ESTAR ERRADO
	            node.game.puntajeAcumulado[rondasTraining + ronda] = sum;
	            console.log('puntos', sum);
	            console.log('LISTA: ', node.game.perrosMensajes);
	            node.set({Puntaje:[clasif, keys, sum]});
			};

            var crono = node.game.timer;
            var act = crono.hooks;
            act.push(revision);
            crono.update = 80000;

                  // carga las imágenes de los cinco perros

            for(var i = 1; i < 6; i++){
              var foto = 'Perro' + i;
              var ubicacion = 'carpetaPerros/' + perros[i-1];
              node.game.perrosPantalla.push(ubicacion);
              W.getElementById(foto).src = ubicacion;
            }

            var ok = W.getElementById('correcto');
            var nok = W.getElementById('incorrecto');

                  // deja los dos modales cerrados

            W.getElementById('enviarSolicitud').style.display = "none";
            W.getElementById('solicitudAbierta').style.display = "none";

                        // ABRIR MODAL DE SOLICITUD

            var enviar = W.getElementById('enviarSolicitud');

            var idPerro  = '';
            var idRecibido = '';

            node.on('Arrastrar', function(msg){
              if(enviar.style.display == "none" && partner_done == true){
                if (msg[1] == 'droptarget'){
                  enviar.style.display = "block";
                  idPerro = msg[0];
                  W.getElementById(idPerro).style.border = "5px solid Yellow";
                  W.getElementById('botonSolicitud').style.opacity = "0.5";
                }
              }
            });

            var recibida = W.getElementById('solicitudAbierta');

                            // HACER Y RESPONDER SOLICITUD

            node.on('Solicitud', function(msg){
              if (msg == 'cerrar'){
                enviar.style.display = "none";
                //recibida.style.display="none";
                W.getElementById('botonSolicitud').style.opacity = "1";
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'A'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[0], idPerro]);
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                node.set({Comunicacion: [mensajeEnviado[0], idPerro, suposicion, node.game.contadorComunicacion]});
                node.game.contadorComunicacion += 1;
              }
              if (msg == 'B'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[1], idPerro]);
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
				var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                node.set({Comunicacion: [mensajeEnviado[1], idPerro, suposicion, node.game.contadorComunicacion]});
                node.game.contadorComunicacion += 1;
              }
              if (msg == 'C'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[2], idPerro]);
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                node.set({Comunicacion: [mensajeEnviado[2], idPerro, suposicion, node.game.contadorComunicacion]});
                node.game.contadorComunicacion += 1;
              }
              if (msg == 'D'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[3], idPerro]);
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                node.set({Comunicacion: [mensajeEnviado[3], idPerro, suposicion, node.game.contadorComunicacion]});
                node.game.contadorComunicacion += 1;
              }
              if(msg == 'Correcto'){
                node.say('Respuesta', otroJugador, ['Correcto', idRecibido]);
                recibida.style.display = "none";
                W.getElementById(idRecibido).style.border = "";
                node.set({Respuesta: [respuestas[0], idRecibido, node.game.indiceMensaje]});
              }
              if(msg == 'Incorrecto'){
                node.say('Respuesta', otroJugador, ['Incorrecto', idRecibido]);
                recibida.style.display = "none";
                W.getElementById(idRecibido).style.border = "";
                node.set({Respuesta: [respuestas[1], idRecibido, node.game.indiceMensaje]});
              }
              if(msg == 'nose'){
                node.say('Respuesta', otroJugador, ['nose', idRecibido]);
                recibida.style.display = "none";
                W.getElementById(idRecibido).style.border = "";
                node.set({Respuesta: [respuestas[2], idRecibido, node.game.indiceMensaje]});
              }
              if(msg == 'terminar'){
				node.say('Final', otroJugador, 'acabó');
              	revision();
                node.done();
              }
              if(msg == 'continuar'){
                W.getElementById('confirmarRonda').style.display = "none";
              }
              if(msg == 'bloquear'){
              	W.getElementById('companero').style.display = "none";
              	W.getElementById('soflow-color').disabled = true;
              	W.getElementById('soflow-color').style.opacity = "0.5";
              	W.getElementById('botonSolicitud').style.opacity = "0.5";
              	W.getElementById('dummy').style.display = "block";
              	partner_done = false;
              }
            });

					// NOTIFICACIÓN DE CONFIRMACIÓN

			node.on.data('Final', function(msg){
				W.getElementById('companero').style.display = "block";
			});

                    // NOTIFICACIÓN DE NUEVA SOLICITUD

            node.on.data('Comunicacion', function(msg) {
              node.emit('Muestra_Popup');
              W.setInnerHTML('notif', "<br> ¡TIENE UNA SOLICITUD NUEVA!");

              // Agrega el mensaje a la lista
              var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
              opt.value = msg.data; // Objeto enviado
              console.log('Mensaje en lista ', opt.value);
              // node.game.perrosMensajes.unshift(msg.data[1]);
              // node.game.contadorMensajesRonda += 1;
              // idRecibido = node.game.perrosMensajes[node.game.contadorMensajesRonda-1];
              // idRecibido = msg.data[1];
              opt.text = "Mensaje " + node.game.contadorComunicacionMensajes; // Número de mensaje
              selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
              node.game.contadorComunicacionMensajes += 1;
              node.game.contadorMensajes += 1;
              selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " solicitudes sin leer";
            }); // End node.on.data('Comunicacion'

                          // ABRIR SOLICITUDES

            selectMensajes.onchange = function() {
              if(partner_done == true){
				        var indice = this.selectedIndex; // El indice del mensaje seleccionado
	              var indiceMensaje = this.options[indice].text; // El texto con el numero de mensaje
	              indiceMensaje = indiceMensaje.replace('Mensaje ', ''); // Obtengo el número
	              console.log('indiceMensaje', indiceMensaje);
	              node.game.indiceMensaje = indiceMensaje;
	              var listaCorreo = this.options[indice].value.split(',');
	              console.log('listaCorreo', listaCorreo);
	              var correo = listaCorreo[0]; // Lo que dice el mensaje
	              console.log('correo', correo);
	              idRecibido = listaCorreo[1]; // El perro del mensaje
	              console.log('idRecibido', idRecibido);
	              // idRecibido = node.game.perrosMensajes[node.game.contadorMensajesRonda-1];
	              node.say('Popup', otroJugador, [idRecibido, correo]);
	              this.remove(this.selectedIndex); // Elimina item de la lista desplegable
	              node.game.contadorMensajes -= 1;
	              selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " mensajes";
	              W.getElementById('solicitudAbierta').style.display = 'block'; // Abre ventana de responder
	              W.setInnerHTML('Solicitud', correo); // Muestra lo que dice el mensaje
	              // console.log('CONTADOR RONDA: ', node.game.contadorMensajesRonda);
	              W.getElementById(idRecibido).style.border = "5px solid Yellow";
	              // node.game.contadorMensajesRonda -= 1;
              }
            };

            // PONE LA RAZA DEL PERRO EN EL POPUP QUE CORRESPONDE

            node.on.data('Popup', function(msg){
              switch(msg.data[0]){
                case 'Perro1':
                  W.setInnerHTML('popdog1', msg.data[1]);
                case 'Perro2':
                  W.setInnerHTML('popdog2', msg.data[1]);
                case 'Perro3':
                  W.setInnerHTML('popdog3', msg.data[1]);
                case 'Perro4':
                  W.setInnerHTML('popdog4', msg.data[1]);
                case 'Perro5':
                  W.setInnerHTML('popdog5', msg.data[1]);
              }
            })

            // PONE LA RESPUESTA (SÍ O NO) EN EL POPUP CORRESPONDIENTE

            node.on.data('Respuesta', function(msg){
              if(msg.data[1] == 'Perro1'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm1', '<br> SI es ');
                  node.emit('Muestra_Pop1');
                } else if (msg.data[0] == 'Incorrecto'){
                  W.setInnerHTML('confirm1', '<br> NO es ');
                  node.emit('Muestra_Pop1');
                } else{
                  W.setInnerHTML('confirm1', '<br> No sé si es ');
                  node.emit('Muestra_Pop1');
                }
              }
              if(msg.data[1] == 'Perro2'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm2', '<br> SI es ');
                  node.emit('Muestra_Pop2');
                } else if (msg.data[0] == 'Incorrecto'){
                  W.setInnerHTML('confirm2', '<br> NO es ');
                  node.emit('Muestra_Pop2');
                } else{
                  W.setInnerHTML('confirm2', '<br> No sé si es ');
                  node.emit('Muestra_Pop2');
                }
              }
              if(msg.data[1] == 'Perro3'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm3', '<br> SI es ');
                  node.emit('Muestra_Pop3');
                } else if (msg.data[0] == 'Incorrecto'){
                  W.setInnerHTML('confirm3', '<br> NO es ');
                  node.emit('Muestra_Pop3');
                } else{
                  W.setInnerHTML('confirm3', '<br> No sé si es ');
                  node.emit('Muestra_Pop3');
                }
              }
              if(msg.data[1] == 'Perro4'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm4', '<br> SI es ');
                  node.emit('Muestra_Pop4');
                } else if (msg.data[0] == 'Incorrecto'){
                  W.setInnerHTML('confirm4', '<br> NO es ');
                  node.emit('Muestra_Pop4');
                } else{
                  W.setInnerHTML('confirm4', '<br> No sé si es ');
                  node.emit('Muestra_Pop4');
                }
              }
              if(msg.data[1] == 'Perro5'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm5', '<br> SI es ');
                  node.emit('Muestra_Pop5');
                } else if (msg.data[0] == 'Incorrecto'){
                  W.setInnerHTML('confirm5', '<br> NO es ');
                  node.emit('Muestra_Pop5');
                } else{
                  W.setInnerHTML('confirm5', '<br> No sé si es ');
                  node.emit('Muestra_Pop5');
                }
              }
            });
                    // Pasa a la siguiente ronda

            var continuar;
            continuar = W.getElementById('continuar');
            continuar.onclick = function() {
              W.getElementById('confirmarRonda').style.display = "block";
            };
          });
        }
    });


    stager.extendStep('puntaje', {
      frame: 'puntaje.htm',
      cb: function(){
        W.getElementById('select1').options[0].innerHTML = node.game.respuestasRonda[0];
        W.getElementById('select2').options[0].innerHTML = node.game.respuestasRonda[1];
        W.getElementById('select3').options[0].innerHTML = node.game.respuestasRonda[2];
        W.getElementById('select4').options[0].innerHTML = node.game.respuestasRonda[3];
        W.getElementById('select5').options[0].innerHTML = node.game.respuestasRonda[4];
        // W.getElementById('select1').options[0].innerHTML = "I'm a genius!";
        console.log('Respuestas en puntaje', node.game.respuestasRonda[i-1]);
        for(var i = 1; i < 6; i++){
          var foto = 'Perro' + i;
          var ubicacion = node.game.perrosPantalla[i-1];
          W.getElementById(foto).src = ubicacion;
        }
        for(var i = 1; i < 6; i++){
          if(node.game.check[i-1] == 1){
            console.log('right' + i);
            W.getElementById('right' + i).style.display = "block";
            W.setInnerHTML('resultado' + i, 'Acertó!');
          } else {
            console.log('wrong' + i);
            W.getElementById('wrong' + i).style.display = "block";
            W.setInnerHTML('resultado' + i, 'Falló!');
          }
        }
        var continuar = W.getElementById('continuar');
        continuar.onclick = function() {
          node.done();
        };
      }
    });

    stager.extendStep('demograf', {
        init: function() {
            var w;
            w = node.widgets;
            this.demo1 = w.get('ChoiceManager', {
                id: 'demo1',
                title: false,
                shuffleForms: false,
                forms: [
                    w.get('ChoiceTable', {
                        id: 'gender',
                        mainText: '¿Cuál es su género?',
                        choices: [
                            'Masculino',
                            'Femenino',
                            'Otro',
                            'Prefiero no decirlo'
                        ],
                        shuffleChoices: false,
                        title: false,
                        requiredChoice: true
                    }),
                    w.get('ChoiceTable', {
                        id: 'age',
                        mainText: '¿Cuál es su grupo de edad?',
                        choices: [
                            '18-20',
                            '21-30',
                            '31-40',
                            '41-50',
                            '51-60',
                            '61-70',
                            '71+',
                            'Prefiero no decirlo'
                        ],
                        shuffleChoices: false,
                        title: false,
                        requiredChoice: true
                    }),
                    w.get('ChoiceTable', {
                        id: 'carreer',
                        mainText: 'Seleccione su unidad académica (si es de doble programa, escoja solo la unidad académica de su programa base):',
                        choices: [
                            'Facultad de Ciencias Naturales y Matemáticas',
                            'Escuela de Medicina Ciencias de la Salud',
                            'Escuela de Ciencias Humanas',
                            'Escuela de Administración',
                            'Facultad de Ciencia Política, Gobierno y Relaciones Internacionales',
                            'Facultad de Economía',
                            'Facultad de Jurisprudencia',
                            'Prefiero no decirlo'
                        ],
                        shuffleChoices: false,
                        title: false,
                        requiredChoice: true
                    })
                  ]
                });
                this.demo2 = w.get('ChoiceManager', {
                      id: 'demo2',
                      title: false,
                      shuffleForms: false,
                      forms: [
                          w.get('ChoiceTable', {
                              id: 'strategy',
                              mainText: 'Durante el juego,',
                              choices: [
                                  'me basé totalmente en la clasificación de mi compañero',
                                  'apendí a clasificar algunos perros y confié en mi compañero para clasificar otros',
                                  'aprendía clasificar todos los perros',
                                  'Prefiero no decirlo'
                              ],
                              shuffleChoices: false,
                              title: false,
                              requiredChoice: true
                            }),
                            w.get('ChoiceTable', {
                                id: 'messages',
                                mainText: 'Hacia el final del juego, pregunté sobre la(s) categoría(s) (puede escoger varias opciones):',
                                choices: [
                                    'A',
                                    'B',
                                    'C',
                                    'D',
                                    'Prefiero no decirlo'
                                ],
                                selectMultiple: true,
                                shuffleChoices: false,
                                title: false,
                                requiredChoice: false
                              }),
                            w.get('ChoiceTable', {
                                id: 'recognition',
                                mainText: 'Al finalizar el juego podía reconocer los perros de las categorías (puede escoger varias opciones):',
                                choices: [
                                    'A',
                                    'B',
                                    'C',
                                    'D',
                                    'Prefiero no decirlo'
                                ],
                                selectMultiple: true,
                                shuffleChoices: false,
                                title: false,
                                requiredChoice: false
                          })
                      ]
            });
        },
        donebutton: false,
        frame: 'demograf.htm', // must exist, or remove.
        cb: function() {
            var buttonSubmit = W.getElementById('continuar');
            buttonSubmit.onclick = function() {
                node.done();
            }
        },
        done: function() {
            var values1, values2, isTimeup;
            values1 = this.demo1.getValues({ highlight: true });
            values2 = this.demo2.getValues({ highlight: true });
            console.log(values1);
            console.log(values2);
            // In case you have a timer running, block done procedure
            // if something is missing in the form and it is not a timeup yet.
            isTimeup = node.game.timer.isTimeup();
            if (values1.missValues.length && !isTimeup) return false;
            // if (values2.missValues.length && !isTimeup) return false;
            // Adds it to the done message sent to server.
            return {
              valores_demogra: values1,
              valores_strat: values2,
            };
        }
    });

    stager.extendStep('debrief', {
        donebutton: false,
        frame: 'debrief.htm',
        cb: function() {
          var continuar = W.getElementById('continuar');
          continuar.onclick = function() {
            node.done();
          };
        }
    });



    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
          node.on.data('Rondas', function(msg){
            var rand1 = msg.data[0];
            var rand2 = msg.data[1];
            var punt1 = node.game.puntajeAcumulado[rand1];
            var punt2 = node.game.puntajeAcumulado[rand2];

            W.setInnerHTML('randRonda1', rand1 - 20);
            W.setInnerHTML('r1', rand1 - 20);
            W.setInnerHTML('randRonda2', rand2 - 20);
            W.setInnerHTML('r2', rand2 - 20);

            W.setInnerHTML('correctPerros1', punt1);
            W.setInnerHTML('correctPerros2', punt2);

            var tot = 0;

            if (punt1 == 0){
                W.setInnerHTML('recompensa1', 0);
              }
              if (punt1 == 1){
                W.setInnerHTML('recompensa1', 1);
                tot += 1;
              }
              if (punt1 == 2){
                W.setInnerHTML('recompensa1', 2);
                tot += 2;
              }
              if (punt1 == 3){
                W.setInnerHTML('recompensa1', 4);
                tot += 4;
              }
              if (punt1 == 4){
                W.setInnerHTML('recompensa1', 7);
                tot += 7;
              }
              if (punt1 == 5){
                W.setInnerHTML('recompensa1', 10);
                tot += 10;
              }
              if (punt2 == 0){
                  W.setInnerHTML('recompensa2', 0);
                }
              if (punt2 == 1){
                W.setInnerHTML('recompensa2', 1);
                tot += 1;
              }
              if (punt2 == 2){
                W.setInnerHTML('recompensa2', 2);
                tot += 2;
              }
              if (punt2 == 3){
                W.setInnerHTML('recompensa2', 4);
                tot += 4;
              }
              if (punt2 == 4){
                W.setInnerHTML('recompensa2', 7);
                tot += 7;
              }
              if (punt2 == 5){
                W.setInnerHTML('recompensa2', 10);
                tot += 10;
              }


                W.setInnerHTML('recompensaTotal', tot + 10);

                node.say('Recompensa', 'SERVER', tot + 10);

                  node.game.visualTimer.setToZero();
            });
          }
    });

    game = setup;
    game.plot = stager.getState();
    return game;
};
