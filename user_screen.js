const SDK = window.AFREECA.ext;
const extensionSdk = SDK();

const START_GAME = 'start_game';

const rpslogo = document.querySelector('#rpslogo');
const whlogo = document.querySelector('#whlogo');
const ladderlogo = document.querySelector('#ladderlogo');
const roulettelogo = document.querySelector('#roulettelogo');
const backbtn = document.querySelector('#backbtn');

const handleBroadcastReceived = (action, message, fromId) => {
    // 게임 시작 액션
    if(action === START_GAME) {
        if(message == 'main') {
            window.location = './user_screen.html';
        }
        else if(message == 'rps') {
            window.location = './user_rps_screen.html';
        }
    }
}

extensionSdk.broadcast.listen(handleBroadcastReceived);

const setDefaultDisplay = (action) => {
    const defaultClasses = document.querySelectorAll('.default');

    defaultClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setRpsDisplay = (action) => {
    const rpsClasses = document.querySelectorAll('.rps');

    rpsClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const set5w1hDisplay = (action) => {
    const whClasses = document.querySelectorAll('.wh');

    whClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setLadderDisplay = (action) => {
    const ladderClasses = document.querySelectorAll('.ladder');

    ladderClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setRouletteDisplay = (action) => {
    const rouletteClasses = document.querySelectorAll('.roulette');

    rouletteClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showGuide = (guide) => {
    let defaultDisplay = 'hide';
    let rpsDisplay = 'hide';
    let whDisplay = 'hide';
    let ladderDisplay = 'hide';
    let rouletteDisplay = 'hide';

    switch (guide) {
        case 'rps':
            rpsDisplay = 'show';
            break;
        case 'wh':
            whDisplay = 'show';
            break;
        case 'ladder':
            ladderDisplay = 'show';
            break;
        case 'roulette':
            rouletteDisplay = 'show';
            break;
        default:
            defaultDisplay = 'show';
            break;
    }

    setDefaultDisplay(defaultDisplay);
    setRpsDisplay(rpsDisplay);
    set5w1hDisplay(whDisplay);
    setLadderDisplay(ladderDisplay);
    setRouletteDisplay(rouletteDisplay);

    backbtn.style.display = '';
}

// 안내면진다 안내
rpslogo.addEventListener('click', function() {
    showGuide('rps');
});

// 6하원칙 안내
whlogo.addEventListener('click', function() {
    showGuide('wh');
});

// 사다리 안내
ladderlogo.addEventListener('click', function() {
    showGuide('ladder');
});

// 룰렛게임 안내
roulettelogo.addEventListener('click', function() {
    showGuide('roulette');
});

// 뒤로가기 버튼
backbtn.addEventListener('click', function() {
    location.reload();
});