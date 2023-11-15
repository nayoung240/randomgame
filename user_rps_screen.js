const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const TIMER_BY_USER = 'timer_user';
const SELECTCARD_BY_USER = 'selectcard_user';
const END_BY_USER = 'end_user';
const TIMER_BY_BJ = 'timer_bj';
const SELECTCARD_BY_BJ = 'selectcard_bj';
const END_BY_BJ = 'end_bj';
const WIN_IMAGE = 'thumb-up.png';
const LOSE_IMAGE = 'thumb-down.png';
const DRAW_IMAGE = 'draw.png';
const IMG_DIRECTORY = './img/';

const selectbtn = document.querySelector('#selectbtn');
const gamecardClasses = document.querySelectorAll('.gamecard');
const resultmsg = document.querySelector('#resultmsg');
const resultImg = document.querySelector('#resultImg');
const idarea = document.querySelector('#idarea');

// UI : default -> wait -> complete
const defaultClasses = document.querySelectorAll('.default');
const waitClasses = document.querySelectorAll('.wait');
const completeClasses = document.querySelectorAll('.complete');

let userSelectCard = ''; // 유저가 선택한 카드
let isGameStart = false;
const elapsedImg = ['img1', 'img2', 'img3', 'img4', 'img5'];

const setDefaultDisplay = (action) => {
    defaultClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setWaitDisplay = (action) => {
    waitClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
    });

    gamecardClasses.forEach(function(el) {
        el.style.pointerEvents = action === 'show' ? 'auto' : 'none';
    })
}

const setCompleteDisplay = (action) => {
    completeClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showBjResult = (oResult) => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');

    console.log('show',oResult);

    gamecardClasses.forEach(function (el) {
        // BJ가 고른 카드만 보여주기
        if (el.dataset.card !== oResult.bjcard) {
            el.style.display = 'none';
        }
    });

    const gameResultImg = getGameResultForUser(oResult.bjcard);
    console.log('나의 승부 결과', gameResult);
    resultImg.src = IMG_DIRECTORY + gameResultImg;

    // 공통 메세지
    resultmsg.innerText = oResult.msg;

    if(oResult.winners) {
        idarea.value = oResult.winners;
        idarea.style.display = '';
    }
}

const handleBroadcastReceived = (action, message, fromId) => {
    // 타이머 액션
    if(action === TIMER_BY_BJ) {
        // 초기에 한번만
        if(!isGameStart) {
            setWaitDisplay('show');
            setDefaultDisplay('hide');
            isGameStart = true;
        }

        if(elapsedImg.length > 0) {
            console.log(elapsedImg.pop());    // 카운트 이미지 출력
        }
    }
    // 게임 종료 액션
    else if(action === END_BY_BJ) {
        console.log('end가 들어오니')
        showBjResult(message);
    }

    console.log('UserReceived', action, message, fromId);
}

extensionSdk.broadcast.listen(handleBroadcastReceived);

const getGameResultForUser = (bjSelectCard) => {
    let gameResult = DRAW_IMAGE;

    // 유저가 게임에 참여했다는 전제
    if (userSelectCard && (userSelectCard !== bjSelectCard)) {
        if (userSelectCard === 'scissors') {
            gameResult = LOSE_IMAGE;
            if (bjSelectCard === 'paper') {
                gameResult = WIN_IMAGE;
            }
        } else if (userSelectCard === 'rock') {
            gameResult = LOSE_IMAGE;
            if (bjSelectCard === 'scissors') {
                gameResult = WIN_IMAGE;
            }
        } else if (userSelectCard === 'paper') {
            gameResult = LOSE_IMAGE;
            if (bjSelectCard === 'rock') {
                gameResult = WIN_IMAGE;
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
}));

// 선택하기 click
selectbtn.addEventListener('click', function () {
    const cardselected = document.querySelector('.cardselected');

    // 선택한 카드가 없을 때
    if(!cardselected) {
        const toastElList = document.querySelectorAll('.toast');
        const toastBody = document.querySelector('.toast-body');
        const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl));

        toastList.forEach(toast => {
            toastBody.innerText = '카드를 선택해야 합니다!';
            toast.show();
        }) 

        return; // 종료
    }

    userSelectCard = cardselected.dataset.card;
    console.log('select',userSelectCard);

    // BJ에게 선택한 카드 전송
    extensionSdk.broadcast.send(SELECTCARD_BY_USER, userSelectCard);
});