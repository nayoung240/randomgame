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

let bjSelectCard = ''; // BJ가 선택한 카드

const selectbtn = document.querySelector('#selectbtn');
const gamecardClasses = document.querySelectorAll('.gamecard');

extensionSdk.broadcast.send(START_GAME, 'rps');

const setDefaultDisplay = (action) => {
    const defaultClasses = document.querySelectorAll('.default');

    defaultClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setWaitDisplay = (action) => {
    const waitClasses = document.querySelectorAll('.wait');

    waitClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setCompleteDisplay = (action) => {
    const completeClasses = document.querySelectorAll('.complete');

    completeClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showResult = (allCnt, winCnt, winnerList) => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');
    
    const resultmsg = document.querySelector('#resultmsg');
    const idarea = document.querySelector('#idarea');
    let oResult = {
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

const extensionCall = () => {
    let timerCount = 5;

    // 모든 유저에게 타이머 시작, BJ가 선택한 카드 전송
    extensionSdk.broadcast.send(TIMERSTART_BY_BJ, bjSelectCard);

    let winnerList = [];
    let allCnt = 0;
    let winCnt = 0;

    const handleBroadcastReceived = (action, message, fromId) => {
        // 카드 선택 액션
        if(action === SELECTCARD_BY_USER) {
            // 이긴 유저인 경우 목록에 추가
            if(message == 'win') {
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