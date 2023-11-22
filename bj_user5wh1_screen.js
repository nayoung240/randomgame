const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
let viewIdx = 0;

const nextbtn = document.querySelector('#nextbtn');
const homebtn = document.querySelector('#homebtn');
const chatClasses = document.querySelectorAll('.chat');

extensionSdk.broadcast.send(START_GAME, 'main');

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

nextbtn.addEventListener('click', function() {
    const view = ['guide', 'when', 'where', 'who', 'how', 'what', 'last'];

    switch (view[viewIdx+1]) {
        case 'when':
            setDefaultDisplay('hide');
            setProcessDisplay('show');
            const body = document.querySelector('body');
            body.style.backgroundColor = '#e9a329';
            body.style.color = 'black';
            break;
    }

    // showProcessView();

    viewIdx += 1;
});

// 홈버튼 click
homebtn.addEventListener('click', function() {
    window.location = './bj_screen.html';
});

// 채팅버튼 click
chatClasses.forEach((target) => target.addEventListener("click", function(e){
    if(target.classList.contains('on')) {
        target.classList.remove('on');
        target.classList.add('off');
    }
    else {
        target.classList.remove('off');
        target.classList.add('on');
    }
}));
// 50자까지 가능