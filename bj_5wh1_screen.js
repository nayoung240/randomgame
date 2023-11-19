$(function(){
    const SDK = window.AFREECA.ext;
    const extensionSdk = SDK();
    const START_GAME = 'start_game';

    // 유저 화면은 메인으로 보내기
    extensionSdk.broadcast.send(START_GAME, 'main');

    const whenItems = ['오늘', '이번 달 안에', '이번 주 안에', '올해 안에', '1년 안에', '크리스마스 전까지', '1월1일 전까지',
        '다음 달 첫 방송에서', '당장', '10분 후에', '다음 방송에서', '방송 끝날 때'];
    const whereItems = ['집에서', '편의점에서', '바다에서', '한강에서', '서울에서', '경기도에서', '강원도에서', '제주도에서', '남산타워에서'
        , '부산에서', '집근처에서', '중국집에서', '놀이공원에서', '카페에서', '캠핑장에서', '지하철역에서'
        , '화장실에서', '부엌에서', '거실에서', '야외(어디에서든)', '유저가 선택한 곳에서(랜덤)'];
    const whoItems = ['내가', '혼자서', '다른 BJ랑', '아무나 1명이랑', '아무나 3명이랑', '아무나 2명이랑', '가장 최근 전화한 사람이랑'
        ,'남자친구랑', '부모님이랑', '여자친구랑', '동생이랑', '동창이랑', '카카오톡 채팅 창 첫번째 사람이랑'
        ,'(bj가 선택한)유저'];
    const howItems = ['대중교통을 타고', '패딩 입고', '비니 쓰고', '비닐장갑 끼고', '여름옷을 입고', '만보를 채울때까지'
        ,'지나가는 사람들한테 인사 하면서', '사랑합니다를 외치면서', '퇴장을 하면서', '전화를 걸어서', '슬링백을 추면서', '동전을 뿌리면서'
        ,'비둘기를 물리치면서', '깜찍한 표정을 지으면서', '잠에 들면서', '세수를 하면서', '째려보면서', '팔쟝을 끼면서'];
    const whatItems = ['노래하기', '랩하기', '춤추기', '리액션하기', '웨이브 춤 추기', '룩북촬영하기',
        ,'먹방하기', '먹방투어 3곳하기', '매운돈까스먹기', '매운짬뽕먹기', '원칩먹기', '라면먹기', '취두부먹기'
        ,'롤하기', '게임하기', '월드컵게임하기', '코스프레하기'
        ,'기부하기', '봉사하기', '야방하기'
        ,'국토대장정하기', '인생네컷찍기', '왁싱하기', '염색하기', '등산하기', '여행가기', '데이트하기'];
    // TODO. '어떻게', '무엇을' 말 안되는 것 빼기

    // ing...
    const randomSlot = setInterval(function () {
        $('#itemWhen').text(whenItems[Math.floor(Math.random() * whenItems.length)]);
        $('#itemWhere').text(whereItems[Math.floor(Math.random() * whereItems.length)]);
        $('#itemWho').text(whoItems[Math.floor(Math.random() * whoItems.length)]);
        $('#itemHow').text(howItems[Math.floor(Math.random() * howItems.length)]);
        $('#itemWhat').text(whatItems[Math.floor(Math.random() * whatItems.length)]);
    }, 100);

    $("#stopBtn").on("click", function () {
        clearInterval(randomSlot);
    });

    $("#resetBtn").on("click", function () {
        location.reload();
    });

    $("img[id='homebtn']").on("click", function () {
        window.location.replace('./bj_screen.html');
    });
});