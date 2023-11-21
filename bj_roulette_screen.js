const $c = document.querySelector("canvas");
const optNum = document.querySelector("#optNum");
const ctx = $c.getContext(`2d`);
const rultSpace1 = document.querySelector("#rultSpace1");
const rultSpace2 = document.querySelector("#rultSpace2");

let product = [rultSpace1.value, rultSpace2.value];

const colors = ["#d3536e", "#e3623f", "#f6b039", "#eee645"
    , "#88d560", "#489d7d", "#55aed5", "#4f4277"];

const makeProduct = () => {

    // const product = [rultSpace1.value];
    // return [2,3];
}

const newMake = () => {
    // const product = makeProduct();
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

        product[i].split(" ").forEach((text, j) => {
            ctx.fillText(text, 0, 30 * j);
        });

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
        const result = product[ran];
        setTimeout(() => console.log(result), 2000);
    }, 1);
};

const clickPlus = () => {
    const optVal = optNum.value;
    if (!optVal || optVal > 7) {
        return;
    }
    optNum.value++;
    product.push("3")
    newMake();
}

const clickMinus = () => {
    const optVal = optNum.value;
    if (!optVal || optVal < 3) {
        return;
    }
    optNum.value--;
    newMake();
}

newMake();