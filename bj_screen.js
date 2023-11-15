const rpslogo = document.querySelector('#rpslogo');
const whlogo = document.querySelector('#whlogo');
const backbtn = document.querySelector('#backbtn');

// UI
const defaultClasses = document.querySelectorAll('.default');
const rpsClasses = document.querySelectorAll('.rps');
const whClasses = document.querySelectorAll('.wh');

const setDefaultDisplay = (action) => {
    defaultClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const setRpsDisplay = (action) => {
    rpsClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

const set5w1hDisplay = (action) => {
    whClasses.forEach(function(el) {
        el.style.display = action === 'show' ? '' : 'none';
    });
}

// 안내면진다 안내
rpslogo.addEventListener('click', function() {
    setDefaultDisplay('hide');
    setRpsDisplay('show');
    set5w1hDisplay('hide');
    backbtn.style.display = '';
});

// 6하원칙 안내
whlogo.addEventListener('click', function() {
    setDefaultDisplay('hide');
    setRpsDisplay('hide');
    set5w1hDisplay('show');
    backbtn.style.display = '';
});

// 뒤로가기 버튼
backbtn.addEventListener('click', function() {
    location.reload();
});