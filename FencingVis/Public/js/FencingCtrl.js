var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('FencingCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() })

    // 1.data field
    // match selection
    $scope.matchList=["men final","men semifinal 1","men semifinal 2"];

    // selected match
    $scope.selectedMatch="men final";

    // fencing data structure
    $scope.fencingData={
        series:[]                 // raw data: time, event, score, player1, player2, position
        , motion: []              // motions of feet
        , motion_hands:[]         // motions of hands
        , selectedNode:{}
        , selectedInfo:[]         // used for the selected node information display
        , filter:"no filter"      // "no filter","3 sceond"
        , selected_bout:-1        // index of selected bout, mouse click
        , focused_bout:null       // focused bout, mouse hover
        , bouts_data:[]           // data of each bouts
        , filter_value:500        // the threshold value of filter
        , filtered_phrase:0       // the number of filtered phrase
        , B:true                  // check box result
        , P1:true
        , P2:true
        , flow:{}                 // data of the tactic flow
        , focused_flow:{}         // flow of the focused bout
        , flow_1st:{}               // flow of the first half
        , flow_2nd:{}               // flow of the second half
        , Sum_flow:true             // show sum of the flow
    }

    // 2. definition of the functions
    // version 2 of readData, added the behavior of two players
    var fileNameV2="../data/men_final_v2.csv";
    // parse the frame field
    function parseFrame(str){
        var arrTime=str.split(':');
        if(arrTime.length<3) return -1;
        var minute=arrTime[0];
        var second=arrTime[1];
        var ms=arrTime[2];
        var frame=30*((+second)+60*(+minute))+(+ms);
        return frame;

    }
    // function of reading data of version 2
    function readDataV2(){
        var series=[];
        d3.csv(fileNameV2, function(d) {
            var frame=parseFrame(d.time);
            series.push({
                frame:frame
                ,foot1:d.foot1
                ,foot2:d.foot2
                ,hand1:d.hand1
                ,hand2:d.hand2
                ,pos1:d.pos1
                ,pos2:d.pos2
                ,result:d.result
                ,score:d.score
                ,bout:d.bout
                ,flow:d.flow
            });
        }, function(error, classes) {

            // generate motion data of hands and feet
            generateMotionData(series);
            // generate bout data
            generateBoutData(series);

            generateFlow($scope.fencingData.bouts_data);


            $scope.fencingData.series=series;
            $scope.$apply();


            if (error) throw error;
        });
    }
    // add a motion to the first argument
    function addMotion(motion,bout,seq,player,start,end,type){
        motion.push({
            bout:+bout,
            player:player,
            seq:+seq,
            frame_start:start,
            frame_end:end,
            bias_start:start,
            bias_end:end,
            type:type
        });

    }
    // generate motion data from the series
    function generateMotionData(series){
        var motion=[];
        var motion_hands=[]

        var bout=-1;
        var seq1=0;
        var seq2=0;
        var frame_last=-1;
        var frame_end=-1;

        // feet
        var frame_start1=-1;
        var frame_start2=-1;
        var type1="";
        var type2="";

        // hands
        var frame_start_hand_1=-1;
        var frame_start_hand_2=-1;
        var type_hand_1="";
        var type_hand_2="";

        var boutLen=0;
        // create the motion data
        series.forEach(function(d){
            if(d.bout.length>0){            // net bout
                bout=+d.bout;               // record this bout
                seq1=0;                // reset sequence
                seq2=0
                frame_start1=-1; // reset start frame
                frame_start2=-1
            }
            else{
                if(d.foot1.length>0){
                    if(d.foot1=="fs"){
                        seq1=(++seq1);
                        frame_start1=d.frame;
                        type1="f"
                    }
                    else if(d.foot1=="ff"){

                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq1,1,frame_start1,frame_end,type1);
                    }
                    else if(d.foot1=="as"){
                        seq1=(++seq1);
                        frame_start1=d.frame;
                        type1="a"
                    }
                    else if(d.foot1=="af"){
                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq1,1,frame_start1,frame_end,type1);
                    //    motion.push({
                    //        bout:+bout,
                    //        player:1,
                    //        seq:+seq1,
                    //        frame_start:frame_start1,
                    //        frame_end:frame_end,
                    //        type:type1
                    //    });
                    }
                    else if(d.foot1=="bs"){
                        seq1=(++seq1);
                        frame_start1=d.frame;
                        type1="b"

                    }
                    else if(d.foot1=="bf"){
                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq1,1,frame_start1,frame_end,type1);
                    }
                    else{
                        console.log("unexpected foot");
                    }
                }
                if(d.foot2.length>0){
                    if(d.foot2=="fs"){
                        seq2=(++seq2);
                        frame_start2=d.frame;
                        type2="f"
                    }
                    else if(d.foot2=="ff"){

                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq2,2,frame_start2,frame_end,type2);
                    //    motion.push({
                    //        bout:+bout,
                    //        player:2,
                    //        seq:+seq2,
                    //        frame_start:frame_start2,
                    //        frame_end:frame_end,
                    //        type:type2
                    //    });
                    }
                    else if(d.foot2=="as"){
                        seq2=(++seq2);
                        frame_start2=d.frame;
                        type2="a"
                    }
                    else if(d.foot2=="af"){
                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq2,2,frame_start2,frame_end,type2);
                    }
                    else if(d.foot2=="bs"){
                        seq2=(++seq2);
                        frame_start2=d.frame;
                        type2="b"

                    }
                    else if(d.foot2=="bf"){
                        frame_end=d.frame;
                        addMotion(motion,+bout,+seq2,2,frame_start2,frame_end,type2);
                    }
                    else{
                        console.log("unexpected foot");
                    }
                }
                if(d.hand1.length>0){
                    if(d.hand1=="as"){
                        frame_start_hand_1=d.frame;
                        type_hand_1="ha";
                    }
                    else if(d.hand1=="ps"){
                        frame_start_hand_1=d.frame;
                        type_hand_1="hp";
                    }
                    else if(d.hand1=="cs"){
                        frame_start_hand_1=d.frame;
                        type_hand_1="hc";
                    }
                    else if(d.hand1=="rs"){
                        frame_start_hand_1=d.frame;
                        type_hand_1="hr";
                    }
                    else if(d.hand1=="h"            // hit
                        ||d.hand1=="af"             // attack finished
                        ||d.hand1=="ap"             // attack been parried
                        ||d.hand1=="cf"             // counter attack finished
                        ||d.hand1=="p"              // parry
                        ||d.hand1=="pf"             // parry miss
                        ||d.hand1=="hp"             // hit be parried
                        ||d.hand1=="rf"             // reposte finished
                    ){
                        addMotion(motion_hands,+bout,0,1,frame_start_hand_1,d.frame,type_hand_1);
                    //    motion_hands.push({
                    //        bout:bout,
                    //        player:1,
                    //        seq:0,
                    //        frame_start:frame_start_hand_1,
                    //        frame_end:d.frame,
                    //        type:type_hand_1
                    //    });
                    }
                }
                if(d.hand2.length>0){
                    if(d.hand2=="as"){
                        frame_start_hand_2=d.frame;
                        type_hand_2="ha";
                    }
                    else if(d.hand2=="ps"){
                        frame_start_hand_2=d.frame;
                        type_hand_2="hp";
                    }
                    else if(d.hand2=="cs"){
                        frame_start_hand_2=d.frame;
                        type_hand_2="hc";
                    }
                    else if(d.hand2=="rs"){
                        frame_start_hand_2=d.frame;
                        type_hand_2="hr";
                    }
                    else if(d.hand2=="h"            // hit
                        ||d.hand2=="af"             // attack finished
                        ||d.hand2=="ap"             // attack been parried
                        ||d.hand2=="cf"             // counter attack finished
                        ||d.hand2=="p"              // parry
                        ||d.hand2=="pf"             // parry miss
                        ||d.hand2=="hp"             // hit be parried
                        ||d.hand1=="rf"             // reposte finished
                    ){
                        addMotion(motion_hands,+bout,0,2,frame_start_hand_2,d.frame,type_hand_2);
                    //    motion_hands.push({
                    //        bout:bout,
                    //        player:2,
                    //        seq:0,
                    //        frame_start:frame_start_hand_2,
                    //        frame_end:d.frame,
                    //        type:type_hand_2
                    //    });
                    }
                }
            }
            if(bout>boutLen) boutLen=bout;
        });
        // calculate start frames of each bout
        var start_frames=[];
        for(var i=0;i<boutLen;i++) start_frames.push(1000000);
        motion.forEach(function(d){
            if(d.seq==1 && d.frame_start<start_frames[d.bout-1]) start_frames[d.bout-1]=d.frame_start;
        })

        // make each motion start from frame 0
        motion.forEach(function(d,i){
            motion[i].bias_start-=start_frames[d.bout-1];
            motion[i].bias_end-=start_frames[d.bout-1];
        })
        motion_hands.forEach(function(d,i) {
            motion_hands[i].bias_start-=start_frames[d.bout-1];
            motion_hands[i].bias_end-=start_frames[d.bout-1];

        })

        // sort the data
        motion.sort(function(a,b){
            var bout=a.bout-b.bout;
            if(bout!=0) return bout;
            else{
                var player=a.player-b.player;
                if(player!=0) return player;
                else return a.seq-b.seq;
            }
        })

        $scope.fencingData.motion_hands=motion_hands;
        $scope.fencingData.motion=motion;
    }
    // generate the data of the bouts
    function generateBoutData(series){
        // generate bout data
        var boutsData=[]
        var boutIndex=1;
        var frame_start=-1;
        var arrScores=[0,0];
        series.forEach(function(d){
            if(frame_start==-1) frame_start=d.frame_start;
            if(d.score==1) arrScores[0]++;
            else if(d.score==2) arrScores[1]++;
            if(d.result.length>0){
                boutsData.push({
                    frame_start:frame_start,
                    frame_end:d.frame,
                    bout:boutIndex++,
                    player:1,
                    score: d.score,
                    result:d.result,
                    hands1:[],
                    hands2:[],
                    feet1:[],
                    feet2:[],
                    scores:[arrScores[0],arrScores[1]],
                    flow:d.flow
                })
                frame_start=-1;
            }
        })
        // bind motion data to bouts data
        $scope.fencingData.motion.forEach(function(d){
            if(d.player==1)
                boutsData[d.bout-1].feet1.push(d);
            else
                boutsData[d.bout-1].feet2.push(d);
        })
        $scope.fencingData.motion_hands.forEach(function(d){
            if(d.player==1)
                boutsData[d.bout-1].hands1.push(d);
            else
                boutsData[d.bout-1].hands2.push(d);
        })
        // boutsData.forEach(function(d){            console.log(d);        })
        $scope.fencingData.bouts_data=boutsData;
    }
    // parse flow from state FB
    function parseFromFB(flow,str){
        if(str[2]=='f'||str.substring(2,4)=="rr"){
            flow.fb1++;
        }
        else if(str[2]=='b'){
            if(str.substring(3,5)=="fb"){
                flow.fbfb++;
                parseFromFB(flow,str.substring(3))
            }
            else if(str.substring(3,5)=="bf"){
                flow.fbb++;
                parseFromBF(flow,str.substring(3))
            }
            else{
                console.log("error in the string")
                console.log(str.substring(3,5))
            }
        }
        else if(str[2]=='a'||str[2]=='r'||str[2]=='c'){
            flow.fb2++;
        }
        else{
            console.log(str)
            console.log("error in the string")
        }

    }
    // parse flow from state BF
    function parseFromBF(flow,str){
        if(str[2]=='f'||str.substring(2,4)=="rr"){
            flow.bf2++;
        }
        else if(str[2]=='b'){
            if(str.substring(3,5)=="bf"){
                flow.bfbf++;
                parseFromBF(flow,str.substring(3))
            }
            else if(str.substring(3,5)=="fb"){
                console.log("bfb")
                flow.bfb++;
                parseFromFB(flow,str.substring(3))
            }
            else{
                console.log("error in the string")
            }
        }
        else if(str[2]=='a'||str[2]=='r'||str[2]=='c'){
            flow.bf1++;

        }
        else{
            console.log("error in the string")
        }

    }
    // parse a string of the flow
    function parseFlow(flow,str){
        var seg=str.substring(0,2)
        if(seg=="ff"){
            flow.sff++;
            if(str[2]=='1')flow.ff1++;
            if(str[2]=='b')flow.ffb++;
            if(str[2]=='2')flow.ff2++;
        }
        else if(seg=="bb"){
            flow.sbb++;
            str=str.substring(2);
            seg=str.substring(0,2)
            if(seg=="ff"){
                flow.bbff++;
                if(str[2]=='1')flow.ff1++;
                if(str[2]=='b')flow.ffb++;
                if(str[2]=='2')flow.ff2++;
            }
            else if(seg=="fb") {
                flow.bbfb++;
                parseFromFB(flow,str);
            }
            else if(seg=="bf") {
                flow.bbbf++;
                parseFromBF(flow,str);
            }
        }
        else if(seg=="fb") {
            flow.sfb++;
            parseFromFB(flow,str);
        }
        else if(seg=="bf") {
            flow.sbf++;
            parseFromBF(flow,str);
        }
        else{
            console.log(str);
            console.log("error in the string")
        }
    }
    // generate flow from series data
    function generateFlow(bouts_data){
        var flow={
            sbb:0
            ,sfb:0
            ,sff:0
            ,sbf:0
            ,bbfb:0
            ,bbff:0
            ,bbbf:0
            ,fb1:0
            ,fb2:0
            ,ff1:0
            ,ffb:0
            ,ff2:0
            ,bf1:0
            ,bf2:0
            ,fbb:0
            ,bfb:0
            ,fbfb:0
            ,bfbf:0
        }
        var flow_1st={
            sbb:0
            ,sfb:0
            ,sff:0
            ,sbf:0
            ,bbfb:0
            ,bbff:0
            ,bbbf:0
            ,fb1:0
            ,fb2:0
            ,ff1:0
            ,ffb:0
            ,ff2:0
            ,bf1:0
            ,bf2:0
            ,fbb:0
            ,bfb:0
            ,fbfb:0
            ,bfbf:0
        }
        var flow_2nd={
            sbb:0
            ,sfb:0
            ,sff:0
            ,sbf:0
            ,bbfb:0
            ,bbff:0
            ,bbbf:0
            ,fb1:0
            ,fb2:0
            ,ff1:0
            ,ffb:0
            ,ff2:0
            ,bf1:0
            ,bf2:0
            ,fbb:0
            ,bfb:0
            ,fbfb:0
            ,bfbf:0
        }
        bouts_data.forEach(function(d){
            if(d.flow){
                if(d.scores[0]<8&&d.scores[1]<8)
                    parseFlow(flow_1st,d.flow);
                else
                    parseFlow(flow_2nd,d.flow);
            }
        })
        var flow={
             sbb :  flow_1st.sbb +flow_2nd.sbb
            ,sfb :  flow_1st.sfb +flow_2nd.sfb
            ,sff :  flow_1st.sff +flow_2nd.sff
            ,sbf :  flow_1st.sbf +flow_2nd.sbf
            ,bbfb:  flow_1st.bbfb+flow_2nd.bbfb
            ,bbff:  flow_1st.bbff+flow_2nd.bbff
            ,bbbf:  flow_1st.bbbf+flow_2nd.bbbf
            ,fb1 :  flow_1st.fb1 +flow_2nd.fb1
            ,fb2 :  flow_1st.fb2 +flow_2nd.fb2
            ,ff1 :  flow_1st.ff1 +flow_2nd.ff1
            ,ffb :  flow_1st.ffb +flow_2nd.ffb
            ,ff2 :  flow_1st.ff2 +flow_2nd.ff2
            ,bf1 :  flow_1st.bf1 +flow_2nd.bf1
            ,bf2 :  flow_1st.bf2 +flow_2nd.bf2
            ,fbb :  flow_1st.fbb +flow_2nd.fbb
            ,bfb :  flow_1st.bfb +flow_2nd.bfb
            ,fbfb:  flow_1st.fbfb+flow_2nd.fbfb
            ,bfbf:  flow_1st.bfbf+flow_2nd.bfbf
        }
        $scope.fencingData.flow=flow;
        $scope.fencingData.flow_1st=flow_1st;
        $scope.fencingData.flow_2nd=flow_2nd;
    }

    // read in the default file
    readDataV2();

    // 3.watch events
    $scope.fencingData.onSelectedNode=function(node,callback){
        console.log("onSelectedNode");
        //console.log("onSelectedNode");
        // 0.update display
        $scope.fencingData.selectedInfo=[];
        $scope.fencingData.selectedInfo.push(node.year);
        $scope.fencingData.selectedInfo.push(node.player);
        $scope.fencingData.selectedInfo.push(node.score);



        $scope.fencingData.selectedNode=node;


        callback();
        // using this codes will cause the change vanishing after hover another node and hover back
        // I forget why I used these codes
        // 20150703
        /*
         $scope.treeData.selectedNode={
         id: node.id
         ,year: node.year
         ,name: node.name
         ,source: node.source
         ,abstract: node.abstract
         ,notes:node.notes
         ,authors:node.authors
         ,authorList:node.authorList
         ,keywords:node.keywords
         ,keywordsList:node.keywordsList
         }
         */
    }

    $scope.fencingData.onUnSelectedNode=function(){
        console.log("onUnSelectedNode");

    }

    $scope.$watch('selectedMatch', function() {
        if($scope.selectedMatch=="men final"){
            fileNameV2="../data/men_final_v2.csv";
        }
        else if($scope.selectedMatch=="men semifinal 1"){
            fileNameV2="../data/men_semifinal_1_v2.csv";
        }
        else if($scope.selectedMatch=="men semifinal 2"){
            fileNameV2="../data/men_semifinal_2_v2.csv";
        }
        readDataV2();
    });
    $scope.$watch('fencingData.focused_bout', function() {
    //    console.log($scope.fencingData.focused_bout);

        var flow={
            sbb:0
            ,sfb:0
            ,sff:0
            ,sbf:0
            ,bbfb:0
            ,bbff:0
            ,bbbf:0
            ,fb1:0
            ,fb2:0
            ,ff1:0
            ,ffb:0
            ,ff2:0
            ,bf1:0
            ,bf2:0
            ,fbb:0
            ,bfb:0
            ,fbfb:0
            ,bfbf:0
        }
        if($scope.fencingData.focused_bout){
            if($scope.fencingData.focused_bout.flow){

                console.log($scope.fencingData.focused_bout.flow);
                parseFlow(flow,$scope.fencingData.focused_bout.flow)
            }
        }
        $scope.fencingData.focused_flow=flow;

    });
});



