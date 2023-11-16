const SDK = window.AFREECA.ext;
const extensionSdk = SDK();

const START_GAME = 'start_game';

const rpslogo = document.querySelector('#rpslogo');
const whlogo = document.querySelector('#whlogo');
const backbtn = document.querySelector('#backbtn');

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

    console.log('userscreen', action, message, fromId);
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

// 안내면진다 안내
rpslogo.addEventListener('click', function() {
    setDefaultDisplay('hide');
    setRpsDisplay('show');
    set5w1hDisplay('hide');
    backbtn.style.display = '';
});

// 6하원칙 안내
whlogo.addEventListener('click', function() {
    setDefaultDisplay('hide');
    setRpsDisplay('hide');
    set5w1hDisplay('show');
    backbtn.style.display = '';
});

// 뒤로가기 버튼
backbtn.addEventListener('click', function() {
    location.reload();
});