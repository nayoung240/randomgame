const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const TIMER = 'timer';
const SELECTCARD = 'selectCard';
const END = 'end';

const selectbtn = document.querySelector('#selectbtn');
const gamecardClasses = document.querySelectorAll('.gamecard');
const resultmsg = document.querySelector('#resultmsg');
const idarea = document.querySelector('#idarea');

const scissorsCard = document.querySelector('#scissorsCard');
const rockCard = document.querySelector('#rockCard');
const paperCard = document.querySelector('#paperCard');

// UI : default -> wait -> complete
const defaultClasses = document.querySelectorAll('.default');
const waitClasses = document.querySelectorAll('.wait');
const completeClasses = document.querySelectorAll('.complete');

let userSelectCard = ''; // 유저가 선택한 카드
let isGameStart = false;
const elapsedImg = ['img1', 'img2', 'img3', 'img4', 'img5'];

const handleBroadcastReceived = (action, message, fromId) => {
    // 타이머 액션
    if(action === TIMER) {
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
    else if(action === END) {
        showResult(message);
    }

    console.log(action, message, fromId);
}

extensionSdk.broadcast.listen(handleBroadcastReceived);

const setDefaultDisplay = (action) => {
    defaultClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setWaitDisplay = (action) => {
    waitClasses.forEach(function (el) {
        el.style.display = action === 'show' ? '' : 'none';
        gamecardClasses.forEach((el) => {
            el.style.pointerEvents = action === 'show' ? 'auto' : 'none';
        })
    });
}

const setCompleteDisplay = (action) => {
    completeClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const getGameResultForUser = (bjSelectCard) => {
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

const showResult = (oResult) => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');

    gamecardClasses.forEach(function (el) {
        // BJ가 고른 카드만 보여주기
        if (el.dataset.card !== bjcard) {
            el.style.display = 'none';
        }
    });

    const gameResult = getGameResultForUser(oResult.bjcard);
    console.log('나의 승부 결과', gameResult) // TODO 상단 이미지

    // 공통 메세지
    resultmsg.innerText = oResult.msg;

    if(oResult.winners) {
        idarea.value = oResult.winners;
        idarea.style.display = '';
    }
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
    extensionSdk.broadcast.send(SELECTCARD, userSelectCard);
});