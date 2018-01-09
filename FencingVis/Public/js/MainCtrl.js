var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('MainCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() })

    // match selection
    $scope.matchList=["men final","men semifinal 1","men semifinal 2"];
    // selected Season
    $scope.selectedMatch="men final";

    $scope.fencingData={
        events:[
            {start:new Date(2017,1,1,0,00,00,0),time:new Date(2017,1,1,0,00,10,0),index: 0 ,player: 1,score:0},	{start:new Date(2017,1,1,0,00,00,0),time:new Date(2017,1,1,0,00,10,0),index: 0 ,player: 2,score:0},
            {start:new Date(2017,1,1,0,00,00,0),time:new Date(2017,1,1,0,00,10,0),index: 1 ,player: 1,score:0},	{start:new Date(2017,1,1,0,00,00,0),time:new Date(2017,1,1,0,00,10,0),index: 1 ,player: 2,score:1},
            {start:new Date(2017,1,1,0,01,00,0),time:new Date(2017,1,1,0,01,10,0),index: 2 ,player: 1,score:0},	{start:new Date(2017,1,1,0,01,00,0),time:new Date(2017,1,1,0,01,10,0),index: 2 ,player: 2,score:2},
            {start:new Date(2017,1,1,0,01,00,0),time:new Date(2017,1,1,0,01,10,0),index: 3 ,player: 1,score:0},	{start:new Date(2017,1,1,0,01,00,0),time:new Date(2017,1,1,0,01,10,0),index: 3 ,player: 2,score:2},
            {start:new Date(2017,1,1,0,03,00,0),time:new Date(2017,1,1,0,03,10,0),index: 4 ,player: 1,score:1},	{start:new Date(2017,1,1,0,03,00,0),time:new Date(2017,1,1,0,03,10,0),index: 4 ,player: 2,score:2},
            {start:new Date(2017,1,1,0,03,00,0),time:new Date(2017,1,1,0,03,10,0),index: 5 ,player: 1,score:1},	{start:new Date(2017,1,1,0,03,00,0),time:new Date(2017,1,1,0,03,10,0),index: 5 ,player: 2,score:2},
            {start:new Date(2017,1,1,0,04,00,0),time:new Date(2017,1,1,0,04,10,0),index: 5,player: 1,score:1},	{start:new Date(2017,1,1,0,04,00,0),time:new Date(2017,1,1,0,04,10,0),index: 5,player: 2,score:2},
            {start:new Date(2017,1,1,0,04,00,0),time:new Date(2017,1,1,0,04,10,0),index: 6,player: 1,score:1},	{start:new Date(2017,1,1,0,04,00,0),time:new Date(2017,1,1,0,04,10,0),index: 6,player: 2,score:3},
            {start:new Date(2017,1,1,0,06,00,0),time:new Date(2017,1,1,0,06,10,0),index: 7,player: 1,score:1},	{start:new Date(2017,1,1,0,06,00,0),time:new Date(2017,1,1,0,06,10,0),index: 7,player: 2,score:4},
            {start:new Date(2017,1,1,0,06,00,0),time:new Date(2017,1,1,0,06,10,0),index: 8,player: 1,score:1},	{start:new Date(2017,1,1,0,06,00,0),time:new Date(2017,1,1,0,06,10,0),index: 8,player: 2,score:5},
            {start:new Date(2017,1,1,0,10,00,0),time:new Date(2017,1,1,0,10,10,0),index: 9,player: 1,score:1},	{start:new Date(2017,1,1,0,10,00,0),time:new Date(2017,1,1,0,10,10,0),index: 9,player: 2,score:6},
            {start:new Date(2017,1,1,0,10,00,0),time:new Date(2017,1,1,0,10,10,0),index: 10,player: 1,score:1},	{start:new Date(2017,1,1,0,10,00,0),time:new Date(2017,1,1,0,10,10,0),index:10,player: 2,score:7},
            {start:new Date(2017,1,1,0,11,00,0),time:new Date(2017,1,1,0,11,10,0),index: 11,player: 1,score:1},	{start:new Date(2017,1,1,0,11,00,0),time:new Date(2017,1,1,0,11,10,0),index:11,player: 2,score:8},
            {start:new Date(2017,1,1,0,11,00,0),time:new Date(2017,1,1,0,11,10,0),index: 12,player: 1,score:1},	{start:new Date(2017,1,1,0,11,00,0),time:new Date(2017,1,1,0,11,10,0),index:12,player: 2,score:9},
            {start:new Date(2017,1,1,0,13,00,0),time:new Date(2017,1,1,0,13,10,0),index: 13,player: 1,score:1},	{start:new Date(2017,1,1,0,13,00,0),time:new Date(2017,1,1,0,13,10,0),index:13,player: 2,score:10},
            {start:new Date(2017,1,1,0,13,00,0),time:new Date(2017,1,1,0,13,10,0),index: 14,player: 1,score:1},	{start:new Date(2017,1,1,0,13,00,0),time:new Date(2017,1,1,0,13,10,0),index:14,player: 2,score:11},
            {start:new Date(2017,1,1,0,15,00,0),time:new Date(2017,1,1,0,15,10,0),index: 15,player: 1,score:1},	{start:new Date(2017,1,1,0,15,00,0),time:new Date(2017,1,1,0,15,10,0),index:15,player: 2,score:12},
            {start:new Date(2017,1,1,0,15,00,0),time:new Date(2017,1,1,0,15,10,0),index: 16,player: 1,score:1},	{start:new Date(2017,1,1,0,15,00,0),time:new Date(2017,1,1,0,15,10,0),index:16,player: 2,score:13},
            {start:new Date(2017,1,1,0,18,00,0),time:new Date(2017,1,1,0,18,10,0),index: 17,player: 1,score:1},	{start:new Date(2017,1,1,0,18,00,0),time:new Date(2017,1,1,0,18,10,0),index:17,player: 2,score:14},
            {start:new Date(2017,1,1,0,18,00,0),time:new Date(2017,1,1,0,18,10,0),index: 18,player: 1,score:1},	{start:new Date(2017,1,1,0,18,00,0),time:new Date(2017,1,1,0,18,10,0),index:18,player: 2,score:15},
        ]
        , rounds:[]
        , selectedNode:{}
        , selectedInfo:[]           // used for the selected node information display
        , series:[]
    }
    $scope.tacticsData={
        Data:[
            /*
        {name:'1', tactic1: 'a', tactic2: 'a', score: 2}
        ,{name:'2', tactic1: 'a', tactic2: 'a', score: 1}
        ,{name:'3', tactic1: 'r', tactic2: 'r', score: 2}
        ,{name:'4', tactic1: 'a', tactic2: 'a', score: 2}
        ,{name:'5', tactic1: 'r', tactic2: 'r', score: 1}
        ,{name:'6', tactic1: 'r', tactic2: 'r', score: 2}
        ,{name:'7', tactic1: 'a', tactic2: 'a', score: 2}
        */
        ]
        ,
        Results:[
            {count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
            ,{count:1,player1:0,player2:0}
        ]
    }

    // version 1 of readData, just read time and score
    function readData_1(){
        d3.csv("../data/female_half.csv", function(d) {
            var arrTime=d.time.split(':');
            var minute=arrTime[0];
            var second=arrTime[1];
            $scope.fencingData.series.push({
                time: new Date(2017,1,1,0,minute,second,0),
                event:d.event,
                score:d.score
            });
            //    console.log(minute+":"+second);
            //    console.log(d);
        }, function(error, classes) {
            $scope.fencingData.events=[];
            $scope.fencingData.rounds=[];
            var s1=0;
            var s2=0;
            var index=0;
            var lastE;
            var bRemoveInvalid=true;    // whether remove the invalid time span
            if(bRemoveInvalid)
            {
                var timeBias=0;
                $scope.fencingData.series.forEach(function(d){
                    if(d.event=="start") {
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
                        $scope.fencingData.events.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 1,
                            score: s1
                        })
                        $scope.fencingData.events.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 2,
                            score: s2
                        })
                        $scope.fencingData.rounds.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: scoredPlayer
                        })
                        index++;
                    }
                    lastE=d;
                });

            }
            else
                $scope.fencingData.series.forEach(function(d){
                    if(d.event=="start"){
                        lastE=d;
                    }
                    else{

                        if(d.score==1) s1++;
                        if(d.score==2) s2++;
                        $scope.fencingData.events.push({
                            start:lastE.time,
                            time: d.time,
                            index: index,
                            player: 1,
                            score: s1
                        })
                        $scope.fencingData.events.push({
                            start:lastE.time,
                            time: d.time,
                            index: index,
                            player: 2,
                            score: s2
                        })
                        index++;
                    }
                });
            console.log("updated data")

            $scope.$apply();

            if (error) throw error;
        });
    }
    // version 2 of readData, added the behavior of two players
    var fileName="../data/men_final.csv";
    function readData(){
        $scope.fencingData.series=[];
        $scope.fencingData.events=[];
        $scope.fencingData.rounds=[];
        $scope.tacticsData={
            Data:[ ]
            ,
            Results:[
                {count:1,player1:0,player2:0}
                ,{count:1,player1:0,player2:0}
                ,{count:1,player1:0,player2:0}
                ,{count:1,player1:0,player2:0}
            ]
        }
        d3.csv(fileName, function(d) {
            var arrTime=d.time.split(':');
            var minute=arrTime[0];
            var second=arrTime[1];
            $scope.fencingData.series.push({
                time: new Date(2017,1,1,0,minute,second,0),
                event:d.event,
                score:d.score,
                player1:d.player1,
                player2:d.player2
            });
            //    console.log(minute+":"+second);
            //    console.log(d);
        }, function(error, classes) {
            var s1=0;
            var s2=0;
            var index=0;
            var lastE;
            var bRemoveInvalid=true;    // whether remove the invalid time span
            if(bRemoveInvalid)
            {
                var timeBias=0;
                $scope.fencingData.series.forEach(function(d){
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
                        $scope.fencingData.events.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 1,
                            score: s1
                        })
                        $scope.fencingData.events.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: 2,
                            score: s2
                        })
                        $scope.fencingData.rounds.push({
                            start:new Date(lastE.time.getTime()-timeBias),
                            time: new Date(d.time.getTime()-timeBias),
                            index: index,
                            player: scoredPlayer
                        })
                        index++;
                    }
                    lastE=d;
                });

            }
            else
                $scope.fencingData.series.forEach(function(d){
                    if(d.event=="s"){
                        lastE=d;
                    }
                    else{

                        if(d.score==1) s1++;
                        if(d.score==2) s2++;
                        $scope.fencingData.events.push({
                            start:lastE.time,
                            time: d.time,
                            index: index,
                            player: 1,
                            score: s1
                        })
                        $scope.fencingData.events.push({
                            start:lastE.time,
                            time: d.time,
                            index: index,
                            player: 2,
                            score: s2
                        })
                        index++;
                    }
                });
            console.log("updated data")

            /*
            $scope.fencingData.events.forEach(function(d){
                console.log(d);
            })
            */

            // for tactics information
            $scope.tacticsData.Data=[];
            var state=-1;
            var index=1;
            var tactic1="";
            var tactic2="";
            var score=0
            $scope.fencingData.series.forEach(function(d){
                if(d.event=="s") {
                    if(state>-1){
                        $scope.tacticsData.Data.push({
                            name:index
                            ,tactic1:tactic1
                            ,tactic2:tactic2
                            ,score:score
                        });
                        index+=1;
                    }
                    state=1;
                }
                else{
                    if(state==1){
                        tactic1=d.player1[0]=="a"? "a":"r";
                        tactic2=d.player2[0]=="a"? "a":"r";
                        state=2;
                    }
                    score=d.score;
                }
            });
            // add the last one
            $scope.tacticsData.Data.push({
                name:index
                ,tactic1:tactic1
                ,tactic2:tactic2
                ,score:score
            });

            // the tactic result matrix
            $scope.tacticsData.Data.forEach(function(d){
                var index=-1;

                if(d.tactic1=="a")
                    if(d.tactic2=="a") index=0;
                    else index=1;
                else
                    if(d.tactic2=="a") index=2;
                    else index=3;

                $scope.tacticsData.Results[index].count++;
                if(d.score==1) $scope.tacticsData.Results[index].player1++;
                if(d.score==2) $scope.tacticsData.Results[index].player2++;

            })
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



