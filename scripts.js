window.onload = function () {
    let nombres = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let mainContenedorCartas = document.createElement('div');
    let puntuacion = 0;
    let intentos = 0;
    let mainContenedorInfo = null;
    let audio = new Audio('img/mp3.mp3');
    mainContenedorCartas.classList.add("mainContenedorCartas");

    let puntuacionTexto, intentosTexto;


    function crearBarrasInfo() {
        if (!mainContenedorInfo) {
            let blank1 = document.createElement('div');
            blank1.classList.add('blank1');

            mainContenedorInfo = document.createElement('div');
            mainContenedorInfo.classList.add('mainContenedorInfo');

            
            
            let puntuacionImg = document.createElement('img');
            puntuacionImg.src = 'img/scoreIcon.png';
            puntuacionImg.alt = 'Puntuación';
            puntuacionImg.classList.add('puntuacionIcono');
            puntuacionImg.style.userSelect = "none";
            puntuacionImg.draggable = false;

            let intentosImg = document.createElement('img');
            intentosImg.src = 'img/attemptsIcon.png';
            intentosImg.alt = 'Intentos';
            intentosImg.classList.add('intentosIcono');
            intentosImg.style.userSelect = "none";
            intentosImg.draggable = false;

            puntuacionTexto = document.createElement('span');
            intentosTexto = document.createElement('span');
            
            puntuacionTexto.textContent = '0';
            intentosTexto.textContent = '0';
            
            let contenedorInfo = document.createElement('div');
            contenedorInfo.classList.add('contenedorInfo');
            contenedorInfo.style.userSelect = "none";

            let resetBoton = document.createElement('div');
            resetBoton.classList.add('resetBoton');
            resetBoton.style.userSelect = "none";

            resetBoton.style.userSelect = "none";
            resetBoton.style.cursor = "pointer";

            resetBoton.textContent = "Reset";

            resetBoton.onclick = function() {
                window.location.reload();
            };

            contenedorInfo.appendChild(puntuacionTexto);
            contenedorInfo.appendChild(puntuacionImg);
            contenedorInfo.appendChild(document.createTextNode('   '));
            contenedorInfo.appendChild(intentosTexto);
            contenedorInfo.appendChild(intentosImg);
            

            
            mainContenedorInfo.appendChild(contenedorInfo);
            mainContenedorInfo.appendChild(resetBoton);
            
            
            document.body.appendChild(blank1);
            
        }
    }
    
    crearBarrasInfo();

    function actualizarInfo(hayCoincidencia) {
        if (hayCoincidencia) {
            puntuacion += 10;
        } else {
            puntuacion -= 2;
            puntuacion = Math.max(0, puntuacion);
        }
        intentos++;
        puntuacionTexto.textContent = puntuacion;
        intentosTexto.textContent = intentos;
    }

    function buscarCoincidencia() {
        if (cartasVolteadas[0].dataset.cartaNombre === cartasVolteadas[1].dataset.cartaNombre) {
            cartasVolteadas.forEach(carta => {
                carta.classList.add('coincidencia');
                const overlay = carta.querySelector('.overlay');
                overlay.classList.add('activa');
            });
            actualizarInfo(true);
            resetearVolteo();

            if (document.querySelectorAll('.coincidencia').length === nombres.length * 2) {
                enseñarAnimacionVictoria();
                localStorage.removeItem('puntuación');
                localStorage.removeItem('puntuación');
                localStorage.setItem('puntuación',puntuacionTexto.textContent);
                localStorage.setItem('intentos',intentosTexto.textContent);
            }
        } else {
            setTimeout(() => {
                cartasVolteadas.forEach(carta => {
                    carta.classList.remove('volteada');
                    const overlay = carta.querySelector('.overlay');
                    overlay.classList.remove('activa');
                });
                actualizarInfo(false);
                resetearVolteo();
            }, 1000);
        }
    }
    
    function enseñarAnimacionVictoria() {
        let fotogramaIndex = 0;
        const fotogramasTotales = 675;
        let animacionContendor = document.createElement('div');
        animacionContendor.style.position = 'fixed';
        animacionContendor.style.top = '0';
        animacionContendor.style.left = '0';
        animacionContendor.style.width = '100vw';
        animacionContendor.style.height = '100vh';
        animacionContendor.style.display = 'flex';
        animacionContendor.style.alignItems = 'center';
        animacionContendor.style.justifyContent = 'center';
        animacionContendor.style.zIndex = '10000';
        animacionContendor.style.overflow = 'hidden';

        let animacionImg = document.createElement('img');
        animacionImg.draggable = false;
        animacionImg.onmousedown = () => false;
        animacionContendor.appendChild(animacionImg);
        document.body.appendChild(animacionContendor);

        audio.play();

        const actualizarFotograma = () => {
            if (fotogramaIndex < fotogramasTotales) {
                let fotogramaActual = fotogramaIndex.toString().padStart(5, '0');
                animacionImg.src = `img/secuencia/win_${fotogramaActual}.png`;
                fotogramaIndex++;
            } else {
                clearInterval(fotogramaIntervalo);
                document.body.removeChild(animacionContendor);
            }
        };

        let fotogramaIntervalo = setInterval(actualizarFotograma, 15);
    }

    function barajarCartas(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let fullCartas = [...nombres, ...nombres];
    //Comentar la linea de abajo para desactivar la aleatoriedad de las cartas
    barajarCartas(fullCartas);

    function crearCartas(src) {
        let carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.cartaNombre = src;
    
        let imgBack = document.createElement('img');
        imgBack.src = 'img/back.png';
        imgBack.classList.add('back');
        imgBack.draggable = false;
        imgBack.style.userSelect = "none";
    
        let imgFront = document.createElement('img');
        imgFront.src = `img/${src}.png`;
        imgFront.classList.add('front');
        imgFront.draggable = false;
        imgFront.style.userSelect = "none";
    
        let overlay = document.createElement('div');
        overlay.classList.add('overlay', 'marker');
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0)';
        overlay.style.pointerEvents = 'none';
        overlay.draggable = false;
        overlay.style.userSelect = "none";
        
        carta.appendChild(imgBack);
        carta.appendChild(imgFront);
        carta.appendChild(overlay);
    
        carta.onclick = function() {
            if (espera || carta.classList.contains('volteada') || carta.classList.contains('coincidencia')) return;
            carta.classList.add('volteada');
            cartasVolteadas.push(carta);
        
            if (cartasVolteadas.length === 2) {
                espera = true;
                buscarCoincidencia();
            }
        };
    
        return carta;
    }

    function añadirImagenesMainContainer(container, imgNombre) {
        imgNombre.forEach(nombre => {
            container.appendChild(crearCartas(nombre));
        });
    }

    let cartasVolteadas = [];
    let espera = false;

    function resetearVolteo() {

        cartasVolteadas.forEach(carta => {
            if (!carta.classList.contains('coincidencia')) {
                carta.classList.remove('volteada');
            }
        });
        cartasVolteadas = [];
        espera = false;
    }

    let container1 = document.createElement('div');
    container1.classList.add("container");
    añadirImagenesMainContainer(container1, fullCartas.slice(0, 8));

    let container2 = document.createElement('div');
    container2.classList.add("container");
    añadirImagenesMainContainer(container2, fullCartas.slice(8));

    mainContenedorCartas.appendChild(container1);
    mainContenedorCartas.appendChild(container2);
    
    document.body.appendChild(mainContenedorCartas);

    document.body.appendChild(mainContenedorInfo);

    if(localStorage.getItem('puntuación') !== null || localStorage.getItem('puntuación') !== 0 ){
        let puntuacionImg2 = document.createElement('img');
        puntuacionImg2.src = 'img/scoreIcon.png';
        puntuacionImg2.alt = 'Puntuación';
        puntuacionImg2.classList.add('puntuacionIcono2');
        puntuacionImg2.style.userSelect = "none";
        puntuacionImg2.draggable = false;

        let intentosImg2 = document.createElement('img');
        intentosImg2.src = 'img/attemptsIcon.png';
        intentosImg2.alt = 'Intentos';
        intentosImg2.classList.add('intentosIcono2');
        intentosImg2.style.userSelect = "none";
        intentosImg2.draggable = false;

        puntuacionTexto2 = document.createElement('span');
        intentosTexto2 = document.createElement('span');
        
        

        let blank2 = document.createElement('div');
        blank2.classList.add('blank2');
        blank2.style.userSelect = "none";


        let contenedorInfo2 = document.createElement('div');
        contenedorInfo2.classList.add('contenedorInfo2');
        contenedorInfo2.style.userSelect = "none";
        puntuacionTexto2.textContent = localStorage.getItem('puntuación');
        intentosTexto2.textContent = localStorage.getItem('intentos');

        let ultimaPartidaContenedor = document.createElement('div');
        ultimaPartidaContenedor.classList.add('ultimaPartidaContenedor');
        ultimaPartidaContenedor.style.userSelect = "none";

        let ultimaPartidaTexto = document.createElement('div');
        ultimaPartidaTexto.textContent = "Last match";
        ultimaPartidaTexto.classList.add('ultimaPartidaTexto');
        ultimaPartidaTexto.style.userSelect = "none";
        

        
        let ultimaPartidaInfo = document.createElement('div');
        ultimaPartidaInfo.classList.add('ultimaPartidaInfo');
        ultimaPartidaInfo.style.userSelect = "none";

        ultimaPartidaInfo.appendChild(puntuacionTexto2);
        ultimaPartidaInfo.appendChild(puntuacionImg2);
        ultimaPartidaInfo.appendChild(document.createTextNode('   '));
        ultimaPartidaInfo.appendChild(intentosTexto2);
        ultimaPartidaInfo.appendChild(intentosImg2);

        contenedorInfo2.appendChild(ultimaPartidaTexto);
        contenedorInfo2.appendChild(ultimaPartidaInfo);

        mainContenedorInfo2 = document.createElement('div');
        mainContenedorInfo2.classList.add('mainContenedorInfo2');

        mainContenedorInfo2.appendChild(contenedorInfo2);
        mainContenedorInfo2.appendChild(blank2);
        document.body.appendChild(mainContenedorInfo2);
    }
    
};