/*
 *
 * The Colour Out of Space - The Game
 * ----------------------------------
 * Juego basado en la novela corta de Howard Philips Lovecraft "The Colour Out of Space".
 * Se genera un tablero de 8x8 casillas de color verde.
 * Cada 3 segundos un número aleatorio de casillas cambia de color y crecen plantas (en las casillas permitidas). El significado de los colores:
 * Color verde: el primer estado de la tierra. No permite crecimiento de planta.
 * Color marrón claro: segundo estado de la tierra. Permite crecimiento de planta.
 * Color marrón ligeramente oscuro: tercer estado de la tierra. Permite crecimiento de planta.
 * Color amarillo. No se permite crecimiento de planta.
 * Color marrón muy oscuro: cuarto estado de la tierra. No permite crecimiento de planta.
 *
 * Objetivo del juego:
 * El jugador tiene que recolectar el mayor número de plantas antes de que todas las casillas estén en marrón oscuro.
 *
 * Puntuación del juego:
 * Por cada planta recogida se sumarán 10 puntos.
 *
 * @author Juan José Burgos Sánchez
 * @since 1.0
 */

//Título del juego
const elementoTituloJuego = document.createElement("h1"); // <h1>
const tituloJuego = document.createTextNode("The Color Out Of Space");
elementoTituloJuego.appendChild(tituloJuego);

//Contenido Principal
const contenidoPrincipal = document.createElement("div");
contenidoPrincipal.setAttribute("id", "contenidoPrincipal");

let puntuacion = 0; //Contabiliza la puntuación
let contador = 0; //Va sumando el número de casillas marrones oscuras para acabar el juego

// Array para almacenar las puntuaciones
let puntuaciones = [];

//Botón para iniciar juego
botonIniciarJuego = document.createElement("button");
botonIniciarJuegoTexto = document.createTextNode("Iniciar Juego");
botonIniciarJuego.appendChild(botonIniciarJuegoTexto);
botonIniciarJuego.setAttribute("id", "iniciarJuego");

//Botón para rendirse
botonRendirse = document.createElement("button");
botonRendirseTexto = document.createTextNode("Rendirse");
botonRendirse.appendChild(botonRendirseTexto);
botonRendirse.setAttribute("id", "rendirse");

//Fondo del juego
imagen = document.createElement("img");
imagen.setAttribute("src", "imagenes/fondo_tablero.png");
imagen.setAttribute("id", "backgroundImageGame");

// Estilos del contenedor principal
contenidoPrincipal.style.display = "flex";
contenidoPrincipal.style.justifyContent = "center";
contenidoPrincipal.style.alignContent = "center";
contenidoPrincipal.style.alignItems = "center";
contenidoPrincipal.style.flexDirection = "column";

//Estilos imagen del juego
imagen.style.width = "600px";

//Tabla que contiene el título de la caja de puntuación
aside = document.createElement("div");
aside.setAttribute("id", "aside");
elementoDivPuntuacion = document.createElement("div");
elementoDivPuntuacion.setAttribute("id", "cajaPuntuacion");
tituloPuntuacion = document.createTextNode("PUNTUACIÓN");
elementoDivPuntuacion.appendChild(tituloPuntuacion);
aside.appendChild(elementoDivPuntuacion);

//Elemento donde se guardará la puntuación durante la partida
elementoDiv = document.createElement("div");
elementoDiv.setAttribute("id", "puntuacion");
puntuacionTexto = document.createTextNode(puntuacion);
elementoDiv.appendChild(puntuacionTexto);
elementoDivPuntuacion.appendChild(elementoDiv);


// Sonido cuando recoge planta
function recogePlanta() {
  let recogePlanta = new Audio("sonidos/recoge_planta.wav");
  recogePlanta.play();
}
// Sonido cuando comienza el juego
function comienza() {
  let comienza = new Audio("sonidos/comienza.wav");
  comienza.play();
}
// Sonido cuando finaliza el juego
function acaba() {
  let acaba = new Audio("sonidos/juego_terminado.wav");
  acaba.play();
}

// Función que carga el contenido principal y añade el evento al botón iniciar
function inicializarContenidoPrincipal() {
  document.body.appendChild(elementoTituloJuego);
  document.body.appendChild(aside);
  document.body.appendChild(botonIniciarJuego);
  document.body.appendChild(botonRendirse);
  document.body.appendChild(contenidoPrincipal);
  contenidoPrincipal.appendChild(imagen);
  botonIniciarJuego.addEventListener("click", empezarJuego); // Evento iniciar juego
}

// Función para comenzar juego
function empezarJuego() {
  // Ocultamos imagen principal
  imagen.style.display = "none";

  // Inicializamos la puntuación y el contador a 0
  puntuacion = 0;
  contador = 0;

  // Suena el sonido del comienzo
  comienza();

  // Comprobamos si la tabla ya está creada
  if (document.getElementById("tablaJuego")) {
    eliminarTablaJuego();
    clearInterval(cambiarTerreno);
  }
  // Comprobamos si el juego se había terminado
  if (document.getElementById("finalJuego")) {
    document.getElementById("finalJuego").remove();
  }

  // Comprobamos si el formulario de puntuación existe, y si existe lo borramos
  if (document.getElementById("formularioPuntuacion")) {
    document.getElementById("formularioPuntuacion").remove();
  }

  // Comprobamos si la tabla de puntuaciones existe, y si existe la borramos
  if (document.getElementById("tablaPuntuaciones")) {
    document.getElementById("tablaPuntuaciones").remove();
  }

  // Añadimos los eventos al botón "rendirse"
  botonRendirse.addEventListener("click", terminarJuego);

  //Quitamos el evento al botón iniciar juego
  botonIniciarJuego.removeEventListener("click", empezarJuego);

  //Tabla del juego
  let tablaJuego = document.createElement("div");
  tablaJuego.setAttribute("id", "tablaJuego");
  contenidoPrincipal.appendChild(tablaJuego);

  // Inicializamos el id de la casilla a 0
  idCasilla = 0;

  // Estilos tabla de juego
  tablaJuego.style.display = "flex";

  pintarTabla(); //Función que genera la tabla de juego
  posicionarJugador(); // Función que posicion al jugador
  setInterval(obtenerPuntuacion, 50); // Función que va actualizando la puntuación

  document.body.addEventListener("keypress", moverJugador, false); //Mover al jugador
  cambiaTerreno = setInterval(cambiarTerreno, 3000); //Cambia el suelo cada 3 segundos
  planta = setInterval(plantar, 500);
}

// Función que genera la tabla de juego
function pintarTabla() {
  //Sprites iniciales con casilla verde
  let spriteVerde = document.createElement("img");
  spriteVerde.setAttribute("src", "sprites/casilla_verde.png");

  // Bucle para rellenar las 64 casillas
  for (let i = 0; i < 8; i++) {
    let columna = document.createElement("div");
    columna.setAttribute("id", "row");
    for (let j = 0; j < 8; j++) {
      let spriteVerde = document.createElement("img");
      spriteVerde.setAttribute("src", "sprites/casilla_verde.png");
      spriteVerde.setAttribute("id", "casilla_verde");
      spriteVerde.style.width = "70px";
      let casilla = document.createElement("div");
      casilla.setAttribute("id", idCasilla);
      casilla.setAttribute("class", "casilla");
      casilla.style.display = "flex";
      casilla.style.width = "70px";
      casilla.style.height = "70px";
      casilla.style.margin = "5px";
      casilla.appendChild(spriteVerde);
      columna.appendChild(casilla);
      tablaJuego.appendChild(columna);
      idCasilla++;
    }
  }
}

// Función para posicionar al jugador de forma aleatoria al iniciar el juego
function posicionarJugador() {

  //Genera número aleatorio para posicionar al jugador en una casilla del tablero
  numeroAleatorio = Math.floor(Math.random() * (63 - 0)) + 0;

  jugador = crearJugador();

  casilla = document.getElementsByClassName("casilla");

  for (i = 0; i < casilla.length; i++) {
    if (casilla[i].getAttribute("id") == numeroAleatorio) {
      if (document.getElementById("jugador")) {
        eliminarJugador();
      }
      casilla[i].appendChild(jugador);
    }
  }
}

// Función para eliminar jugador del tablero cuando cambia de casilla
function eliminarJugador() {
  document.getElementById("jugador").remove();
}

// Función que genera la imagen del jugador en el tablero de juego
function crearJugador() {
  let jugador = document.createElement("img");
  jugador.setAttribute("src", "sprites/worker_2.png");
  jugador.setAttribute("id", "jugador");
  jugador.style.width = "40px";
  jugador.style.height = "40px";
  jugador.style.position = "fixed";
  jugador.style.marginLeft = "20px";
  jugador.style.marginTop = "20px";
  return jugador;
}

// Función para eliminar el tablero del juego
function eliminarTablaJuego() {
  document.getElementById("tablaJuego").remove();
}

//Función para mover al jugador
function moverJugador(key) {
  let casilla = document.getElementsByClassName("casilla");
  let jugador = document.getElementById("jugador");
  let casillaID = parseInt(jugador.parentNode.getAttribute("id"));
  let planta = document.getElementById("planta");

  switch (key.keyCode) {
    //Letra A
    case 97:
      // Si la casilla donde se va a mover es válida
      if (casilla[casillaID - 8]) {
        casilla[casillaID - 8].appendChild(jugador); // Movemos al jugador
        // Si la casilla tiene planta
        if (
          casilla[casillaID - 8].childNodes[1].getAttribute("id") == "planta"
        ) {
          casilla[casillaID - 8].childNodes[1].remove(); //Eliminamos planta
          puntuacion+=10; // Sumamos puntuación
          recogePlanta(); // Generamos sonido de recogida
        }
      }
      break;
    //Letra S
    case 115:
      if (casilla[casillaID + 1] && (casillaID + 1) % 8 != 0) {
        casilla[casillaID + 1].appendChild(jugador);
        if (
          casilla[casillaID + 1].childNodes[1].getAttribute("id") == "planta"
        ) {
          casilla[casillaID + 1].childNodes[1].remove();
          puntuacion+=10;
          recogePlanta();
        }
      }
      break;
    //Letra D
    case 100:
      if (casilla[casillaID + 8]) {
        casilla[casillaID + 8].appendChild(jugador);
        if (
          casilla[casillaID + 8].childNodes[1].getAttribute("id") == "planta"
        ) {
          casilla[casillaID + 8].childNodes[1].remove();
          puntuacion+=10;
          recogePlanta();
        }
      }
      break;
    //Letra W
    case 119:
      if (casilla[casillaID - 1] && (casillaID + 8) % 8 != 0) {
        casilla[casillaID - 1].appendChild(jugador);
        if (
          casilla[casillaID - 1].childNodes[1].getAttribute("id") == "planta"
        ) {
          casilla[casillaID - 1].childNodes[1].remove();
          puntuacion+=10;
          recogePlanta();
        }
      }
      break;
  }
}

// Función para cambiar el terreno del tablero de juego
function cambiarTerreno() {
  numeroAleatorio = Math.floor(Math.random() * (64 - 0)) + 0; //Número de casillas que se van a cambiar
  let numeroAleatoriocasilla = new Array();

  for (i = 0; i < numeroAleatorio; i++) {
    numeroAleatoriocasilla[i] = Math.floor(Math.random() * (64 - 0)) + 0;
  }

  casilla = document.getElementsByClassName("casilla");

  for (i = 0; i < numeroAleatoriocasilla.length; i++) {
    let colorCasilla = casilla[
      numeroAleatoriocasilla[i]
    ].childNodes[0].getAttribute("id");
    let casillaACambiar = casilla[numeroAleatoriocasilla[i]].childNodes[0];
    let hayPlanta = casilla[numeroAleatoriocasilla[i]].childNodes[1];

    // Si la casilla es verde, pasa a marron claro
    if (colorCasilla == "casilla_verde") {
      casillaACambiar.setAttribute("src", "sprites/casilla_marron_claro.png");
      casillaACambiar.setAttribute("id", "casilla_marron_claro");
    }

    // Si la casilla es marrón claro, pasa a marrón medio
    if (colorCasilla == "casilla_marron_claro") {
      casillaACambiar.setAttribute("src", "sprites/casilla_marron_medio.png");
      casillaACambiar.setAttribute("id", "casilla_marron_medio");
    }

    // Si la casilla es marrón medio, pasa a amarillo
    if (colorCasilla == "casilla_marron_medio") {
      casillaACambiar.setAttribute("src", "sprites/casilla_amarilla.png");
      casillaACambiar.setAttribute("id", "casilla_amarilla");
      if (hayPlanta && hayPlanta.getAttribute("id") == "planta") {
        hayPlanta.remove();
      }
    }
    // Si la casilla es amarilla, pasa a marrón oscuro
    if (colorCasilla == "casilla_amarilla") {
      casillaACambiar.setAttribute("src", "sprites/casilla_marron_oscuro.png");
      casillaACambiar.setAttribute("id", "casilla_marron_oscuro");
      contador++;
    }
    if (contador == 64) {
      terminarJuego();
      break;
    }
  }
}

function plantar() {
  //Uva
  uva = document.createElement("img");
  uva.setAttribute("src", "sprites/plantas/uva.png");
  uva.setAttribute("id", "planta");
  uva.style.position = "fixed";
  uva.style.marginLeft = "25px";
  uva.style.marginTop = "25px";
  uva.style.width = "20px";

  //Berenjena
  berenjena = document.createElement("img");
  berenjena.setAttribute("src", "sprites/plantas/berenjena.png");
  berenjena.setAttribute("id", "planta");
  berenjena.style.position = "fixed";
  berenjena.style.marginLeft = "25px";
  berenjena.style.marginTop = "25px";
  berenjena.style.width = "20px";

  //Calabaza
  calabaza = document.createElement("img");
  calabaza.setAttribute("src", "sprites/plantas/calabaza.png");
  calabaza.setAttribute("id", "planta");
  calabaza.style.position = "fixed";
  calabaza.style.marginLeft = "25px";
  calabaza.style.marginTop = "25px";
  calabaza.style.width = "20px";

  //Fresa
  fresa = document.createElement("img");
  fresa.setAttribute("src", "sprites/plantas/fresa.png");
  fresa.setAttribute("id", "planta");
  fresa.style.position = "fixed";
  fresa.style.marginLeft = "25px";
  fresa.style.marginTop = "25px";
  fresa.style.width = "20px";

  //Zanahoria
  zanahoria = document.createElement("img");
  zanahoria.setAttribute("src", "sprites/plantas/zanahoria.png");
  zanahoria.setAttribute("id", "planta");
  zanahoria.style.position = "fixed";
  zanahoria.style.marginLeft = "25px";
  zanahoria.style.marginTop = "25px";
  zanahoria.style.width = "20px";

  //Array para almacenar las plantas
  plantas = new Array();
  plantas.push(uva);
  plantas.push(berenjena);
  plantas.push(calabaza);
  plantas.push(fresa);
  plantas.push(zanahoria);

  numeroAleatorioPlanta = Math.floor(Math.random() * (5 - 0)) + 0;
  numeroAleatorio = Math.floor(Math.random() * (64 - 0)) + 0; //Número de casillas que se van a cambiar
  let numeroAleatoriocasilla = new Array();

  for (i = 0; i < numeroAleatorio; i++) {
    numeroAleatoriocasilla[i] = Math.floor(Math.random() * (64 - 0)) + 0;
  }

  casilla = document.getElementsByClassName("casilla");
  for (i = 0; i < numeroAleatorio; i++) {
    let colorCasilla = casilla[
      numeroAleatoriocasilla[i]
    ].childNodes[0].getAttribute("id");
    let casillaACambiar = casilla[numeroAleatoriocasilla[i]];
    let hayPlanta = casilla[numeroAleatoriocasilla[i]].childNodes[1];
    let jugador = document.getElementById("jugador");

    if (
      (colorCasilla == "casilla_marron_claro" && !hayPlanta) ||
      (colorCasilla == "casilla_marron_medio" && !hayPlanta)
    ) {
      if (hayPlanta && hayPlanta.getAttribute("id") == "jugador") {
        casillaACambiar.insertBefore(plantas[numeroAleatorioPlanta], jugador.nextSibling);
      } else {
        casillaACambiar.appendChild(plantas[numeroAleatorioPlanta]);
      }
    }
  }
}

// Función para finalizar el juego
function terminarJuego() {
  // Sonido que indica que el juego ha terminado
  acaba();

  // Si existe el tablero, lo eliminamos
  if (document.getElementById("tablaJuego")) {
    document.getElementById("tablaJuego").remove(); // Eliminamos tablero
    // Finalizamos los intervalos que generan terreno y planta
    clearInterval(cambiaTerreno); 
    clearInterval(planta);
    //Eliminamos el evento para poder mover al jugador
    document.body.removeEventListener("keypress", moverJugador, false);
  }

  
  // Pintamos el formulario de puntuación
  formularioPuntuacion();

  // Añadimos el evento al botón enviar del formulario para que almacene la puntuación y muestre el ranking
  document
    .getElementById("enviar")
    .addEventListener("click", almacenarPuntuacion);

  // Para que no repita los mensajes, comprobamos si el elemento que muestra la frase se acabó existe, si no existe lo crea
  if (!document.getElementById("finalJuego")) {
    let finalJuego = document.createElement("div");
    finalJuego.setAttribute("id", "finalJuego");
    frase = document.createTextNode("¡SE ACABÓ!");
    finalJuego.appendChild(frase);
    contenidoPrincipal.appendChild(finalJuego);

    // Eliminamos el evento al botón rendirse
    document
      .getElementById("rendirse")
      .removeEventListener("click", terminarJuego);
  }
    // Añadimos el evento al botón iniciar juego
    botonIniciarJuego.addEventListener("click", empezarJuego);
}

// Función que actualiza la puntuación durante la partida
function obtenerPuntuacion() {
  if (document.getElementById("puntuacion")) {
    document.getElementById("puntuacion").textContent = puntuacion;
  }
}

// Función que genera el formulario para introducir el nombre para el ranking de puntuación
function formularioPuntuacion() {
  let formulario = document.createElement("div");
  formulario.setAttribute("id", "formularioPuntuacion");
  let nombre = document.createElement("input");
  nombre.setAttribute("type", "text");
  nombre.setAttribute("name", "nombre");
  nombre.setAttribute("id", "nombre");
  nombre.setAttribute("max-length", "8");
  let enviar = document.createElement("input");
  enviar.setAttribute("id", "enviar");
  enviar.setAttribute("type", "button");
  enviar.setAttribute("value", "ENVIAR");
  tituloFormulario = document.createTextNode("INTRODUCE TU NOMBRE:");
  let label = document.createElement("label");
  label.setAttribute("for", "nombre");
  label.appendChild(tituloFormulario);
  formulario.appendChild(label);
  formulario.appendChild(nombre);
  formulario.appendChild(enviar);
  contenidoPrincipal.appendChild(formulario);
}

// Función que almacena la puntuación y muestra la tabla de ranking
function almacenarPuntuacion() {
  let nombre = document.getElementById("nombre");
  let tablaPuntuaciones = document.createElement("div");
  tablaPuntuaciones.setAttribute("id", "tablaPuntuaciones");
  let elementoArray = {};
  elementoArray["JUGADOR"] = nombre.value;
  elementoArray["PUNTUACIÓN"] = puntuacion;
  puntuaciones.push(elementoArray);
  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("class", "tablaPuntuaciones");
  let tituloTablaPuntuacion = document.createTextNode(
    "RANKING DE PUNTUACIONES:"
  );
  let tituloTablaPuntuacionElemento = document.createElement("p");
  tituloTablaPuntuacionElemento.appendChild(tituloTablaPuntuacion);

  // Ordenamos el array para que aparezca el ranking por orden de puntaciones
  puntuaciones.sort(comparar);
  function comparar(a, b) {
    if (a.PUNTUACIÓN > b.PUNTUACIÓN) {
      return -1;
    }
    if (a.PUNTUACIÓN < b.PUNTUACIÓN) {
      return 1;
    }
    return 0;
  }

  // Bucle para añadir la puntuación
  for (let i = 0; i < puntuaciones.length; i++) {
    let punt = document.createElement("div");
    punt.setAttribute("id", "puntuaciones");
    containerDiv.append(punt);
    for (var p in puntuaciones[i]) {
      punt.appendChild(document.createElement("span")).textContent =
        p + ": " + puntuaciones[i][p];
    }
  }

  tablaPuntuaciones.appendChild(tituloTablaPuntuacionElemento);
  tablaPuntuaciones.appendChild(containerDiv);
  contenidoPrincipal.appendChild(tablaPuntuaciones);
  document
    .getElementById("enviar")
    .removeEventListener("click", almacenarPuntuacion);

}
// Evento para cargar el contenido inicial al cargar la ventana
window.addEventListener("load", inicializarContenidoPrincipal);
