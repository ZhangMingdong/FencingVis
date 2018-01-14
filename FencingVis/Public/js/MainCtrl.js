var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('MainCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() })

    // match selection
    $scope.matchList=["men final","men semifinal 1","men semifinal 2"];
    // selected Season
    $scope.selectedMatch="men final";

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
        ]                           // statistics of the tactic: 0-aa;1-ar;2-ra;3-rr
        , selectedNode:{}
        , selectedInfo:[]          // used for the selected node information display
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
            var score=0
            series.forEach(function(d){
                if(d.event=="s") {
                    if(state>-1){
                        tactics.push({
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
            tactics.push({
                name:index
                ,tactic1:tactic1
                ,tactic2:tactic2
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



            console.log(series);
            $scope.fencingData.series=series;
            $scope.fencingData.events=events;
            $scope.fencingData.bouts=bouts;
            $scope.fencingData.tactics=tactics;
            $scope.fencingData.statistics=statistics;

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



