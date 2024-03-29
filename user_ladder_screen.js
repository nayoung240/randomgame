const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
const PROCESS = 'process';
const LAST = 'last';

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
    else if(action === PROCESS) {
        setLastDisplay('hide');
    }
    else if(action === LAST) {
        setProcessDisplay('hide');
        setLastDisplay('show');
        
        document.querySelector('#l_text').insertAdjacentHTML('beforeend', message);
    }
}

extensionSdk.broadcast.listen(handleBroadcastReceived);