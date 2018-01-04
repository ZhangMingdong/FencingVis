var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('MainCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() })

    // for workspace
    $scope.newWorkspaceName="";





    $scope.forceLayoutData={
        nodes: []
        ,labelAnchors: []
        ,labelAnchorLinks: []
        ,links: []
    }
    for(var i = 0; i < 30; i++) {
        var node = {
            label : "node " + i
        };
        $scope.forceLayoutData.nodes.push(node);
        $scope.forceLayoutData.labelAnchors.push({
            node : node
        });
        $scope.forceLayoutData.labelAnchors.push({
            node : node
        });
    };
//    $scope.forceLayoutData.nodes.forEach(function(d){
//        console.log(d);
//    })
    for(var i = 0; i < $scope.forceLayoutData.nodes.length; i++) {
        for(var j = 0; j < i; j++) {
            if(Math.random() > .95)
                $scope.forceLayoutData.links.push({
                    source : i,
                    target : j,
                    weight : Math.random()
                });
        }
        $scope.forceLayoutData.labelAnchorLinks.push({
            source : i * 2,
            target : i * 2 + 1,
            weight : 1
        });
    };
    //console.log("MainCtrl Initializing");
    // 0.declare data
    // $scope.selectedNode={
//
    // }
    /* operation mode
        0: no operation
        1: Draw reference
        2: Remove Article
        3: Remove Reference
        4: Navigation
        5: Navigation 2

     */
    //console.log("==selectedNode=="+$scope.selectedNode.info);
    $scope.treeData = {operationMode:0
        ,clustering:0
    //    , nodes: []
    //    , allNodes:[]
    //    , references: []
    //    , selectedTopic: null
//        , topicFilter:[]                        // the global filter state of topics
//        , topicTree:[]                          // data used for the topic tree view
//        , articleTpcs:[]
        , selectedTopic:""
        , noTopicOnly:false
        , selectedNode:{}
        , selectedReference:{}
        , selectedReferenceInfo:{}
        , availableReferenceType: [
            {id:1
                ,name: 'Contrast'
                ,belong: false}
            ,{id:2
                ,name: 'Rely'
                ,belong: false}
            ,{id:4
                ,name: 'Context'
                ,belong: false}
        ]
        , series:[]
        , seriesSort:0          // 0:by Count,1:by Alphabetic
        , authorsSort:0          // 0:by Count,1:by Alphabetic
        , keywordsSort:0          // 0:by Count,1:by Alphabetic
        , papersSort:0              //
        , searchOpinion:0           // 0: show results in context;1:show results only
        , authors:[]
        , keywords:[]
        , selectedInfo:[]           // used for the selected node information display
        , paperCount:0              // total paper count
        , showReferenceType: false  // show the types of reference
        , setSubTopicTo:false
        , topicToMove:{}
    };

    // get the article list
    $scope.treeData.getArticles=function(){
        return ArticleInfo.getArticles();
    }
    // get the references
    $scope.treeData.getReferences=function(){
        return ArticleInfo.getReferences();
    }
    // page state
    $scope.pageState={
        topic:true
        ,series:true
        ,author:true
        ,keywords:true
        ,paperList:true
    }


    // 1.get nodes and reference
    callForNodes();

    // 2.get references
    // transmitated into callFroNodes

    // 3.get topics


    function callForReference(){
    //    console.log("call For Reference");
        $http.get('/api/references')
            .success(function (data) {
            //    console.log("==getReference==");
                updateReferences(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }




    // call the server for nodes
    function callForNodes(){

    }
    function ucFirst(string) {
        return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    }
    // update the nodes
    // use the data to update tree.allNodes and tree.nodes
    function updateNodes(data){
        //console.log("update nodes");
        var newAllNodes=[];
        data.forEach(function (d) {
            if (checkYearRange(d.year)){
                var authorL=[];
                if(d.authors){
                    d.authors.split(";").forEach(function(str){
                        authorL.push(str.trim());
                    });
                    //   console.log(authorL);
                }
                var keywordsL=[];
                if(d.keywords){
                    d.keywords.split(",").forEach(function(str){
                        keywordsL.push(ucFirst(str.trim()));
                    });
                    //   console.log(authorL);
                }
                newAllNodes.push({
                    id: d._id
                    ,year: d.year
                    ,name: d.name
                    ,source: d.source
                    ,abstract: d.abstract
                    ,notes: d.notes
                    ,type: d.type
                    ,authors: d.authors
                    ,authorList: authorL
                    ,keywords: d.keywords
                    ,keywordsList: keywordsL
                    ,focused: d.root==1
                    ,citeCount:0
                    ,citeCountSameYear:0
                    ,distance:0
                });
                var series=$scope.treeData.series.filter(function(s){return s.name== d.source});
                if(series.length==0) $scope.treeData.series.push({
                    name: d.source
                    ,count:1                    // count of articles
                    ,visCount:0                // count of visible articles
                    ,hiddenRelatedCount:0    // count of hidden but related articles
                    ,include:false              // included in this series
                    ,exclude:false              // excluded in this series
                });
                else series.forEach(function(s){s.count++;});

                if(authorL.length){
                    authorL.forEach(function(author){
                        //   console.log(author);
                        var authors=$scope.treeData.authors.filter(function(a){return a.name==author;});
                        if(authors.length==0) $scope.treeData.authors.push({
                            name: author
                            ,count:1                    // count of articles
                            ,visCount:0                // count of visible articles
                            ,hiddenRelatedCount:0    // count of hidden but related articles
                            ,include:false              // included in this series
                            ,exclude:false              // excluded in this series
                        });
                        else authors.forEach(function(s){s.count++;});
                    });
                }

                if(keywordsL.length>0){
                    keywordsL.forEach(function(kws){
                        //   console.log(author);
                        var kwsInGlobalData=$scope.treeData.keywords.filter(function(gkws){return gkws.name==kws;});
                        if(kwsInGlobalData.length==0) $scope.treeData.keywords.push({
                            name: kws
                            ,count:1                    // count of articles
                            ,visCount:0                // count of visible articles
                            ,hiddenRelatedCount:0    // count of hidden but related articles
                            ,include:false              // included in this series
                            ,exclude:false              // excluded in this series
                        });
                        else kwsInGlobalData.forEach(function(s){s.count++;});
                    });
                }
            }
        });
        //   $scope.treeData.authors.forEach(function(d){
        //       console.log(d);
        //   });

        // reverse the array for display, this is temporately, a better method should be considered
        //    newAllNodes.sort(function(a,b){
        //        if(a.name> b.name) return -1;
        //        else if(a.name< b.name) return 1;
        //        else return 0;
        //    });
        $scope.treeData.paperCount=newAllNodes.length;
    //    $scope.treeData.allNodes=newAllNodes;
        ArticleInfo.load(newAllNodes);
    //    $scope.onFilter();
        redraw();
    }
    // sort by field count
    function sortByCount(a,b){
        if(a.count== b.count){
            if(a.name> b.name) return 1;
            else if (a.name< b.name) return -1;
            else return 0;
        }
        return b.count- a.count;
    }
    function sortByCiteCount(a,b){
        if(a.citeCount== b.citeCount){
            if(a.name> b.name) return 1;
            else if (a.name< b.name) return -1;
            else return 0;
        }
        return b.citeCount- a.citeCount;
    }

    // sort by field visCount
    function sortByVisCount(a,b){
        if(a.visCount== b.visCount){
            if(a.name> b.name) return 1;
            else if (a.name< b.name) return -1;
            else return 0;
        }
        return b.visCount- a.visCount;
    }

    function sortByAlphabetic(a,b){
        if(a.name> b.name) return 1;
        else if (a.name< b.name) return -1;
        else return 0;
    }
    // update the reference
    function updateReferences(data){
        //    console.log("updateReference");
        var newReferences=[];
        data.forEach(function (d) {
            var dType= d.type;
            if (!dType) dType=0;
            newReferences.push({
                id: d._id
                , from: d.from
                , to: d.to
                , citing: false
                , cited: false
                , selected:false
                , referred: false
                , focused: false
                , type: dType
            });
        });
        //    if(invalidReference.length>0){
        //        invalidReference.forEach(function(d){
        //            $http.delete('/api/reference/' + d._id);
        //        });
        //    }
        $scope.treeData.references = newReferences;

    }


    // called when select a reference
    var onSelectedReference_old=function(reference){
        console.log("select reference");
        // 1.clear the state of all the references
        //$scope.treeData.references.forEach(function(d){
        //    d.selected=false;
        //});

        // 2.get the according references in the treeData
        var selectedReferences=$scope.treeData.references.filter(function(d){return d.id==reference.id});
        if(selectedReferences.length==0) return;
        $scope.treeData.selectedReference=selectedReferences[0];

        $scope.treeData.selectedReference.selected=true;

        // 3.get the related articles
        var fromNode=$scope.treeData.allNodes.filter(function(d){return d.id==$scope.treeData.selectedReference.from;})[0].name;
        var toNode=$scope.treeData.allNodes.filter(function(d){return d.id==$scope.treeData.selectedReference.to;})[0].name;

        // 4.record the selected reference info
        $scope.treeData.selectedReferenceInfo={
            from:fromNode
            ,to:toNode
        }

        // 5.update the reference type area
        var type=reference.type;
        //console.log(type);
        for(var i=0;i<3;i++){
            if (type%2) $scope.treeData.availableReferenceType[i].belong=true;
            else $scope.treeData.availableReferenceType[i].belong=false;
            type=Math.floor(type/2);
        }

        redraw();
    }

    var onSelectedReference=function(reference){
        console.log("select reference");
         //1.clear the state of all the references
        $scope.treeData.getReferences().forEach(function(d){
            d.selected=false;
        });

        // 2.get the according references in the treeData
        var selectedReferences=$scope.treeData.getReferences().filter(function(d){
            //console.log(d);
            //console.log(reference);
            return d._id==reference.id});
        if(selectedReferences.length==0) return;
        $scope.treeData.selectedReference=selectedReferences[0];
        console.log($scope.treeData.selectedReference);

        $scope.treeData.selectedReference.selected=true;
        // 3.get the related articles
        var fromNode=$scope.treeData.getArticles().filter(function(d){return d._id==$scope.treeData.selectedReference.from;})[0].name;
        var toNode=$scope.treeData.getArticles().filter(function(d){return d._id==$scope.treeData.selectedReference.to;})[0].name;
        // 4.record the selected reference info
        $scope.treeData.selectedReferenceInfo={
            from:fromNode
            ,to:toNode
        }
        console.log(fromNode);
        console.log(toNode);

        // 5.update the reference type area
        var type=reference.type;
        //console.log(type);
        for(var i=0;i<3;i++){
            if (type%2) $scope.treeData.availableReferenceType[i].belong=true;
            else $scope.treeData.availableReferenceType[i].belong=false;
            type=Math.floor(type/2);
        }

        redraw();
    }


    var updateReferenceRefer=function(){
        $scope.treeData.getReferences().forEach(function(r){
            r.referred=false;
        });
        $scope.treeData.getArticles().filter(function(n){return n.focused;})
            .forEach(function(n){
                $scope.treeData.getReferences().filter(function(r){
                    return r.to==n.id||r.from==n.id;
                }).forEach(function(r){
                    //console.log(d);
                    r.referred=true;
                });
            });
    }

    // triggered when change the reference type checkbox
    $scope.onReferenceType=function(){
        console.log("update reference");
        console.log($scope.treeData.selectedReference.id);
        if($scope.treeData.selectedReference.id){
            var type=0;
            var index=1;
            $scope.treeData.availableReferenceType.forEach(function(t){
                if(t.belong){
                    type+=index;
                }
                index*=2;
            });
            $scope.treeData.selectedReference.type=type;
            console.log("update reference type: "+type);
            $http.post('/api/updateReference', $scope.treeData.selectedReference)
                .success(function(d){
                    redraw();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }


    // clicked series sort opinion
    $scope.onSeriesSort = function(){
        if($scope.treeData.seriesSort==0) $scope.treeData.series.sort(sortByCount);
        else  if($scope.treeData.seriesSort==1) $scope.treeData.series.sort(sortByVisCount);
        else $scope.treeData.series.sort(sortByAlphabetic);
    }
    $scope.onAuthorsSort = function(){
        if($scope.treeData.authorsSort==0) $scope.treeData.authors.sort(sortByCount);
        else  if($scope.treeData.authorsSort==1) $scope.treeData.authors.sort(sortByVisCount);
        else $scope.treeData.authors.sort(sortByAlphabetic);
    }
    $scope.onKeywordsSort = function(){
        if($scope.treeData.keywordsSort==0) $scope.treeData.keywords.sort(sortByCount);
        else  if($scope.treeData.keywordsSort==1) $scope.treeData.keywords.sort(sortByVisCount);
        else $scope.treeData.keywords.sort(sortByAlphabetic);
    }

    $scope.onPapersSort = function(){
        //console.log("paper sort:"+$scope.treeData.papersSort);
        if($scope.treeData.papersSort==0) $scope.treeData.allNodes.sort(sortByCiteCount);
        //    else  if($scope.treeData.papersSort==1) $scope.treeData.allNodes.sort(sortByVisCount);
        else $scope.treeData.allNodes.sort(sortByAlphabetic);

        redraw();
    }

    // triggered when the filter is changed
    // update the nodes
    $scope.onFilter=function() {

    }

    // clear Search text and results
    $scope.clearSearch=function(){
        $scope.treeData.searchText="";
        $scope.treeData.searchResultCount=0;
        $scope.treeData.allNodes.forEach(function(d){
            d.focused=false;
        });
        redraw();
    }

    // triggered when changed the search opinion
    //$scope.onSearchOpinionChanged=function(){
    //    doSearch();
    //}


    // get the reference nodes of this node
    var getReferenceNodes=function(node){
        // get the reference from this root
        var fromRL = $scope.treeData.references.filter(function(r){
            return r.from==node.id;
        });
        var arrReferenceNodes=[];
        fromRL.forEach(function(r){
            ArticleInfo.get().forEach(function(node){
                if(node.id==r.to) arrReferenceNodes.push(node);
            });
        });
        return arrReferenceNodes;
    }

    // get nodes that cited this nodes
    var getCitedNodes=function(node){
        // get the reference from this root
        var fromRL = $scope.treeData.references.filter(function(r){
            return r.to==node.id;
        });
        var arrCitedNodes=[];
        fromRL.forEach(function(r){
            ArticleInfo.get().forEach(function(node){
                if(node.id==r.from) arrCitedNodes.push(node);
            });
        });
        return arrCitedNodes;

    }

    // get neighbors of a node
    var getNeighbors = function(node){
        var arrReferenceNodes=getReferenceNodes(node);
        var arrCitedNodes=getCitedNodes(node);
        arrReferenceNodes.forEach(function(d){
            if($.inArray(d,arrCitedNodes)==-1) arrCitedNodes.push(d);
        });
        return arrCitedNodes;
    }



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
    $scope.statisticData={
        Data:[
            {
                name:'1'
                ,all: 10
                ,count: 5
            }
            ,
            {
                name:'2'
                ,all: 10
                ,count: 6
            }
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
    function readData(){
        d3.csv("../data/male_final.csv", function(d) {
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
});

