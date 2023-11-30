const $c = document.querySelector("canvas");
const optNum = document.querySelector("#optNum");
const ctx = $c.getContext(`2d`);
const rultSpace1 = document.querySelector("#rultSpace1");
const rultSpace2 = document.querySelector("#rultSpace2");
const rultResult = document.querySelector("#rouletteResult");
const homebtn = document.querySelector('#homebtn');

let product = [rultSpace1.value, rultSpace2.value];

const colors = ["#d3536e", "#e3623f", "#f6b039", "#eee645"
    , "#88d560", "#489d7d", "#55aed5", "#4f4277"];

let setNum; // 랜덤숫자 담을 변수

const init = () => {
    // 유저 화면은 메인으로 보내기
    const SDK = window.AFREECA.ext;
    const extensionSdk = SDK();
    const START_GAME = 'start_game';

    // 유저 화면은 메인으로 보내기
    extensionSdk.broadcast.send(START_GAME, 'main');
}

// 룰렛 생성
const newMake = () => {
    const rultListElmnts = document.getElementsByName('rultSpace');
    product = [];
    for (let i = 0; i < rultListElmnts.length; i++) {
        const spaceElm = document.getElementById('rultSpace' + (i + 1));
        product.push(spaceElm.value);
    }

    const [cw, ch] = [$c.width / 2, $c.height / 2];
    const arc = Math.PI / (product.length / 2);

    for (let i = 0; i < product.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(cw, ch);
        ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
        ctx.strokeStyle = "#4f3f98";
        ctx.stroke();
        // ctx.strokeRect(cw, ch, 100, 100);
        // ctx.closePath();
    }

    ctx.fillStyle = "#fff";
    ctx.font = '20px IBM Plex Sans KR';
    ctx.textAlign = "center";

    // 그려진 배경 위에 텍스트 그리기
    for (let i = 0; i < product.length; i++) {
        const angle = (arc * i) + (arc / 2);

        ctx.save();

        ctx.translate(
            cw + Math.cos(angle) * (cw - 50),
            ch + Math.sin(angle) * (ch - 50),
        );

        ctx.rotate(angle + Math.PI / 2);

        const text = product[i];
        let formatText = text;
        if (product.length < 6 && text.length > 9) {
            formatText = formatText.substr(0, 10) + '...';
        } else if (product.length === 6 && text.length > 7) {
            formatText = formatText.substr(0, 8) + '...';
        } else if (product.length === 7 && text.length > 6) {
            formatText = formatText.substr(0, 7) + '...';
        } else if (product.length === 8 && text.length > 5) {
            formatText = formatText.substr(0, 6) + '...';
        }

        ctx.fillText(formatText, 0, 30 * 0);
        ctx.restore();
    }
}

// 룰렛 돌리기
const rotate = () => {
    const rolLength = product.length;
    let deg = [];

    // 룰렛 각도 설정
    for (let i = 1, len = rolLength; i <= len; i++) {
      deg.push((360 / len) * i);
    }

    // 랜덤 생성된 숫자를 히든 인풋에 넣기
    let num = 0;
    setNum = Math.floor(Math.random() * product.length);
    
    // 애니설정
    let ani = setInterval(() => {
        num++;
        $c.style.transform = "rotate(" + 360 * num + "deg)";
        
        // 총 50에 다달했을때, 즉 마지막 바퀴를 돌고나서
        if (num === 50) {
            clearInterval(ani);
            $c.style.transform = `rotate(${deg[setNum]}deg)`;
        }
    }, 50);
};

const clickPlus = () => {
    const optVal = optNum.value;
    if (!optVal || optVal > 7) {
        return;
    }
    optNum.value++;

    // input박스 추가
    let newInput = document.createElement("input");
    const inputId = "rultSpace" + optNum.value;
    newInput.setAttribute("id", inputId);
    newInput.setAttribute("type", "text");
    newInput.setAttribute("name", "rultSpace");
    const inputVal = "옵션" + optNum.value;
    newInput.setAttribute("value", inputVal);
    newInput.setAttribute("class", "form-control");
    newInput.setAttribute("on", "form-control");
    newInput.setAttribute("maxlength", "50");
    newInput.setAttribute("oninput", 'changeRultSpace(this)');
    document.getElementById('spaceList').append(newInput);

    // 룰렛 재생성
    newMake();
}

const clickMinus = () => {
    const optVal = optNum.value;
    if (!optVal || optVal < 3) {
        return;
    }
    optNum.value--;
    deleteInput(optVal);
    // 룰렛 재생성
    newMake();
}

const deleteInput = (idIdx) => {
    if (product.length <= 2) {
        return;
    }
    const elemntId = "rultSpace" + idIdx;
    const elemnt = document.getElementById(elemntId);
    elemnt.remove();
}

const changeRultSpace = (obj) => {
    newMake();
}

homebtn.addEventListener('click', function () {
    window.location.replace('./bj_screen.html');
});

init();
newMake();