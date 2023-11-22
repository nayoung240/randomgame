const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
let viewIdx = 0;

const nextbtn = document.querySelector('#nextbtn');
const homebtn = document.querySelector('#homebtn');
const chatClasses = document.querySelectorAll('.chat');

let userSetting = {
    type: '', star: 0
};
let inputArr = {
    when: [], where: [], who: [], how: [], what: []
};
const nextTitle = {when: '2. 어디서 ?', where: '3. 누가 ?', who: '4. 어떻게 ?', how: '5. 무엇을 ?'};

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

const setLastDisplay = (action) => {
    const lastClasses = document.querySelectorAll('.last');

    lastClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const showProcessView = () => {
    setDefaultDisplay('hide');
    setProcessDisplay('show');
    setLastDisplay('hide');

    const body = document.querySelector('body');
    body.style.backgroundColor = '#e9a329';
    body.style.color = 'black';
}

const showLastView = () => {
    setDefaultDisplay('hide');
    setProcessDisplay('hide');
    setLastDisplay('show');

    const body = document.querySelector('body');
    body.style.backgroundColor = '#eb3251';
    body.style.color = 'white';
    nextbtn.style.display = 'none';
    document.querySelector('#backbtn').style.display = 'block';
}

const setUserSetting = () => {
    const userList = document.getElementsByName('user');
            
    userList.forEach((node) => {
        if(node.checked)  {
            userSetting.type = node.value;
            userSetting.star = document.querySelector('#starcnt').value;
            return;
        }
    }) 
}

const pushChatOn = (view) => {
    const chatOn = document.querySelectorAll('.chat.on');

    chatOn.forEach((node) => {
        inputArr[view].push(node.innerText);
    })

    console.log(userSetting)
    console.log(inputArr)
}

const changeTitle = (view) => {
    document.querySelector('#w_title').innerText = nextTitle[view];
}

// Next 버튼
nextbtn.addEventListener('click', function() {
    const view = ['guide', 'when', 'where', 'who', 'how', 'what', 'last'];
    console.log(view[viewIdx]);

    switch (view[viewIdx]) {
        case 'guide':
            showProcessView();
            setUserSetting();
            break;
        case 'when':
        case 'where':
        case 'who':
            changeTitle(view[viewIdx]);
            pushChatOn(view[viewIdx]);
            break;
        case 'how':
            changeTitle(view[viewIdx]);
            pushChatOn(view[viewIdx]);
            nextbtn.innerText = '완료!';
            break;
        case 'what':
            pushChatOn(view[viewIdx]);
            showLastView();
            break;
        case 'last':
            break;
    }

    viewIdx += 1;
});

// 홈버튼 click
homebtn.addEventListener('click', function() {
    window.location = './bj_screen.html';
});

// 뒤로가기 click
document.querySelector('#backbtn').addEventListener('click', function() {
    window.location = './bj_user5wh1_screen.html'
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