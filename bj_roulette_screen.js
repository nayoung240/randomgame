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
    ctx.font = "23px sanserif";
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
        if (text.length > 9) {
            formatText = formatText.substr(0, 10) + '...';
        }
        ctx.fillText(formatText, 0, 30 * 0);
        ctx.restore();
    }
}

// 룰렛 돌리기
const rotate = () => {
    $c.style.transform = `initial`;
    $c.style.transition = `initial`;

    setTimeout(() => {
        // 룰렛 당첨 결정
        const ran = Math.floor(Math.random() * product.length);

        const arc = 360 / product.length;

        let arcMulitpNum = 3;
        if ([2, 7, 8].indexOf(product.length) < 0) {
            arcMulitpNum = 2;
        }

        const rotate = (ran * arc) + 3600 + (arc * arcMulitpNum) - (arc / 4);

        $c.style.transform = `rotate(-${rotate}deg)`;
        $c.style.transition = `2s`;
    }, 1);
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