const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
const PROCESS = 'process';
const SLOT = 'slot';

const setDefaultDisplay = (action) => {
    const defaultClasses = document.querySelectorAll('.default');

    defaultClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setProcessDisplay = (action) => {
    const processClasses = document.querySelectorAll('.process');

    processClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setLastDisplay = (action) => {
    const lastClasses = document.querySelectorAll('.last');

    lastClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const handleBroadcastReceived = (action, message, fromId) => {
    // 게임 시작 액션
    if(action === START_GAME) {
        if(message == 'main') {
            window.location = './user_screen.html';
        }
        else if(message == 'rps') {
            window.location = './user_rps_screen.html';
        }
        else if(message == 'user5wh1') {
            window.location = './user_user5wh1_screen.html';
        }
        else if(message == 'ladder') {
            window.location = './user_ladder_screen.html';
        }
    }
    // 채팅 입력받는 화면
    else if(action === PROCESS) {
        setDefaultDisplay('hide');
        setProcessDisplay('show');
        setLastDisplay('hide');
        document.querySelector('#viewtype').innerText = message.viewtype;
        document.querySelector('#usertype').innerText = message.usertype;
    }
    else if(action === SLOT) {
        setDefaultDisplay('hide');
        setProcessDisplay('hide');
        setLastDisplay('show');
    }

    console.log('UserReceived', action, message, fromId);
}

extensionSdk.broadcast.listen(handleBroadcastReceived);