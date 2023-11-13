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

const showResult = () => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');
    
    let msg = 'BJ가 모두를 이겼습니다!';
    const winCnt = 10;
    const allCnt = 100;
    const winNicks = ['정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중'];

    if(winCnt > 0) {
        msg = `${allCnt}명중에 ${winCnt}명이 BJ를 이겼습니다!`;
        idarea.innerHTML  = '<< 이긴 유저 >><br>'+winNicks.join('<br>');
        idarea.style.display = '';
    }

    resultmsg.innerText = msg;
}

// 게임카드 click
gamecardClasses.forEach((target) => target.addEventListener("click", function(e){ 
    const cardselected = document.querySelector('.cardselected');
    const cardData = target.dataset.card;
    console.log(cardData);

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

    gamecardClasses.forEach(function(el) {
        if(!el.classList.contains('cardselected')) {
            el.style.display = 'none';
        }
    });

    setWaitDisplay('show');
    setDefaultDisplay('hide');

    let elapsedTime = 0;

    const setIntervaltimer = setInterval(function () {
        elapsedTime += 1000; // 1초씩 증가

        // 타이머 종료
        if (elapsedTime >= 5000) {
            console.log('end')
            clearInterval(setIntervaltimer);
            showResult();
            return;
        }
    }, 1000); // 1초마다 실행
});