$(document).ready(function () {
    var whenItems = ['오늘', '이번 달 안에', '이번 주 안에', '올해 안에', '1년 안에', '크리스마스 전까지', '1월1일 전까지',
        '다음 달 첫 방송에서', '당장', '10분 후에', '다음 방송에서', '방송 끝날 때'];
    var whereItems = ['집에서', '편의점에서', '바다에서', '한강에서', '서울에서', '경기도에서', '강원도에서', '제주도에서'
        , '부산에서', '집근처에서', '중국집에서', '카페에서', '캠핑장에서', '이불 안에서', '책상 밑에서', '택시 안에서', '지하철 안에서'
        , '화장실에서', '부엌에서', '거실에서', '야외(어디에서든)', '유저가 선택한 곳에서(랜덤)'];
    var whoItems = ['내가', '혼자서', '다른 BJ랑', '아무나 1명이랑', '아무나 3명이랑', '아무나 2명이랑', '가장 최근 전화한 사람이랑',
        '남자친구랑', '부모님이랑', '여자친구랑', '동생이랑', '대학교 동창이랑', '고등학교 친구랑', '카카오톡 채팅 창 첫번째 사람이랑',
        '(bj가 선택한)유저', 'bj가, 아무나'];
    var howItems = ['대중교통을 타고', '패딩 입고', '비니 쓰고', '장갑 끼고',
        '눈을 뒤짚으면서', '인사를 하면서', '사랑합니다 를 외치면서', '퇴장을 하면서', '전화를 걸어서', '슬링백을 추면서', '동전을 뿌리면서',
        '비둘기를 물리치면서', '깜찍한 표정을 지으면서', '잠에 들면서', '세수를 하면서', '째려보면서', '팔쟝을 끼면서'];
    var whatItems = ['노래하기', '춤추기', '먹방하기', '먹방투어하기', '생일파티하기',
        '춤추기(유저가 선택한 춤)', '이상한 표정 짓기', '가장 최신 댓글 읽어주기', '웨이브 춤 추기', '여름 옷 입고 있기', '댓글 달기', '라면 먹기', '인생네컷찍기'];
    // TODO. '어떻게', '무엇을' 말 안되는 것 빼기

    // ing...
    var randomSlot = setInterval(function () {
        $('#itemWhen').text(whenItems[Math.floor(Math.random() * whenItems.length)]);
        $('#itemWhere').text(whereItems[Math.floor(Math.random() * whereItems.length)]);
        $('#itemWho').text(whoItems[Math.floor(Math.random() * whoItems.length)]);
        $('#itemHow').text(howItems[Math.floor(Math.random() * howItems.length)]);
        $('#itemWhat').text(whatItems[Math.floor(Math.random() * whatItems.length)]);
    }, 100);

    $("button[id='stopBtn']").on("click", function () {
        clearInterval(randomSlot);
    });
    $("button[id='resetBtn']").on("click", function () {
        location.reload();
    });
});