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

const showResult = () => {
    setWaitDisplay('hide');
    setCompleteDisplay('show');

    // TODO. 유저가 고른 카드로 보여주도록 변경
    const cardSelected = document.querySelector('.cardselected');
    gamecardClasses.forEach(function (el) {
        if (!el.classList.contains('cardselected')) {
            el.style.display = 'none';
        }
    });

    let gameResult = '';
    const usrCardId = cardSelected.id;
    const bjCardId = 'rockCard';    // TODO. 유저가 선택한 카드 아이디 받아와야 함
    if (usrCardId === bjCardId) {
        gameResult = 'draw';
    } else {
        if (usrCardId === 'scissorsCard') {
            gameResult = 'lose';
            if (bjCardId === 'paperCard') {
                gameResult = 'win';
            }
        } else if (usrCardId === 'rockCard') {
            gameResult = 'lose';
            if (bjCardId === 'scissorsCard') {
                gameResult = 'win';
            }
        } else if (usrCardId === 'paperCard') {
            gameResult = 'lose';
            if (bjCardId === 'rockCard') {
                gameResult = 'win';
            }
        }
    }
    console.log('User Game Result: ' + gameResult);    // TODO. 게임 결과 이미지로 대체

    msg = 'BJ가 모두를 이겼습니다!';
    const allCnt = 100;
    const winNicks = ['정보경','ababaabababa','손가을손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중','정보경','이나영','손가을','폭주중'];
    const winCnt = winNicks.length;

    if (winCnt > 0) {
        msg = `${allCnt}명중에 ${winCnt}명이 BJ를 이겼습니다!`;
        idarea.value = '<< 이긴 유저 >>\n' + winNicks.join('\n');
        idarea.style.display = '';
    }

    resultmsg.innerText = msg;
}

// 게임카드 click
gamecardClasses.forEach((target) => target.addEventListener("click", function (e) {
    const cardselected = document.querySelector('.cardselected');
    const cardData = target.dataset.card;
    console.log(cardData);

    // 기존 선택된거 지우기
    if (cardselected) {
        cardselected.classList.remove('cardselected');
    }

    target.classList.add('cardselected');
}));

// TODO. default상태에서 선택하기 누르면 게임 화면으로 이동하는데, 유저 이벤트 받아서 카운트 화면으로 넘어가도록 변경 필요
// 선택하기 click
selectbtn.addEventListener('click', function () {
    setWaitDisplay('show');
    setDefaultDisplay('hide');

    let elapsedTime = 0;
    let elapsedIdx = 0;
    let elapsedImg = ['img1', 'img2', 'img3', 'img4', 'img5'];
    const setIntervaltimer = setInterval(function () {
        elapsedTime += 1000; // 1초씩 증가
        console.log(elapsedImg[elapsedIdx]);    // 카운트 이미지 출력
        elapsedIdx++;

        console.log()
        // 타이머 종료
        if (elapsedTime >= 5000) {
            console.log('end')
            clearInterval(setIntervaltimer);
            showResult();
            return;
        }
    }, 1000); // 1초마다 실행
});