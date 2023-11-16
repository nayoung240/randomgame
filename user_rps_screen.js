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

const selectbtn = document.querySelector('#selectbtn');
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

    gamecardClasses.forEach(function(el) {
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

    gamecardClasses.forEach(function (el) {
        // BJ가 고른 카드만 보여주기
        if (el.dataset.card == bjSelectCard) {
            el.classList.add('cardselected');
        }
        else {
            el.style.display = 'none';
        }
    });

    if(gameResult) {
        resultImg.src = IMG_DIRECTORY + gameResult + '.png';
    }
}

const showUserList = (oResult) => {
    console.log('show',oResult);

    const resultmsg = document.querySelector('#resultmsg');
    const idarea = document.querySelector('#idarea');

    // 공통 메세지
    resultmsg.innerText = oResult.msg;

    if(oResult.winners) {
        idarea.value = oResult.winners;
        idarea.style.display = '';
    }
}

const getGameResultForUser = () => {
    let gameResult = 'draw';

    // 유저가 게임에 참여했다는 전제
    if (userSelectCard && (userSelectCard !== bjSelectCard)) {
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
    // 선택하기 완료한 경우
    if(selectbtn.classList.contains('disabled')) {
        return;
    }

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

    gameResult = getGameResultForUser();
    console.log('나의 승부 결과', gameResult);

    // BJ에게 승부 결과 전송
    extensionSdk.broadcast.send(SELECTCARD_BY_USER, gameResult);

    // 선택하기 비활성화
    selectbtn.classList.add('disabled');
});

const handleBroadcastReceived = (action, message, fromId) => {
    // 게임 시작 액션
    if(action === START_GAME) {
        if(message == 'main') {
            window.location = 'user_screen.html';
        }
        else if(message == 'rps') {
            window.location = 'user_rps_screen.html';
        }
    }
    // 초기 타이머 액션
    else if(action === TIMERSTART_BY_BJ) {
        setWaitDisplay('show');
        setDefaultDisplay('hide');

        // BJ가 선택한 카드 저장
        bjSelectCard = message;
    }
    // 이후 타이머 액션
    else if(action === TIMER_BY_BJ) {
        if(message) {
            cntImg.src = IMG_DIRECTORY + message + '.png';
        }
        else {
            showHeaderResult();
        }
    }
    // 게임 종료 액션
    else if(action === END_BY_BJ) {
        console.log('end가 들어오니')
        showHeaderResult();
        showUserList(message);
    }

    console.log('UserReceived', action, message, fromId);
}

extensionSdk.broadcast.listen(handleBroadcastReceived);