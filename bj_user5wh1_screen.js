const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const START_GAME = 'start_game';
const PROCESS = 'process';
const SLOT = 'slot';
const maxChat = 100;
let chatCnt = 0;
let viewIdx = 0;
let isProcessing = false;
let randomSlot = null

const nextbtn = document.querySelector('#nextbtn');
const homebtn = document.querySelector('#homebtn');
const chatdiv = document.querySelector('.chatdiv');
const w_start = document.querySelector('#w_start');

const hTitle = {when: '언제 ?', where: '어디서 ?', who: '누가 ?', how: '어떻게 ?', what: '무엇을 ?'};
let userSetting = {
    type: '', star: 1
};
let inputArr = {
    when: [], where: [], who: [], how: [], what: []
};
let checkChatList = {};
let starGivedUserIdArr = [];

extensionSdk.broadcast.send(START_GAME, 'user5wh1');

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
            userSetting.star = Number(document.querySelector('#starcnt').value);
            return;
        }
    }) 

    // console.log('userSetting', userSetting)
}

const setStartButtonDisplay = (action) => {
    w_start.style.display = action == 'show' ? '' : 'none';
    document.querySelector('#w_cnt').style.display = action == 'show' ? 'none' : '';
}

const pushChatOn = (view) => {
    for (const chat in checkChatList) {
        // true인 채팅만 저장하기
        if(checkChatList[chat]) {
            inputArr[view].push(chat);
        }
    }

    checkChatList = {}; // 초기화

    // console.log(inputArr)
}

const changeTitle = (view) => {
    document.querySelector('#w_title img').src = `./img/5wh1user/${view}.png`;
    document.querySelector('#w_title span').innerText = hTitle[view];

    setStartButtonDisplay('show');
}

const setSlotEvent = () => {
    const itemWhen = document.querySelector('#itemWhen');
    const itemWhere = document.querySelector('#itemWhere');
    const itemWho = document.querySelector('#itemWho');
    const itemHow = document.querySelector('#itemHow');
    const itemWhat = document.querySelector('#itemWhat');

    randomSlot = setInterval(function () {
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
}

document.querySelector('#stopBtn').addEventListener('click', function() {
    clearInterval(randomSlot);
})

document.querySelector('#resetBtn').addEventListener('click', function() {
    setSlotEvent();
})

// 채팅 개수 현황
const changeCntView = (action) => {
    chatCnt = action == 'add' ? chatCnt+1 : chatCnt-1;
    document.querySelector('#w_cnt').innerText = `${chatCnt}/${maxChat}`;
}

const initProcessChatView = () => {
    chatdiv.textContent = '';
    chatCnt = 0;
    isProcessing = false;
    document.querySelector('#w_cnt').innerText = `0/${maxChat}`;
}

// 익스텐션 통신
const handleChatInfoReceived = (action, message) => {
    // console.log(action, message)

    // 수집중이 아닐때는 저장하지 않는다.
    if(!isProcessing) return;

    switch (action) {
        case 'MESSAGE':
            const userInfo = message.userStatus;

            // 유저 자격요건 설정에 맞지 않으면 종료
            if(userSetting.type == 'login') {
                if(!userInfo.isGuest) return;
            }
            else if(userSetting.type == 'fan') {
                if(!userInfo.isFan) return;
            }
            else if(userSetting.type == 'star') {
                if(starGivedUserIdArr.indexOf(message.userId) == -1) return;
            }

            let chat = message.message;
            const regex = /[ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/g; // 단자음,단모음,특수문자,괄호,점,공백
            chat = chat.toLowerCase().replace(regex, '').slice(0,50); // 소문자로, 제거, 50자제한

            // 빈채팅 제거
            if(!chat) return;

            // 중복된 채팅 제거
            if(checkChatList[chat]) return;

            chatdiv.insertAdjacentHTML('beforeend', `<div class="p-1"><button class="chat on" onclick="setChatClick(this);">${chat}</button></div>`);
            checkChatList[chat] = true;
            changeCntView('add');

            // 최대개수가 넘으면 중단
            if(chatCnt == maxChat) {
                isProcessing = false;
            }
            break;
        case 'BALLOON_GIFTED':
            // 별풍선 쏜 유저 타입으로 설정했을때 설정한 개수 이상 선물한 경우
            if(userSetting.type == 'star' && Number(message.count) >= userSetting.star) {
                // 가능한 ID에 추가하기
                starGivedUserIdArr.push(message.userId);
            }
            break;
        default:
            break;
    }
}

extensionSdk.chat.listen(handleChatInfoReceived);

// 채팅 버튼 클릭 - 활성화/비활성화
const setChatClick = (target) => {
    // 비활성화 시키기
    if(target.classList.contains('on')) {
        target.classList.remove('on');
        target.classList.add('off');
        changeCntView('sub');
        checkChatList[target.innerText] = false;
    }
    // 활성화 시키기
    else {
        target.classList.remove('off');
        target.classList.add('on');
        changeCntView('add');
        checkChatList[target.innerText] = true;
    }
}

// Next 버튼
nextbtn.addEventListener('click', function() {
    const view = ['guide', 'when', 'where', 'who', 'how', 'what', 'last'];
    const nowView = view[viewIdx];
    const nextView = view[viewIdx+1];

    // 초기화
    initProcessChatView();

    switch (view[viewIdx]) {
        case 'guide':
            showProcessView();
            setUserSetting();
            break;
        case 'when':
        case 'where':
        case 'who':
            changeTitle(nextView);
            pushChatOn(nowView);
            break;
        case 'how':
            changeTitle(nextView);
            pushChatOn(nowView);
            nextbtn.innerText = '완료!';
            break;
        case 'what':
            pushChatOn(nowView);
            showLastView();
            setSlotEvent();
            break;
        case 'last':
            break;
    }

    // 유저 화면도 같이 바꾸기
    if(nextView == 'last') {
        extensionSdk.broadcast.send(SLOT);
    }
    else {
        let usertypemsg = '모든 유저';

        switch (userSetting.type) {
            case 'login':
                usertypemsg = '로그인 유저';
                break;
            case 'fan':
                usertypemsg = '팬가입 유저';
                break;
            case 'star':
                usertypemsg = `별풍선 ${userSetting.star}개 이상 선물한 유저`;
                break;
        }

        extensionSdk.broadcast.send(PROCESS, {viewtype: hTitle[nextView], usertype: usertypemsg});
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

// start click
w_start.addEventListener('click', function(target) {
    isProcessing = true;
    setStartButtonDisplay('hide');
});
