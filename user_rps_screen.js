const SDK = window.AFREECA.ext;
const extensionSdk = SDK();

const START_GAME = 'start_game';
const TIMER_BY_USER = 'timer_user';
const SELECTCARD_BY_USER = 'selectcard_user';
const END_BY_USER = 'end_user';
const TIMERSTART_BY_BJ = 'timerstart_bj';
const TIMER_BY_BJ = 'timer_bj';
const SELECTCARD_BY_BJ = 'selectcard_bj';
const END_BY_BJ = 'end_bj';
const IMG_DIRECTORY = './img/rps/';

const cntImg = document.querySelector('#cntImg');
const gamecardClasses = document.querySelectorAll('.gamecard');

let bjSelectCard = ''; // BJ가 선택한 카드
let userSelectCard = ''; // 유저가 선택한 카드
let gameResult = ''; // 게임 결과

const setDefaultDisplay = (action) => {
    const defaultClasses = document.querySelectorAll('.default');

    defaultClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setWaitDisplay = (action) => {
    const waitClasses = document.querySelectorAll('.wait');

    waitClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
    });

    gamecardClasses.forEach(function (el) {
        el.style.pointerEvents = action === 'show' ? 'auto' : 'none';
    })
}

const setCompleteDisplay = (action) => {
    const completeClasses = document.querySelectorAll('.complete');

    completeClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showHeaderResult = () => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');

    const resultImg = document.querySelector('#resultImg');
    const bjCard = document.querySelector('#bjCard');
    const bjCardImg = document.querySelector('#bjCard img');

    // 유저가 선택한 카드가 없을 때
    if (!userSelectCard) {
        gamecardClasses[0].style.display = 'none';
        gamecardClasses[1].style.display = 'none';
        gamecardClasses[2].style.src = '';
        document.querySelector('#paperCard img').remove();
        gamecardClasses[2].insertAdjacentHTML('beforeend', `<h1>X</h1>`);
    }
    // 유저가 선택한 카드가 있을 때
    else {
        gamecardClasses.forEach(function(el) {
            if(!el.classList.contains('cardselected')) {
                el.style.display = 'none';
            }
        });

        if (gameResult) {
            resultImg.src = IMG_DIRECTORY + gameResult + '.png';
        }
    }

    // BJ가 선택한 카드
    bjCard.dataset.card = bjSelectCard;
    bjCard.style.display = '';
    bjCard.classList.add('cardselected');
    bjCardImg.src = `./img/rps/${bjSelectCard}.png`;
}

const showUserList = (oResult) => {
    const resultmsg = document.querySelector('#resultmsg');
    const idarea = document.querySelector('#idarea');

    // 공통 메세지
    resultmsg.innerText = oResult.msg;

    if (oResult.winners) {
        idarea.value = oResult.winners;
        idarea.style.display = '';
    }
}

const getGameResultForUser = () => {
    let gameResult = 'draw';

    if (!userSelectCard) {
        return gameResult;
    }

    // 유저가 게임에 참여했다는 전제
    if (userSelectCard !== bjSelectCard) {
        if (userSelectCard === 'scissors') {
            gameResult = 'lose';
            if (bjSelectCard === 'paper') {
                gameResult = 'win';
            }
        } else if (userSelectCard === 'rock') {
            gameResult = 'lose';
            if (bjSelectCard === 'scissors') {
                gameResult = 'win';
            }
        } else if (userSelectCard === 'paper') {
            gameResult = 'lose';
            if (bjSelectCard === 'rock') {
                gameResult = 'win';
            }
        }
    }

    return gameResult;
}

// 게임카드 click
gamecardClasses.forEach((target) => target.addEventListener("click", function (e) {
    const cardselected = document.querySelector('.cardselected');
    // 기존 선택된거 지우기
    if (cardselected) {
        cardselected.classList.remove('cardselected');
    }

    target.classList.add('cardselected');

    userSelectCard = target.getAttribute("data-card");
    gameResult = getGameResultForUser();
    // BJ에게 승부 결과 전송
    extensionSdk.broadcast.send(SELECTCARD_BY_USER, gameResult);

}));

const handleBroadcastReceived = (action, message, fromId) => {
    // 게임 시작 액션
    if (action === START_GAME) {
        if (message == 'main') {
            window.location = './user_screen.html';
        } else if (message == 'rps') {
            window.location = './user_rps_screen.html';
        }
    }
    // 초기 타이머 액션
    else if (action === TIMERSTART_BY_BJ) {
        setWaitDisplay('show');
        setDefaultDisplay('hide');

        // BJ가 선택한 카드 저장
        bjSelectCard = message;
    }
    // 이후 타이머 액션
    else if (action === TIMER_BY_BJ) {
        if (message) {
            cntImg.src = IMG_DIRECTORY + message + '.png';
        }
        else {
            showHeaderResult();
        }
    }
    // 게임 종료 액션
    else if (action === END_BY_BJ) {

        showHeaderResult();
        showUserList(message);
    }

    // console.log('UserReceived', action, message, fromId);
}

extensionSdk.broadcast.listen(handleBroadcastReceived);