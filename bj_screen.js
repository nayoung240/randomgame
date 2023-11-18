const SDK = window.AFREECA.ext;
const extensionSdk = SDK();

const START_GAME = 'start_game';

const rpslogo = document.querySelector('#rpslogo');
const whlogo = document.querySelector('#whlogo');
const ladderlogo = document.querySelector('#ladderlogo');
const bricklogo = document.querySelector('#bricklogo');
const backbtn = document.querySelector('#backbtn');

extensionSdk.broadcast.send(START_GAME, 'main');

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

const setBrickDisplay = (action) => {
    const brickClasses = document.querySelectorAll('.brick');

    brickClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showGuide = (guide) => {
    let defaultDisplay = 'hide';
    let rpsDisplay = 'hide';
    let whDisplay = 'hide';
    let ladderDisplay = 'hide';
    let brickDisplay = 'hide';

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
        case 'brick':
            brickDisplay = 'show';
            break;
        default:
            defaultDisplay = 'show';
            break;
    }

    setDefaultDisplay(defaultDisplay);
    setRpsDisplay(rpsDisplay);
    set5w1hDisplay(whDisplay);
    setLadderDisplay(ladderDisplay);
    setBrickDisplay(brickDisplay);
    

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

//벽돌깨기 안내
bricklogo.addEventListener('click', function() {
    showGuide('brick');
});

// 뒤로가기 버튼
backbtn.addEventListener('click', function() {
    location.reload();
});