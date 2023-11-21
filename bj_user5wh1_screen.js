const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
let viewIdx = 0;

const nextbtn = document.querySelector('#nextbtn');

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
            document.querySelector('body').style.backgroundColor = '#eb3251';
            break;
    }

    showProcessView();

    viewIdx += 1;
});


// 50자까지 가능