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

        this.doneButton = node.widgets.append('DoneButton', header);

        this.contadorComunicacion = 1;
        this.contadorComunicacionMensajes = 1;
        this.contadorMensajes = 0;
        this.indiceMensaje = 0;
        var dict = {};
        this.puntajeAcumulado = dict;

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    stager.extendStep('game', {
        donebutton: false,
        frame: 'game.htm',
        cb: function(){

          node.on.data('Settings', function(msg) {

            var MESSAGE = msg.data; //Datos enviados desde logic con informacion para la ronda
            var ronda = node.player.stage.round; //Ronda en curso
            var mensajeEnviado = ['A', 'B', 'C', 'D'];

            node.game.puntajeAcumulado[ronda] = 0;
            node.game.indiceMensaje = 0;
            node.game.contadorComunicacion = 1;
            node.game.contadorMensajes = 0;
            var selectMensajes = W.getElementById('soflow-color'); // La lista de mensajes recibidos
            var selectPerro1 = W.getElementById('select1');
            var selectPerro2 = W.getElementById('select2');
            var selectPerro3 = W.getElementById('select3');
            var selectPerro4 = W.getElementById('select4');
            var selectPerro5 = W.getElementById('select5');
            selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " mensajes";

            var otroJugador = MESSAGE[0];
            var perros = MESSAGE[1];
            var listaA = MESSAGE[2];
            var listaB = MESSAGE[3];
            var listaC = MESSAGE[4];
            var listaD = MESSAGE[5];

                  // carga las imágenes de los cinco perros

            for(var i = 1; i < 6; i++){
              var foto = 'Perro' + i;
              var ubicacion = 'carpetaPerros/' + perros[i];
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
              if (msg[1] == 'droptarget'){
                enviar.style.display = "block"
                idPerro = msg[0];
                W.getElementById(idPerro).style.border = "5px solid Yellow";
              }
            });

            var recibida = W.getElementById('solicitudAbierta');

                            // HACER Y RESPONDER SOLICITUD

            node.on('Solicitud', function(msg){
              if (msg == 'cerrar'){
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'A'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[0], idPerro]);
                enviar.style.display = "none";
                node.game.contadorComunicacion += 1;
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'B'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[1], idPerro]);
                enviar.style.display = "none";
                node.game.contadorComunicacion += 1;
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'C'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[2], idPerro]);
                enviar.style.display = "none";
                node.game.contadorComunicacion += 1;
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'D'){
                node.say('Comunicacion', otroJugador, [mensajeEnviado[3], idPerro]);
                enviar.style.display = "none";
                node.game.contadorComunicacion += 1;
                W.getElementById(idPerro).style.border = "";
              }
              if(msg == 'Correcto'){
                node.say('Respuesta', otroJugador, ['Correcto', idRecibido]);
                recibida.style.display = "none";
                W.getElementById(idRecibido).style.border = "";
                console.log(idRecibido);
              }
              if(msg == 'Incorrecto'){
                node.say('Respuesta', otroJugador, ['Incorrecto', idRecibido]);
                recibida.style.display = "none";
                W.getElementById(idRecibido).style.border = "";
                console.log(idRecibido);
              }
            });

                    // NOTIFICACIÓN DE NUEVA SOLICITUD

            node.on.data('Comunicacion', function(msg) {
              node.emit('Muestra_Popup');
              W.setInnerHTML('notif', "<br> ¡TIENE UNA SOLICITUD NUEVA!");

              // Agrega el mensaje a la lista
              var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
              opt.value = msg.data[0]; // Objeto enviado
              idRecibido = msg.data[1];
              opt.text = "Mensaje " + node.game.contadorComunicacionMensajes; // Número de mensaje
              selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
              node.game.contadorComunicacionMensajes += 1;
              node.game.contadorMensajes += 1;
              selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " solicitudes sin leer";
            }); // End node.on.data('Comunicacion'

                          // ABRIR SOLICITUDES
            var preg = '';

            selectMensajes.onchange = function() {
              var indice = this.selectedIndex; // El indice del mensaje seleccionado
              var indiceMensaje = this.options[indice].text; // El texto con el numero de mensaje
              indiceMensaje = indiceMensaje.replace('Mensaje ', ''); // Obtengo el número
              console.log('indiceMensaje', indiceMensaje);
              node.game.indiceMensaje = indiceMensaje;
              var correo = this.options[indice].value; // Lo que dice el mensaje
              preg = correo;
              this.remove(this.selectedIndex); // Elimina item de la lista desplegable
              node.game.contadorMensajes -= 1;
              selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " mensajes";
              W.getElementById('solicitudAbierta').style.display = 'block'; // Abre ventana de responder
              W.setInnerHTML('Solicitud', correo); // Muestra lo que dice el mensaje
              W.getElementById(idRecibido).style.border = "5px solid Yellow";
            };

            node.on.data('Respuesta', function(msg){
              console.log(preg);
              if(msg[1] == 'Perro1'){
                if(msg[0] == 'Correcto'){
                  node.emit('Muestra_Popup');
                  W.setInnerHTML('nofit', "<br> Su compañero dice: " + preg);
                  preg = '';
                } else {
                  node.emit('Muestra_Popup');
                  W.setInnerHTML('notif', "<br> Su compañero dice: no es" + preg);
                  preg = '';
                }
              }
              if(msg[1] == 'Perro2'){
                if(msg[0] == 'Correcto'){
                  node.emit('Muestra_Pop2');
                  W.setInnerHTML('popdog2', "<br> Su compañero dice: " + preg);
                  preg = '';
                } else {
                  node.emit('Muestra_Pop2');
                  W.setInnerHTML('popdog2', "<br> Su compañero dice: no es" + preg);
                  preg = '';
                }
              }
              if(msg[1] == 'Perro3'){
                if(msg[0] == 'Correcto'){
                  node.emit('Muestra_Pop3');
                  W.setInnerHTML('popdog3', "<br> Su compañero dice: " + preg);
                  preg = '';
                } else {
                  node.emit('Muestra_Pop3');
                  W.setInnerHTML('popdog3', "<br> Su compañero dice: no es" + preg);
                  preg = '';
                }
              }
              if(msg[1] == 'Perro4'){
                if(msg[0] == 'Correcto'){
                  node.emit('Muestra_Pop4');
                  W.setInnerHTML('popdog4', "<br> Su compañero dice: " + preg);
                  preg = '';
                } else {
                  node.emit('Muestra_Pop4');
                  W.setInnerHTML('popdog4', "<br> Su compañero dice: no es" + preg);
                  preg = '';
                }
              }
              if(msg[1] == 'Perro5'){
                if(msg[0] == 'Correcto'){
                  node.emit('Muestra_Pop5');
                  W.setInnerHTML('popdog5', "<br> Su compañero dice: " + preg);
                  preg = '';
                } else {
                  node.emit('Muestra_Pop5');
                  W.setInnerHTML('popdog5', "<br> Su compañero dice: no es" + preg);
                  preg = '';
                }
              }
            });
                    // Pasa a la siguiente ronda

            var continuar;
            continuar = W.getElementById('continuar');
            continuar.onclick = function() {
              var indice1 = selectPerro1.selectedIndex; // El indice del mensaje seleccionado
              var eleccion1 = selectPerro1.options[indice1].value; // Lo que dice el mensaje
              var indice2 = selectPerro2.selectedIndex; // El indice del mensaje seleccionado
              var eleccion2 = selectPerro2.options[indice2].value; // Lo que dice el mensaje
              var indice3 = selectPerro3.selectedIndex; // El indice del mensaje seleccionado
              var eleccion3 = selectPerro3.options[indice3].value; // Lo que dice el mensaje
              var indice4 = selectPerro4.selectedIndex; // El indice del mensaje seleccionado
              var eleccion4 = selectPerro4.options[indice4].value; // Lo que dice el mensaje
              var indice5 = selectPerro5.selectedIndex; // El indice del mensaje seleccionado
              var eleccion5 = selectPerro5.options[indice5].value; // Lo que dice el mensaje
              node.done();
            };

          });
        }
    });

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });

    game = setup;
    game.plot = stager.getState();
    return game;
};
