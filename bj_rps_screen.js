const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const TIMER_BY_USER = 'timer_user';
const SELECTCARD_BY_USER = 'selectcard_user';
const END_BY_USER = 'end_user';
const TIMER_BY_BJ = 'timer_bj';
const SELECTCARD_BY_BJ = 'selectcard_bj';
const END_BY_BJ = 'end_bj';

let bjSelectCard = ''; // BJ가 선택한 카드

const selectbtn = document.querySelector('#selectbtn');
const gamecardClasses = document.querySelectorAll('.gamecard');
const resultmsg = document.querySelector('#resultmsg');
const idarea = document.querySelector('#idarea');

// UI : default -> wait -> complete
const defaultClasses = document.querySelectorAll('.default');
const waitClasses = document.querySelectorAll('.wait');
const completeClasses = document.querySelectorAll('.complete');

const setDefaultDisplay = (action) => {
    defaultClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setWaitDisplay = (action) => {
    waitClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setCompleteDisplay = (action) => {
    completeClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showResult = (allCnt, winCnt, winnerList) => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');
    
    let oResult = {
        bjcard : bjSelectCard, // Bj가 선택한 카드
        msg : 'BJ가 모두를 이겼습니다!',
        winners : ''
    };

    if(winCnt > 0) {
        oResult.msg = `${allCnt}명중에 ${winCnt}명이 BJ를 이겼습니다!`;
        oResult.winners = '<< 이긴 유저 >>\n'+winnerList.join('\n');

        idarea.value = oResult.winners;
        idarea.style.display = '';
    }

    // 모든 유저에게 공통적인 게임결과 전송
    extensionSdk.broadcast.send(END_BY_BJ, oResult);

    resultmsg.innerText = oResult.msg;

    console.log('showResult',allCnt, winCnt, winnerList)
}

const getGameResultForUser = (userSelectCard) => {
    let gameResult = 'draw';

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

const extensionCall = () => {
    let timerCount = 5;

    // 모든 유저에게 타이머 전송
    extensionSdk.broadcast.send(TIMER_BY_BJ, timerCount);

    let winnerList = [];
    let allCnt = 0;
    let winCnt = 0;

    const handleBroadcastReceived = (action, message, fromId) => {
        // 카드 선택 액션
        if(action === SELECTCARD_BY_USER) {
            // 유저랑 BJ의 가위바위보 비교
            const userResult = getGameResultForUser(message);

            // 이겼으면 추가
            if(userResult == 'win') {
                winnerList.push(fromId);
                winCnt += 1;
            }

            allCnt += 1;
        }

        console.log('BjReceived', action, message, fromId);
    }

    extensionSdk.broadcast.listen(handleBroadcastReceived);

    const setIntervaltimer = setInterval(function () {
        timerCount -= 1;
        console.log('setIntervaltimer')

        // 모든 유저에게 타이머 전송
        extensionSdk.broadcast.send(TIMER_BY_BJ, timerCount);
    }, 1000); // 1초마다 실행

    // 5초 후에 interval 중단하고 함수 호출
    setTimeout(function() {
        clearInterval(setIntervaltimer);
        showResult(allCnt, winCnt, winnerList);
    }, 5000);
}

// 게임카드 click
gamecardClasses.forEach((target) => target.addEventListener("click", function(e){ 
    const cardselected = document.querySelector('.cardselected');

    // 기존 선택된거 지우기
    if(cardselected) {
        cardselected.classList.remove('cardselected');
    }

    target.classList.add('cardselected');
}));

// 선택하기 click
selectbtn.addEventListener('click', function() {
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

    bjSelectCard = cardselected.dataset.card;
    console.log('select',bjSelectCard);

    gamecardClasses.forEach(function(el) {
        if(!el.classList.contains('cardselected')) {
            el.style.display = 'none';
        }
    });

    setWaitDisplay('show');
    setDefaultDisplay('hide');

    // 통신 시작
    extensionCall();
});