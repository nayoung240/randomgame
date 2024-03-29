$(function(){
    const SDK = window.AFREECA.ext;
    const extensionSdk = SDK();
    const START_GAME = 'start_game';
    const LAST = 'last';

    let heightNode = 10;
    let widthNode =  0;

    let LADDER = {};
    let row =0;
    let ladder = $('#ladder');
    let ladder_canvas = $('#ladder_canvas');
    let GLOBAL_FOOT_PRINT= {};
    let GLOBAL_CHECK_FOOT_PRINT= {};
    let working = false;
    const minMember = 2;
    const maxMember = 20;

    let userName = "";

    // 유저 화면은 사다리화면으로 보내기
    extensionSdk.broadcast.send(START_GAME, 'ladder');

    const canvasDraw = () => {
        ladder.css({
            'width' :( widthNode-1) * 100 + 6,
            'height' : (heightNode -1 ) * 25 + 6,
            'background-color' : '#fff'
        });

       ladder_canvas
       .attr('width' , ( widthNode-1) * 100 + 6)
       .attr('height' , ( heightNode-1) * 25 + 6);

        setDefaultFootPrint();
        reSetCheckFootPrint();
        setDefaultRowLine();
        setRandomNodeData();
        drawDefaultLine();
        userSetting();
        resultSetting();

        $('body').scrollTop(0);
    }

    // 다음페이지
    $('#button').on('click', function(){
        const member = $('input[name=member]').val();

        if(member < minMember || member > maxMember) {
            return;
        }

        widthNode = member;

        $('#landing').css({
            'opacity': 0
        });

        setTimeout(function(){
            $('#landing').remove();
            canvasDraw();
            $('#backbtn').show();
        }, 300)
    });

    // Go 버튼
    $(document).on('click', '#go', function(e) {
        drawNodeLine();

        $('.user-wrap').css({
            'top': -52
        });

        $ladderstart = $('.ladder-start');
        $ladderstart.show();
        $('#backbtn').show();
        $(this).hide();
        $('#footer h3').text('결과는 ?!');

        let i = 1;
        let ladderlength = $ladderstart.length;

        // 순차적으로 결과 보여주기
        $ladderstart.eq(0).trigger('click');

        const intervalfunc = setInterval(() => {
            $ladderstart.eq(i).trigger('click');
            
            if(i == ladderlength) {
                clearInterval(intervalfunc);
            }

            i += 1;
        }, 3000)
    })

    // 뒤로가기 버튼
    $(document).on('click', '#backbtn', function(e){
        location.reload();
    })

    // 홈으로가기 버튼
    $(document).on('click', '#homebtn', function(e){
        window.location = './bj_screen.html';
    })

    // 참여자 수 input
    $(document).on("keyup", "input[name=member]", function() {
        const val= $(this).val();
    
        if(val < minMember || val > maxMember) {
            $(this).val('');
        }
    });

    // 사다리 동그라미 버튼
    $(document).on('click', 'button.ladder-start', function(e){
        if(working){
            return false;
        }
        $('.dim').remove();
        working = true;
        reSetCheckFootPrint();
        let _this = $(e.target);
        _this.attr('disabled' ,  true).css({
            'color' : '#000',
            'border' : '1px solid #F2F2F2',
            'opacity' : '0.3'
        })
        let node = _this.attr('data-node');
        let color =  _this.attr('data-color');
        startLineDrawing(node, color);
        userName =  $('input[data-node="'+node+'"]').val();
    })
    
    function startLineDrawing(node , color){
        let x = node.split('-')[0]*1;
        let y = node.split('-')[1]*1;
        let nodeInfo = GLOBAL_FOOT_PRINT[node];
        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        
        if(y ==heightNode ){
            reSetCheckFootPrint();
            let target = $('input[data-node="'+node+'"]');
            target.css({
                'background-color' : color
            })
            $('#' + node + "-user").text(userName)

            working = false;

            const nodeResult = $(`.answer-wrap input[data-node=${node}]`).val();
            let resultel = `<h2>${userName}&nbsp;&nbsp;&nbsp;<img id="match" src="./ladder/next.png" alt="화살표">&nbsp;&nbsp;&nbsp;${nodeResult}</h2>`;
            document.querySelector('#footer').insertAdjacentHTML('beforeend', resultel);

            // 유저에게 결과 보내기
            extensionSdk.broadcast.send(LAST, resultel);

            return false;
        }

        if(nodeInfo["change"] ){
            let leftNode = (x-1) + "-" +y;
            let rightNode = (x+1) + "-" +y;
            let downNode = x +"-"+ (y + 1);
            let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                let leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                let rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    // console.log("중복일때  LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    // console.log('RIGHT 우선')
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                    // console.log("right")
                    setTimeout(function(){ 
                        return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    // console.log("LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    // console.log("RIGHT 우선");
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else{
                    // console.log('DOWN 우선')
                    stokeLine(x, y, 'h' , 'd' , color ,3)
                    setTimeout(function(){ 
                       return startLineDrawing(downNode, color)
                    }, 100);
                }
            }else{
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    // console.log('좌측라인')
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        // console.log("RIGHT 우선");
                        stokeLine(x, y, 'w' , 'r' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(rightNode, color)
                        }, 100);
                    }else{
                        // console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    // console.log('우측라인')
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        // console.log("LEFT 우선");
                        stokeLine(x, y, 'w' , 'l' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(leftNode, color)
                        }, 100);
                    }else{
                        // console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
               }
            }
        }else{
            // console.log("down")
            let downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,3)
            setTimeout(function(){ 
                return startLineDrawing(downNode, color)
             }, 100);
        }
    }

    function userSetting(){
        let userList = LADDER[0];
        let html = '';
        for(let i=0; i <  userList.length; i++){
            let color = '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);

            let x = userList[i].split('-')[0]*1;
            let y = userList[i].split('-')[1]*1;
            let left = x * 100-30;

            html += `<div class="user-wrap" style="left:${left}">`;
            html += `<input type="text" data-node="${userList[i]}">`;
            html += `<button class="ladder-start" style="display:none; background-color:${color};" data-color="${color}" data-node="${userList[i]}"></button>`;
            html += '</div>';
        }
        ladder.append(html);
    }

    function resultSetting(){
         let resultList = LADDER[heightNode-1];
        //  console.log(resultList )

        let html = '';

        for(let i=0; i <  resultList.length; i++){
            let x = resultList[i].split('-')[0]*1;
            let y = resultList[i].split('-')[1]*1 + 1;
            let node = x + "-" + y;
            let left = x * 100  -30
            html += '<div class="answer-wrap" style="left:'+left+'"><input type="text" data-node="'+node+'">';
            html +='<p id="'+node+'-user"></p>'
            html +='</div>'
        }
        ladder.append(html);
    }

    function drawNodeLine(){
        for(let y =0; y < heightNode; y++){
            for(let x =0; x <widthNode ; x++){
                let node = x + '-' + y;
                let nodeInfo  = GLOBAL_FOOT_PRINT[node];
                if(nodeInfo["change"] && nodeInfo["draw"] ){
                     stokeLine(x, y ,'w' , 'r' , '#ddd' , '2')
                }else{

                }
            }
        }
    }

    function stokeLine(x, y, flag , dir , color , width){
        let canvas = document.getElementById('ladder_canvas');
        let ctx = canvas.getContext('2d');
        let moveToStart =0, moveToEnd =0, lineToStart =0 ,lineToEnd =0; 
        let eachWidth = 100; 
        let eachHeight = 25;
        if(flag == "w"){
            //가로줄
            if(dir == "r"){
                ctx.beginPath();
                moveToStart = x * eachWidth ;
                moveToEnd = y * eachHeight ;
                lineToStart = (x+ 1) * eachWidth;
                lineToEnd = y * eachHeight;
            }else{
                ctx.beginPath();
                moveToStart = x * eachWidth;
                moveToEnd = y * eachHeight;
                lineToStart = (x- 1) * eachWidth;
                lineToEnd = y * eachHeight;
            }
        }else{
            ctx.beginPath();
            moveToStart = x * eachWidth ;
            moveToEnd = y * eachHeight;
            lineToStart = x * eachWidth ;
            lineToEnd = (y+1) * eachHeight;
        }

        ctx.moveTo(moveToStart + 3 ,moveToEnd  + 2);
        ctx.lineTo(lineToStart  + 3 ,lineToEnd  + 2 );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }

    function drawDefaultLine(){
        let html = '';
        html += '<table>'
         for(let y =0; y < heightNode-1; y++){
            html += '<tr>';
            for(let x =0; x <widthNode-1 ; x++){
                html += '<td style="width:98px; height:25px; border-left:2px solid #ddd; border-right:2px solid #ddd;"></td>';
            }
            html += '</tr>';
        }
        html += '</table>'
        ladder.append(html);
    }

    function setRandomNodeData(){
         for(let y =0; y < heightNode; y++){
            for(let x =0; x <widthNode ; x++){
                let loopNode = x + "-" + y;
                let rand = Math.floor(Math.random() * 2);
                if(rand == 0){
                    GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false}
                }else{
                    if(x == (widthNode - 1)){
                        GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false} ;    
                    }else{
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : true} ;  ;
                        x = x + 1;
                         loopNode = x + "-" + y;
                         GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : false} ;  ;
                    }
                }
            }
         }
    }

    function setDefaultFootPrint(){
        for(let r = 0; r < heightNode; r++){
            for(let column =0; column < widthNode; column++){
                GLOBAL_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }

    function reSetCheckFootPrint(){
        for(let r = 0; r < heightNode; r++){
            for(let column =0; column < widthNode; column++){
                GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }

    function setDefaultRowLine(){
        for(let y =0; y < heightNode; y++){
            let rowArr = [];
            for(let x =0; x <widthNode ; x++){
                let node = x + "-"+ row;
                rowArr .push(node);
                
                // 노드그리기
                let left = x * 100;
                let top = row * 25;
                
                node = $('<div></div>')
                .attr('class' ,'node')
                .attr('id' , node)
                .attr('data-left' , left)
                .attr('data-top' , top)
                .css({
                    'position' : 'absolute',
                    'left' : left,
                    'top' : top
                });
                ladder.append(node);
             }
             LADDER[row] =  rowArr;
             row++;
        }
    }
});
