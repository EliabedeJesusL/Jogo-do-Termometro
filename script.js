let level = 1;
let points = 0;
let timeLeft = 120; // Tempo inicial em segundos (2 minutos)
let targetTemperature = 0;
let targetScale = 'Celsius';
let interval;
let consecutivePerfects = 0; // Contador para acertos consecutivos

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startTimer() {
    clearInterval(interval); // Garante que qualquer intervalo anterior seja limpo
    interval = setInterval(function () {
        timeLeft--;
        document.getElementById('timeLeft').textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(interval);
            showFinalScreen(); // Mostrar tela final quando o tempo acabar
        }
    }, 1000); // Configura para executar a cada 1000ms (1 segundo)
}

function setTargetTemperature() {
    const scale = Math.random() > 0.5 ? 'Kelvin' : 'Fahrenheit';
    if (scale === 'Kelvin') {
        targetTemperature = Math.floor(Math.random() * 101) + 273;
    } else {
        targetTemperature = Math.floor(Math.random() * 181) + 32;
    }
    targetScale = scale;
    document.getElementById('target-temperature').textContent = targetTemperature;
    document.getElementById('target-scale').textContent = `(${targetScale})`;
}

function convertToCelsius(temp, scale) {
    let celsiusTemp;
    if (scale === 'Kelvin') {
        celsiusTemp = temp - 273.15;
    } else if (scale === 'Fahrenheit') {
        celsiusTemp = (temp - 32) * 5 / 9;
    }
    return Math.round(celsiusTemp); // Arredondar para o inteiro mais próximo
}

function updateTemperatureBar() {
    const temp = parseFloat(document.getElementById('tempInput').value);
    const percentage = Math.min(Math.max((temp + 273) / 373 * 100, 0), 100); // De -273°C a 100°C, limitando a 100%
    document.getElementById('fill-bar').style.height = `${percentage}%`;
}

function verifyTemperature() {
    const userTemp = parseFloat(document.getElementById('tempInput').value);
    const correctTemp = convertToCelsius(targetTemperature, targetScale);
    const errorMargin = Math.abs(userTemp - correctTemp);

    if (errorMargin === 0) {
        points += 10; // Acerto exato
        consecutivePerfects++; // Incrementa o contador de acertos consecutivos
    } else if (errorMargin <= 5) {
        points += 5; // Erro dentro de 5 graus
        consecutivePerfects = 0; // Reseta o contador de acertos consecutivos
    } else if (errorMargin <= 10) {
        points += 2; // Erro dentro de 10 graus
        consecutivePerfects = 0; // Reseta o contador de acertos consecutivos
    } else {
        points -= 5; // Erro maior que 10 graus
        consecutivePerfects = 0; // Reseta o contador de acertos consecutivos
    }

    // Aplicar bônus por 3 acertos consecutivos
    if (consecutivePerfects === 3) {
        points += 20; // Bônus adicional
        consecutivePerfects = 0; // Reseta o contador após aplicar o bônus
    }

    document.getElementById('points').textContent = points;

    // Avança automaticamente para a próxima fase
    nextLevel();
}

function nextLevel() {
    level++;
    document.getElementById('level').textContent = level;
    setTargetTemperature();
}

function resetGame() {
    level = 1;
    points = 0;
    timeLeft = 120; // Reinicia para 2 minutos
    consecutivePerfects = 0; // Reseta o contador de acertos consecutivos
    document.getElementById('level').textContent = level;
    document.getElementById('points').textContent = points;
    document.getElementById('timeLeft').textContent = formatTime(timeLeft);
    document.querySelector('.content-wrapper').style.display = 'block'; // Mostra o conteúdo principal
    document.querySelector('.thermometer').style.display = 'block'; // Mostra a imagem do termômetro
    document.querySelector('.final-screen').style.display = 'none'; // Oculta a tela de finalização
    document.getElementById('main-container').style.opacity = '1'; // Torna o quadrado branco visível novamente
    setTargetTemperature();
    startTimer();
}

function showFinalScreen() {
    document.getElementById('main-container').style.opacity = '0'; // Torna o quadrado branco invisível
    document.querySelector('.final-screen').style.display = 'flex'; // Exibe a tela final
    document.getElementById('final-score').textContent = `Pontuação Final: ${points}`; // Atualiza a pontuação final
}

// Adiciona evento ao botão "Jogar Novamente"
document.getElementById('resetButton').addEventListener('click', function() {
    resetGame();
});

document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
    resetGame(); // Inicia o jogo corretamente
});

function goToHome() {
    // Oculta a tela final e mostra a tela inicial
    document.querySelector('.final-screen').style.display = 'none';
    document.getElementById('initial-screen').style.display = 'flex';

    // Reseta o jogo para o estado inicial
    level = 1;
    points = 0;
    timeLeft = 120; // Ajusta o tempo restante para 2 minutos
    document.getElementById('level').textContent = level;
    document.getElementById('points').textContent = points;
    document.getElementById('timeLeft').textContent = formatTime(timeLeft);
    document.getElementById('main-container').style.display = 'none'; // Oculta a tela de jogo
    clearInterval(interval); // Para qualquer cronômetro em execução
}
