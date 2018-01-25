var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('MainCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() })

    // match selection
    $scope.matchList=["men final","men semifinal 1","men semifinal 2"];
    // selected match
    $scope.selectedMatch="men final";

    // fencing data structure
    $scope.fencingData={
        series:[]                   // raw data: time, event, score, player1, player2, position
        , events:[]                 // events in the match: time_start, time_end, index, player, score
        , bouts:[]                  // bouts of the match: time_start, time_end, index, player
        , tactics:[]                // tactics of each bout: name, tactic1, tactic2, score
        , statistics:[
            {count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
        ]         // statistics of the tactic: 0-aa;1-ar;2-ra;3-rr
        , statistics_tree:{}       // tree of the statistics
        , motion_tree:{}          // tree of motion
        , selectedNode:{}
        , selectedInfo:[]          // used for the selected node information display
    }

    // check if the string is offensive
    function checkOffensive(str){
        var len=str.length;
        var index=0;
        while(index++<len){
            if(str[index]!='f'&&str[index]!='a') return false;

            if(str[index]=='a') return true;
        }

        return false;


    }

    function addElem(tree,i1,i2,i3){
        tree.children[i1].children[i2].children[i3].children.push({acronym:"",children_length:0,children:[]})
        tree.children[i1].children[i2].children[i3].children_length++;
        tree.children[i1].children[i2].children[i3].count++;
        tree.children[i1].children[i2].count++;
        tree.children[i1].count++;
        tree.count++;
    }
    function addElem4(tree,i1,i2,i3,i4){
    //    console.log("addElem")
    //    console.log(tree);
        tree.children[i1].children[i2].children[i3].children[i4].children.push({acronym:"",children_length:0,children:[]})
        tree.children[i1].children[i2].children[i3].children[i4].children_length++;
        tree.children[i1].children[i2].children[i3].children[i4].count++;
        tree.children[i1].children[i2].children[i3].count++;
        tree.children[i1].children[i2].count++;
        tree.children[i1].count++;
        tree.count++;
    }

    // version 2 of readData, added the behavior of two players
    var fileName="../data/men_final.csv";
    function readData(){
        var series=[];
        var events=[];
        var bouts=[];
        var tactics=[];
        var statistics=[
            {count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
        ]
        d3.csv(fileName, function(d) {
            var arrTime=d.time.split(':');
            var minute=arrTime[0];
            var second=arrTime[1];
            series.push({
                time: new Date(2017,1,1,0,minute,second,0),
                event:d.event,
                score:d.score,
                player1:d.player1,
                player2:d.player2,
                position: d.position
            });
        }, function(error, classes) {
            var s1=0;
            var s2=0;
            var index=0;
            var lastE;
            var bRemoveInvalid=true;    // whether remove the invalid time span
            if(bRemoveInvalid)
            {
                var timeBias=0;
                series.forEach(function(d){
                    //console.log(d);
                    if(d.event=="s") {
                        if (lastE){
                            timeBias+=d.time.getTime()-lastE.time.getTime()-600;
                        }
                        else{
                            timeBias=d.time.getTime()-(new Date(2017,1,1,0,0,0,0)).getTime();
                        }
                    }
                    else{
                        var scoredPlayer=0;
                        if(d.score==1) {
                            scoredPlayer=1;
                            s1++;
                        }
                        if(d.score==2) {
                            scoredPlayer=2;
                            s2++;
                        }
                        events.push({
                            time_start:new Date(lastE.time.getTime()-timeBias),
                            time_end: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 1,
                            score: s1
                        })
                        events.push({
                            time_start:new Date(lastE.time.getTime()-timeBias),
                            time_end: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 2,
                            score: s2
                        })
                        bouts.push({
                            time_start:new Date(lastE.time.getTime()-timeBias),
                            time_end: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: scoredPlayer
                        })
                        index++;
                    }
                    lastE=d;
                });

            }
            else
                series.forEach(function(d){
                    if(d.event=="s"){
                        lastE=d;
                    }
                    else{

                        if(d.score==1) s1++;
                        if(d.score==2) s2++;
                        events.push({
                            time_start:lastE.time,
                            time_end: d.time,
                            index: index,
                            player: 1,
                            score: s1
                        })
                        events.push({
                            time_start:lastE.time,
                            time_end: d.time,
                            index: index,
                            player: 2,
                            score: s2
                        })
                        index++;
                    }
                });
            // for tactics information
            var state=-1;
            var index=1;
            var tactic1="";
            var tactic2="";
            var score=0;
            var motion1="";
            var motion2="";
            series.forEach(function(d){
                if(d.event=="s") {
                    if(state>-1){
                        tactics.push({
                            name:index
                            ,tactic1:tactic1
                            ,tactic2:tactic2
                            ,motion1:motion1
                            ,motion2:motion2
                            ,score:score
                        });
                        motion1="";
                        motion2="";
                        index+=1;
                    }
                    state=1;
                }
                else{
                    if(state==1){
                        tactic1=checkOffensive(d.player1)? "a":"r";
                        tactic2=checkOffensive(d.player2)? "a":"r";
                        motion1+=d.player1;
                        motion2+=d.player2;
                        state=2;
                    }
                    score=d.score;
                }
            });
            // add the last one
            tactics.push({
                name:index
                ,tactic1:tactic1
                ,tactic2:tactic2
                ,motion1:motion1
                ,motion2:motion2
                ,score:score
            });

            // the tactic result matrix
            tactics.forEach(function(d){
                var index=-1;

                if(d.tactic1=="a")
                    if(d.tactic2=="a") index=0;
                    else index=1;
                else
                    if(d.tactic2=="a") index=2;
                    else index=3;

                statistics[index].count++;
                if(d.score==1) statistics[index].player1++;
                if(d.score==2) statistics[index].player2++;

            })

            // build the statistics tree
            var statistics_tree={                 // tree of the result
                acronym:"比赛统计",
                children_length: 2,
                count: 0,
                children:[
                    {
                        acronym:"选手1",
                        children_length: 3,
                        count: 0,
                        children:[
                            {acronym:"得分回合",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"失分回合",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"互不得分",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]}
                        ]
                    },{
                        acronym:"选手2",
                        children_length: 3,
                        count: 0,
                        children:[
                            {acronym:"得分回合",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"失分回合",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"互不得分",children_length:0,count: 0,children:[
                                    {acronym:"前进",children_length:0,count: 0,children:[]},
                                    {acronym:"后退",children_length:0,count: 0,children:[]}
                                ]}
                        ]
                    }
                ]
            }

            tactics.forEach(function(d){
                if(d.score==1){
                    if(d.tactic1=='a'){
                        addElem(statistics_tree,0,0,0);
                    }
                    else{
                        addElem(statistics_tree,0,0,1);
                    }
                    if(d.tactic2=='a'){
                        addElem(statistics_tree,1,1,0);
                    }
                    else{
                        addElem(statistics_tree,1,1,1);
                    }
                }
                else if(d.score==2){
                    if(d.tactic1=='a'){
                        addElem(statistics_tree,0,1,0);
                    }
                    else{
                        addElem(statistics_tree,0,1,1);
                    }
                    if(d.tactic2=='a'){
                        addElem(statistics_tree,1,0,0);
                    }
                    else{
                        addElem(statistics_tree,1,0,1);
                    }
                }
                else{
                    if(d.tactic1=='a'){
                        addElem(statistics_tree,0,2,0);
                    }
                    else{
                        addElem(statistics_tree,0,2,1);
                    }
                    if(d.tactic2=='a'){
                        addElem(statistics_tree,1,2,0);
                    }
                    else{
                        addElem(statistics_tree,1,2,1);
                    }
                }
            })


            // build the motion tree
            var motion_tree={                 // tree of the motion
                acronym:"行动统计",
                children_length: 2,
                count: 0,
                children:[
                    {
                        acronym:"选手1",
                        children_length: 2,
                        count: 0,
                        children:[
                            {acronym:"前进",children_length:3,count: 0,children:[
                                    {acronym:"得分",children_length:2,count: 0,children:[
                                            {acronym:"前进得分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退得分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"失分",children_length:2,count: 0,children:[
                                            {acronym:"前进失分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退失分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"互中",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"后退",children_length:0,count: 0,children:[
                                    {acronym:"得分",children_length:2,count: 0,children:[
                                            {acronym:"前进得分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退得分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"失分",children_length:2,count: 0,children:[
                                            {acronym:"前进失分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退失分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"互中",children_length:0,count: 0,children:[]}
                                ]}
                        ]
                    },{
                        acronym:"选手1",
                        children_length: 2,
                        count: 0,
                        children:[
                            {acronym:"前进",children_length:3,count: 0,children:[
                                    {acronym:"得分",children_length:2,count: 0,children:[
                                            {acronym:"前进得分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退得分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"失分",children_length:2,count: 0,children:[
                                            {acronym:"前进失分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退失分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"互中",children_length:0,count: 0,children:[]}
                                ]},
                            {acronym:"后退",children_length:0,count: 0,children:[
                                    {acronym:"得分",children_length:2,count: 0,children:[
                                            {acronym:"前进得分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退得分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"失分",children_length:2,count: 0,children:[
                                            {acronym:"前进失分",children_length:0,count: 0,children:[]},
                                            {acronym:"后退失分",children_length:0,count: 0,children:[]}
                                        ]},
                                    {acronym:"互中",children_length:0,count: 0,children:[]}
                                ]}
                        ]
                    }
                ]
            }
            var first=true;
            var lastMotion;
            tactics.forEach(function(d){
                if(!first){
                    var i1_2=d.tactic1=='a'? 0:1;
                    var i2_2=d.tactic2=='a'? 0:1;
                    var i1_3,i2_3;
                    if(lastMotion.score==0){
                        i1_3=2;
                        i2_3=2;
                    }
                    else if(lastMotion.score==1){
                        i1_3=0;
                        i2_3=1;

                    }
                    else if(lastMotion.score==2){
                        i1_3=1;
                        i2_3=0;
                    }
                    var i1_4=lastMotion.tactic1=='a'? 0:1;
                    var i2_4=lastMotion.tactic2=='a'? 0:1;
                    if(i1_3==2){
                        addElem(motion_tree,0,i1_2,i1_3);           // for player 1
                        addElem(motion_tree,1,i2_2,i2_3);           // for player 2
                    }
                    else{
                        addElem4(motion_tree,0,i1_2,i1_3,i1_4);           // for player 1
                        addElem4(motion_tree,1,i2_2,i2_3,i2_4);           // for player 2
                    }
                }
                else{
                    first=false;
                }
                lastMotion=d;
            })




        //    console.log(series);
            $scope.fencingData.series=series;
            $scope.fencingData.events=events;
            $scope.fencingData.bouts=bouts;
            $scope.fencingData.tactics=tactics;
            $scope.fencingData.statistics=statistics;
            $scope.fencingData.statistics_tree=statistics_tree
            $scope.fencingData.motion_tree=motion_tree
            $scope.$apply();


            if (error) throw error;
        });
    }
    readData();

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

    $scope.fencingData.getLinks=function(){
        links=[];
        events.forEach(function(d){

        })
    }

    $scope.$watch('selectedMatch', function() {
        console.log("on selected Season")
        if($scope.selectedMatch=="men final"){
            fileName="../data/men_final.csv";
        }
        else if($scope.selectedMatch=="men semifinal 1"){
            fileName="../data/men_semifinal_1.csv";

        }
        else if($scope.selectedMatch=="men semifinal 2"){
            fileName="../data/men_semifinal_2.csv";
        }
        readData();
    });
});



