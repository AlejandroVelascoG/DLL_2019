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
        this.conteoInstrucciones = 0;
        this.idymensaje = [];
        this.countperros = 0;
        this.respuestasRonda = [];

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('bienvenida', {
        donebutton: false,
        frame: 'bienvenida.htm',
        cb: function(){
          var numUsuario = node.player.id;
          console.log('************************************');
          console.log('Número de usuario: ', numUsuario);
          console.log('************************************');
          W.setInnerHTML('numUsuario', numUsuario);
          var continuar = W.getElementById('continuar');
          continuar.onclick = function() {
            node.done();
          }
        }
    });

    stager.extendStep('instructions', {
        donebutton: false,
        frame: 'instructions.htm',
        cb: function(){
          var continuar = W.getElementById('continuar');
          continuar.onclick = function() {
            node.done();
          }
        }
    });

    stager.extendStep('tutorialTraining', {
        donebutton: false,
        frame: 'tutorial_training.htm',
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

              var key1 = claves[perros[0]];
              var key2 = claves[perros[1]];
              var key3 = claves[perros[2]];
              var key4 = claves[perros[3]];
              var key5 = claves[perros[4]];


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
      };

                  // carga las imágenes de los cinco perros

            var foto1 = 'Perro1';
            var foto2 = 'Perro2';
            var foto3 = 'Perro3';
            var foto4 = 'Perro4';
            var foto5 = 'Perro5';

            W.getElementById(foto1).src = 'carpetaTut/T1.jpg';
            W.getElementById(foto2).src = 'carpetaTut/T2.jpg';
            W.getElementById(foto3).src = 'carpetaTut/T3.jpg';
            W.getElementById(foto4).src = 'carpetaTut/T4.jpg';
            W.getElementById(foto5).src = 'carpetaTut/T5.jpg';

            for(var i =1; i<6; i++){
            	W.getElementById('opB'+i).style.display = "none";
            	W.getElementById('opD'+i).style.display = "none";
            }

            node.on('Solicitud', function(msg){
              if(msg == 'terminar'){
                revision();
                node.done();
              }
              if(msg == 'seguir'){
                W.getElementById('confirmarRonda').style.display = "none";
              }
              if(msg == 'cerrarTut1'){
                W.getElementById('Tutorial1').style.display = "none";
              }
            });

            var continuar;
            continuar = W.getElementById('continuar');
            continuar.onclick = function() {

              var choice1 = selectPerro1.selectedIndex;
              var choice2 = selectPerro2.selectedIndex;
              var choice3 = selectPerro3.selectedIndex;
              var choice4 = selectPerro4.selectedIndex;
              var choice5 = selectPerro5.selectedIndex;

              var inds = [choice1, choice2, choice3, choice4, choice5];
              var j = 0;
              for(var i = 0; i<inds.length; i++){
                if(inds[i] != 0){
                  j++;
                }
              }
              if(j == 5){
                W.setInnerHTML('inst', '¡Bien! Ahora puede presionar el botón "Confirmar" para pasar a la segunda parte del tutorial. Se abrirá un cuadro de diálogo en el que podrá confirmar si ya terminó su clasificación o si desea permanecer en la ronda.');
                W.getElementById('confirmarRonda').style.display = "block";
              }

            };

          });
        }
    });

    stager.extendStep('tutorialGame', {
        donebutton: false,
        frame: 'tutorial_game.htm',
        cb: function(){

          node.on.data('Settings', function(msg) {


            var MESSAGE = msg.data; //Datos enviados desde logic con informacion para la ronda
            var ronda = node.player.stage.round; //Ronda en curso
            var mensajeEnviado = ['A', 'B', 'C', 'D'];
            var respuestas = ['Sí', 'No'];

            var rondasTraining = node.game.settings.TRAINING;
            console.log('Oops', node.game.puntajeAcumulado);
            node.game.puntajeAcumulado[rondasTraining + ronda] = 0;
            node.game.indiceMensaje = 0;
            node.game.contadorComunicacion = 1;
            node.game.contadorMensajes = 0;
            node.game.conteoInstrucciones = 0;
            node.game.check = [];
            node.game.perrosPantalla = [];
            node.game.idymensaje = [];
            node.game.boolperros = false;
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

              var key1 = claves[perros[0]];
              var key2 = claves[perros[1]];
              var key3 = claves[perros[2]];
              var key4 = claves[perros[3]];
              var key5 = claves[perros[4]];

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
      };

                  // carga las imágenes de los cinco perros

            var foto1 = 'Perro1';
            var foto2 = 'Perro2';
            var foto3 = 'Perro3';
            var foto4 = 'Perro4';
            var foto5 = 'Perro5';

            W.getElementById(foto1).src = 'carpetaTut/T4.jpg';
            W.getElementById(foto2).src = 'carpetaTut/T7.jpg';
            W.getElementById(foto3).src = 'carpetaTut/T6.jpg';
            W.getElementById(foto4).src = 'carpetaTut/T8.jpg';
            W.getElementById(foto5).src = 'carpetaTut/T2.jpg';

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
	                if(node.game.conteoInstrucciones == 0){
                      node.game.idymensaje.push(idPerro);
                      W.setInnerHTML('inst', '¡Bien! Ahora observe que los botones en la ventana de comunicación representan categorías. Pulse alguno de ellos para preguntar a su compañero si el perro seleccionado pertenece a esa categoría.');

	                }
	                node.game.conteoInstrucciones += 1;
	                }

	                W.getElementById(idPerro).style.border = "5px solid Yellow";
	                W.getElementById('botonSolicitud').style.opacity = "0.5";
	              }
            });

            var recibida = W.getElementById('solicitudAbierta');


                            // HACER Y RESPONDER SOLICITUD

            node.on('Solicitud', function(msg){
              if (msg == 'cerrar'){
                enviar.style.display = "none";
                W.getElementById('botonSolicitud').style.opacity = "1";
                W.getElementById(idPerro).style.border = "";
              }
              if (msg == 'A'){
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                if(node.game.conteoInstrucciones == 1){
                	node.game.idymensaje.push('A');
                	W.setInnerHTML('inst', '¡Bien! Durante el juego, usted podrá enviar tantos mensajes como desee, aunque su compañero decidirá si los contesta o los ignora. ¡Inténtelo de nuevo con otro perro!');
                }
                if(node.game.conteoInstrucciones == 2){
                  W.setInnerHTML('inst', '¡Bien! En unos segundos verá la respuesta al <i>primer</i> mensaje que envió. Unos segundos más tarde, recibirá un mensaje de su compañero.<br> Despliegue el menú de mensajes y abra el mensaje que le envió su compañero.');
    	            if(node.game.idymensaje[0] == 'Perro1'){
		                  W.setInnerHTML('confirm1', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> Tiene un nuevo mensaje!');
                      node.emit('Muestra_Pop1');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'A'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro2'){
		                  W.setInnerHTML('confirm2', '<br> SI es ' + node.game.idymensaje[1]);
 		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop2');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'A'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro3'){
		                  W.setInnerHTML('confirm3', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop3');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'A'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro4'){
		                  W.setInnerHTML('confirm4', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop4');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'A'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro5'){
		                  W.setInnerHTML('confirm5', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop5');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'A'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		                }
		              }
              }
              if (msg == 'B'){
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                if(node.game.conteoInstrucciones == 1){
                	node.game.idymensaje.push('B');
                	W.setInnerHTML('inst', '¡Bien! Durante el juego, usted podrá enviar tantos mensajes como desee, aunque su compañero decidirá si los contesta o los ignora. ¡Inténtelo de nuevo con otro perro!');
                }
                if(node.game.conteoInstrucciones == 2){
                	node.game.idymensaje.push('B');
                  W.setInnerHTML('inst', '¡Bien! En unos segundos verá la respuesta al <i>primer</i> mensaje que envió. Unos segundos más tarde, recibirá un mensaje de su compañero.<br> Despliegue el menú de mensajes y abra el mensaje que le envió su compañero.');		            if(node.game.idymensaje[0] == 'Perro1'){
		                  W.setInnerHTML('confirm1', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop1');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'C'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro2'){
		                  W.setInnerHTML('confirm2', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop2');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'C'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro3'){
		                  W.setInnerHTML('confirm3', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop3');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'C'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro4'){
		                  W.setInnerHTML('confirm4', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop4');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'C'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro5'){
		                  W.setInnerHTML('confirm5', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop5');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'C'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		                }
		              }
              }
              if (msg == 'C'){
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                if(node.game.conteoInstrucciones == 1){
                	node.game.idymensaje.push('C');
                	W.setInnerHTML('inst', '¡Bien! Durante el juego, usted podrá enviar tantos mensajes como desee, aunque su compañero decidirá si los contesta o los ignora. ¡Inténtelo de nuevo con otro perro!');
                }
                if(node.game.conteoInstrucciones == 2){
                	node.game.idymensaje.push('C');
                  W.setInnerHTML('inst', '¡Bien! En unos segundos verá la respuesta al <i>primer</i> mensaje que envió. Unos segundos más tarde, recibirá un mensaje de su compañero.<br> Despliegue el menú de mensajes y abra el mensaje que le envió su compañero.');		            if(node.game.idymensaje[0] == 'Perro1'){
		                  W.setInnerHTML('confirm1', '<br> SI es ' + node.game.idymensaje[1]);
  		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                        W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop1');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'D'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro2'){
		                  W.setInnerHTML('confirm2', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop2');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'D'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro3'){
		                  W.setInnerHTML('confirm3', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop3');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'D'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro4'){
		                  W.setInnerHTML('confirm4', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop4');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'D'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro5'){
		                  W.setInnerHTML('confirm5', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop5');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'D'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		                }
		              }
              }
              if (msg == 'D'){
                enviar.style.display = "none";
                W.getElementById(idPerro).style.border = "";
                W.getElementById('botonSolicitud').style.opacity = "1";
                var num = idPerro[5];
                var aux = 'select'.concat(num);
                var choiceIndex = W.getElementById(aux).selectedIndex;
                var suposicion =  W.getElementById(aux).options[choiceIndex].value;
                if(node.game.conteoInstrucciones == 1){
                	node.game.idymensaje.push('D');
                	W.setInnerHTML('inst', '¡Bien! Durante el juego, usted podrá enviar tantos mensajes como desee, aunque su compañero decidirá si los contesta o los ignora. ¡Inténtelo de nuevo con otro perro!');
                }
                if(node.game.conteoInstrucciones == 2){
                	node.game.idymensaje.push('D');
                  W.setInnerHTML('inst', '¡Bien! En unos segundos verá la respuesta al <i>primer</i> mensaje que envió. Unos segundos más tarde, recibirá un mensaje de su compañero.<br> Despliegue el menú de mensajes y abra el mensaje que le envió su compañero.');		            if(node.game.idymensaje[0] == 'Perro1'){
		                  W.setInnerHTML('confirm1', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop1');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'B'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro2'){
		                  W.setInnerHTML('confirm2', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop2');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'B'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro3'){
		                  W.setInnerHTML('confirm3', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop3');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'B'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro4'){
		                  W.setInnerHTML('confirm4', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop4');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'B'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		              }
		              if(node.game.idymensaje[0] == 'Perro5'){
		                  W.setInnerHTML('confirm5', '<br> SI es ' + node.game.idymensaje[1]);
		                  // alert('En este momento verá una notificación con la respuesta a la primera pregunta que hizo. Preste atención al primer perro que arrastró hasta el signo de interrogación');
                      W.setInnerHTML('notif', '<br> ¡Tiene un nuevo mensaje!');
		                  node.emit('Muestra_Pop5');
                      var opt = document.createElement('option'); // Crea un item nuevo para la lista desplegable
                      opt.value = 'B'; // Objeto enviado
                      opt.text = "Mensaje 1"; // Número de mensaje
                      selectMensajes.appendChild(opt); // Introduce nuevo item en la lista desplegable
                      // selectMensajes.options[0].text = "Tiene 1 solicitudes sin leer";
		                }
		              }
              }
              if(msg == 'Correcto'){
                recibida.style.display = "none";
                W.getElementById('Perro4').style.border = "";
                W.setInnerHTML('inst', '¡Bien! Acaba de contestar el mensaje de su compañero. Presione el botón "Confirmar" para terminar este tutorial.');
                W.getElementById('confirmar').style.display = "block";
                W.getElementById('continuar').style.display = "block";
              }
              if(msg == 'Incorrecto'){
                recibida.style.display = "none";
                W.getElementById('Perro4').style.border = "";
                W.setInnerHTML('inst', '¡Bien! Acaba de contestar el mensaje de su compañero. Presione el botón "Confirmar" para terminar este tutorial.');
                W.getElementById('confirmar').style.display = "block";
                W.getElementById('continuar').style.display = "block";
              }
              if(msg == 'nose'){
                recibida.style.display = "none";
                W.getElementById('Perro4').style.border = "";
                W.setInnerHTML('inst', '¡Bien! Acaba de contestar el mensaje de su compañero. Presione el botón "Confirmar" para terminar este tutorial.');
                W.getElementById('confirmar').style.display = "block";
                W.getElementById('continuar').style.display = "block";
              }


              if(msg == 'terminar'){
                revision();
                node.done();
              }
              if(msg == 'cerrarTut2'){
                W.getElementById('Tutorial2').style.display = "none";
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

          var  swap;
          swap = function(){
            W.setInnerHTML('numSol', 'Tiene 1 mensaje');
          }

          node.on('cambio', function(msg){
            console.log('CAMBIO');
            setTimeout(swap, 6900);
          }
        );

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
              selectMensajes.options[0].text = "Tiene " + node.game.contadorMensajes + " solicitudes";
            }); // End node.on.data('Comunicacion'

                          // ABRIR SOLICITUDES

            selectMensajes.onchange = function() {
              if(partner_done == true){
                var indice = this.selectedIndex; // El indice del mensaje seleccionado
                var indiceMensaje = this.options[indice].text; // El texto con el numero de mensaje
                indiceMensaje = indiceMensaje.replace('Mensaje ', ''); // Obtengo el número
                console.log('indiceMensaje', indiceMensaje);
                var correo = 'A'; // Lo que dice el mensaje
                console.log('correo', correo);
                // idRecibido = node.game.perrosMensajes[node.game.contadorMensajesRonda-1];
                this.remove(this.selectedIndex); // Elimina item de la lista desplegable
                selectMensajes.options[0].text = "Tiene 1 mensaje";
                W.getElementById('solicitudAbierta').style.display = 'block'; // Abre ventana de responder
                W.setInnerHTML('inst', 'Acaba de abrir un mensaje de su compañero. Responda si cree que el perro señalado pertenece o no a la categoría A.');
                W.setInnerHTML('numSol', 'Tiene 0 mensajes');
                W.setInnerHTML('Solicitud', correo); // Muestra lo que dice el mensaje
                // console.log('CONTADOR RONDA: ', node.game.contadorMensajesRonda);
                W.getElementById('Perro4').style.border = "5px solid Yellow";
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
                } else {
                  W.setInnerHTML('confirm1', '<br> NO es ');
                  node.emit('Muestra_Pop1');
                }
              }
              if(msg.data[1] == 'Perro2'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm2', '<br> SI es ');
                  node.emit('Muestra_Pop2');
                } else {
                  W.setInnerHTML('confirm2', '<br> NO es ');
                  node.emit('Muestra_Pop2');
                }
              }
              if(msg.data[1] == 'Perro3'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm3', '<br> SI es ');
                  node.emit('Muestra_Pop3');
                } else {
                  W.setInnerHTML('confirm3', '<br> NO es ');
                  node.emit('Muestra_Pop3');
                }
              }
              if(msg.data[1] == 'Perro4'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm4', '<br> SI es ');
                  node.emit('Muestra_Pop4');
                } else {
                  W.setInnerHTML('confirm4', '<br> NO es ');
                  node.emit('Muestra_Pop4');
                }
              }
              if(msg.data[1] == 'Perro5'){
                if(msg.data[0] == 'Correcto'){
                  W.setInnerHTML('confirm5', '<br> SI es ');
                  node.emit('Muestra_Pop5');
                } else {
                  W.setInnerHTML('confirm5', '<br> NO es ');
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

    stager.extendStep('puntaje_training', {
      frame: 'puntaje_training.htm',
      cb: function(){

		  var foto1 = 'Perro1';
	    var foto2 = 'Perro2';
	    var foto3 = 'Perro3';
	    var foto4 = 'Perro4';
	    var foto5 = 'Perro5';

	    W.getElementById(foto1).src = 'carpetaTut/T1.jpg';
	    W.getElementById(foto2).src = 'carpetaTut/T2.jpg';
	    W.getElementById(foto3).src = 'carpetaTut/T3.jpg';
	    W.getElementById(foto4).src = 'carpetaTut/T4.jpg';
	    W.getElementById(foto5).src = 'carpetaTut/T5.jpg';

      W.getElementById('select1').options[0].innerHTML = node.game.respuestasRonda[0];
      W.getElementById('select2').options[0].innerHTML = node.game.respuestasRonda[1];
      W.getElementById('select3').options[0].innerHTML = node.game.respuestasRonda[2];
      W.getElementById('select4').options[0].innerHTML = node.game.respuestasRonda[3];
      W.getElementById('select5').options[0].innerHTML = node.game.respuestasRonda[4];

      var listo = W.getElementById('listo');
      listo.onclick = function() {
        W.getElementById('aviso1').style.display = "none";
      };

        var continuar = W.getElementById('continuar');
        continuar.onclick = function() {
          node.done();
        };
      }
    });

    stager.extendStep('puntaje_game', {
      frame: 'puntaje_game.htm',
      cb: function(){
            var foto1 = 'Perro1';
            var foto2 = 'Perro2';
            var foto3 = 'Perro3';
            var foto4 = 'Perro4';
            var foto5 = 'Perro5';

            W.getElementById(foto1).src = 'carpetaTut/T4.jpg';
            W.getElementById(foto2).src = 'carpetaTut/T7.jpg';
            W.getElementById(foto3).src = 'carpetaTut/T6.jpg';
            W.getElementById(foto4).src = 'carpetaTut/T8.jpg';
            W.getElementById(foto5).src = 'carpetaTut/T2.jpg';

            W.getElementById('select1').options[0].innerHTML = node.game.respuestasRonda[0];
            W.getElementById('select2').options[0].innerHTML = node.game.respuestasRonda[1];
            W.getElementById('select3').options[0].innerHTML = node.game.respuestasRonda[2];
            W.getElementById('select4').options[0].innerHTML = node.game.respuestasRonda[3];
            W.getElementById('select5').options[0].innerHTML = node.game.respuestasRonda[4];


        var listo = W.getElementById('listo');
        listo.onclick = function() {
          W.getElementById('aviso1').style.display = "none";
        };

        var continuar = W.getElementById('continuar');
        continuar.onclick = function() {
          node.done();
        };
      }
    });

    stager.extendStep('tiempo', {
    donebutton: false,
    frame: 'tiempo.htm',
    cb: function(){
      var continuar = W.getElementById('continuar');
      continuar.onclick = function() {
        node.done();
      }
    }
    });

    stager.extendStep('recompensa', {
    donebutton: false,
    frame: 'recompensa.htm',
    cb: function(){
      var continuar = W.getElementById('continuar');
      continuar.onclick = function() {
        node.done();
      }
    }
    });

    stager.extendStep('quiz', {
      donebutton: false,
      frame: 'quiz.htm',
      done: function() {
            node.say('quiz-over');
        },
      cb: function() {
          var button, QUIZ;

          QUIZ = W.getFrameWindow().QUIZ;
          button = W.getElementById('submitQuiz');

          node.on('check-quiz', function() {
              var answers;
              answers = QUIZ.checkAnswers(button);
              if (answers.correct || node.game.visualTimer.isTimeup()) {
                  node.emit('INPUT_DISABLE');
                  // On Timeup there are no answers.
                  // node.done(answers);
                  node.done();
              }
          });
          console.log('Quiz');
          }
    });

    game = setup;
    game.plot = stager.getState();
    return game;
};
