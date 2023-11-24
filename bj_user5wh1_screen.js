const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
const maxChat = 50;
let chatCnt = 0;
let viewIdx = 0;
let isProcessing = false;

const nextbtn = document.querySelector('#nextbtn');
const homebtn = document.querySelector('#homebtn');
const chatClasses = document.querySelectorAll('.chat');
const chatdiv = document.querySelector('.chatdiv');

let userSetting = {
    type: '', star: 0
};
let inputArr = {
    when: [], where: [], who: [], how: [], what: []
};

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

    document.querySelector('#backbtn').style.display = 'block';
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

    console.log('userSetting', userSetting)
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
    const hTitle = {where: '어디서 ?', who: '누가 ?', how: '어떻게 ?', what: '무엇을 ?'};

    document.querySelector('#w_title img').src = `./img/5wh1user/${view}.png`;
    document.querySelector('#w_title span').innerText = hTitle[view];
}

const setSlotEvent = () => {
    const stopBtn = document.querySelector('#stopBtn');
    const resetBtn = document.querySelector('#resetBtn');
    const itemWhen = document.querySelector('#itemWhen');
    const itemWhere = document.querySelector('#itemWhere');
    const itemWho = document.querySelector('#itemWho');
    const itemHow = document.querySelector('#itemHow');
    const itemWhat = document.querySelector('#itemWhat');

    const randomSlot = setInterval(function () {
        if(inputArr.when.length) {
            itemWhen.innerText = inputArr.when[Math.floor(Math.random() * inputArr.when.length)];
        }

        if(inputArr.where.length) {
            itemWhere.innerText = inputArr.where[Math.floor(Math.random() * inputArr.where.length)];
        }

        if(inputArr.who.length) {
            itemWho.innerText = inputArr.who[Math.floor(Math.random() * inputArr.who.length)];
        }

        if(inputArr.how.length) {
            itemHow.innerText = inputArr.how[Math.floor(Math.random() * inputArr.how.length)];
        }

        if(inputArr.what.length) {
            itemWhat.innerText = inputArr.what[Math.floor(Math.random() * inputArr.what.length)];
        }
    }, 100);
    
    stopBtn.addEventListener('click', function() {
        clearInterval(randomSlot);
    })
    
    resetBtn.addEventListener('click', function() {
        clearInterval(randomSlot);
    })
}

const handleChatInfoReceived = (action, message) => {
    console.log(action, message)

    // 수집중이 아닐때는 저장하지 않는다.
    if(!isProcessing) return;

    switch (action) {
        case 'MESSAGE':
            const userInfo = message.userStatus;

            // 유저 자격요건 설정에 맞는 유저인지 체크
            if(userSetting.type == 'login') {
                if(!userInfo.isGuest) {
                    return;
                }
            }
            else if(userSetting.type == 'fan') {
                if(!userInfo.isFan) {
                    return;
                }
            }

            let chat = message.message;
            const regex = /[ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/g; // 단자음,단모음,특수문자,괄호,점,공백
            chat = chat.toLowerCase().replace(regex, '').slice(0,50); // 소문자로, 제거, 50자제한

            // 빈채팅 제거
            if(!chat) return;

            chatdiv.append(`<div class="p-1"><button class="chat on">${chat}</button></div>`);
            chatCnt += 1;

            // 최대개수가 넘으면 중단
            if(chatCnt == maxChat) {
                isProcessing = false;
            }
            break;
        case 'BALLOON_GIFTED':
            break;
        default:
            break;
    }
}

extensionSdk.chat.listen(handleChatInfoReceived);

// Next 버튼
nextbtn.addEventListener('click', function() {
    const view = ['guide', 'when', 'where', 'who', 'how', 'what', 'last'];

    // 채팅영역 초기화
    chatdiv.textContent = '';
    chatCnt = 0;

    switch (view[viewIdx]) {
        case 'guide':
            showProcessView();
            setUserSetting();
            break;
        case 'when':
        case 'where':
        case 'who':
            changeTitle(view[viewIdx+1]);
            pushChatOn(view[viewIdx]);
            break;
        case 'how':
            changeTitle(view[viewIdx+1]);
            pushChatOn(view[viewIdx]);
            nextbtn.innerText = '완료!';
            break;
        case 'what':
            pushChatOn(view[viewIdx]);
            showLastView();
            setSlotEvent();
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

// start click
document.querySelector('#w_start').addEventListener('click', function() {
    isProcessing = true;
});
