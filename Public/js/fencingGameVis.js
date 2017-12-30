/*
 grid rule:
 1.subgraph of the svg. tried to posite it under the svgBG, but that seems more difficult
 2.using xScale to set its x coordinate
 3.using -margin.top as its y coordinate, and bgH as its height

 modify paperVis to a new version

 using bar to represent nodes
 2016/11/21
 */
mainApp.directive('fencingGameVis', function () {
    //console.log("myTree Initializing");
    function link(scope, el, attr) {

        function getTime(d){
            return d.time;
        }
        function getIndex(d){
            return d.index;
        }
        function fencingGameVis(){
            el = el[0];

            //var xTreeScale=d3.scale.linear();
            var xTreeScale=d3.time.scale();
            var yTreeScale=d3.scale.linear();
            var axisTick=10;
            var svgTreeW;
            var svgTreeH;
            var svgTreeBGW;
            var svgTreeBGH
            var tree = { cx: 300
                , cy: 30
                , w: 40
                , h: 70
                , nodes: []
                , references: []
                , from:{}
                , to:{} };
            var xMin,xMax,indexMin,indexMax;                  // the min and max of the year, inited in reposite
            var margin = {top: 20, right: 40, bottom: 50, left: 30};
            var orient='bottom';

            var grids=[];
            var gridW=0;        // the width of the grid, calculated in reposite()

            // append a svg to show the tree
            var svgTreeBG=d3.select(el).append("svg");
            var svgTree=svgTreeBG.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //    var svg = d3.select(el).append("svg").attr("width", svgW).attr("height", svgH);

            // the grid background
            var svgGrids=svgTree.selectAll('.grid')

            // svg-lines
            var svgEdges=svgTree.selectAll('.reference');//.append('g').attr('id', 'g_lines');
            var svgEdgesV=svgTree.selectAll('.referenceV');//.append('g').attr('id', 'g_lines');

            // svg-circles
            var svgNodes=svgTree.selectAll('.node');

            // svg-text
            var svgInfo=svgTree.selectAll('.info')

            // axis
            var xTreeAxis=svgTree.append('g').attr('id','g_axis');

            // ==========Operations==========

            // get all the nodes of the tree
            tree.getNodes = function () {
                var nodes = scope.data.events;

                // 1.Calculate x domain
                xMin=d3.min(nodes,function(d){return getTime(d);});
                xMax=d3.max(nodes,function(d){return getTime(d);});
            //    console.log(nodes);
                indexMin=d3.min(nodes,function(d){return getIndex(d);});
                indexMax=d3.max(nodes,function(d){return getIndex(d);});

                // 2.Calculate y domain
                var statistic =[];
                for(var i=indexMin;i<=indexMax;i++) statistic.push(0);
                // 2.1.calculate y for each nodes
                nodes.forEach(function (d) {
                    d.y=statistic[getIndex(d)-indexMin]++;
                });
                var yMin=d3.min(nodes,function(d){return d.score;});
                var yMax=d3.max(nodes,function(d){return d.score;})
                // 2.2.put them to the middle


                // 2.reset scale and axis
            //    if(xMin==xMax) xMin--;
            //    if(yMin==yMax) yMax++;
                axisTick=xMax-xMin;
                console.log(xMin)
                console.log(xMax)
                xTreeScale.domain([xMin,xMax]);
                yTreeScale.domain([yMax,yMin]);

            //    grids=[];
            //    for(var i=xMin;i<=xMax;i+=2){
            //        grids.push(i);
            //    }
            //    gridW=xTreeScale(xMax)-xTreeScale(xMax-1);

                return nodes;
            }
            // get all the edges of the tree
            tree.getEdges = function () {
                if(scope.data.clustering==0||scope.data.operationMode==5) return this._getEdges();
                else return this._getEdgesClustered();
            }

            // get all the edges of the tree
            tree._getEdges = function () {
                tree.references = [];
                //console.log("GetEdges: the number of nodes is: "+tree.nodes.length);
                var e = [];
                function getEdges(_) {
                    // 0.reset citeCount for each node
                    _.nodes.forEach(function(d){
                        d.citeCount=0;
                    });
                    // 1.iterate the references
                    _.references.forEach(function (d) {
                        // 1.1.get the end of the reference
                        var from= _.nodes.filter(function(obj) { return obj._id == d.from })[0];
                        var to= _.nodes.filter(function(obj) { return obj._id == d.to })[0];
                        if(from&&to)
                        {
                            // 1.2.push the edge
                            //    console.log("push edge:"+ d.from+":"+d.to);
                            //    console.log(from);
                            //    console.log(to);
                            e.push({
                                id: d._id
                                ,source: { y: xTreeScale(getTime(from))  ,x:yTreeScale(from.y),id:from.id }
                                ,target: { y: xTreeScale(getTime(to))    ,x:yTreeScale(to.y),id:to.id }
                                ,citing: d.citing
                                ,cited: d.cited
                                ,referred: d.referred
                                ,focused: d.focused
                                ,selected: d.selected
                                ,type: d.type
                            });
                            // 1.3.increase the cite count
                            to.citeCount++;
                        }
                    });
                }

                getEdges(tree);
                //console.log("getEdge: number of edges:"+ e.length);
                return e.sort(function(a,b){
                    if(a.focused) return 1;
                    if(a.selected) return 1;
                    if(a.referred) return 1;
                    if(a.citing) return 1;
                    if(a.cited) return 1;
                    return -1;
                });
            }

            // watch the size of the window
            scope.$watch(function () {
                //    console.log("watching===============svgTreeBG")
                svgTreeBGW = el.clientWidth;
                svgTreeBGH = el.clientHeight;
                if(svgTreeBGW<800) svgTreeBGW=800;
                if(svgTreeBGH<400) svgTreeBGH=400;
                return svgTreeBGW + svgTreeBGH;
            }, resize);

            // response the size-change
            function resize() {
                //    console.log("====================rezize Tree=====================")
                //    console.log(svgTreeW);
                //    console.log(svgTreeH);
                svgTreeBG.attr({ width: svgTreeBGW, height: svgTreeBGH });
                svgTreeW=svgTreeBGW-margin.left-margin.right;
                svgTreeH=svgTreeBGH-margin.top-margin.bottom;

                //    axisHeight = svgH - margin;
                xTreeScale.range([0,svgTreeW]);
                // *2 is for the axis
                yTreeScale.range([0,svgTreeH]);
                //console.log("SVGH:"+svgTreeH);
                redraw();
            }

            function renderAxis(scale, orient){
                var axis = d3.svg.axis() // <-D
                    .scale(scale) // <-E
                    .orient(orient) // <-F

                //    .ticks(axisTick); // <-G
                xTreeAxis
                    .attr("transform", "translate(0," + (svgTreeH+10) + ")")
                    .call(axis.tickFormat(d3.time.format("%M:%S")))
            }

            // redraw grid
            function _drawGrid(){
                svgGrids=svgGrids.data(grids);
                svgGrids
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return xTreeScale(d)-gridW/2.0; })
                    .attr("width", gridW)
                    .attr("y", -margin.top )
                    .attr("height", svgTreeBGH )
                    .style("opacity",.1);
                svgGrids
                    .attr("x", function(d) { return xTreeScale(d)-gridW/2.0; })
                    .attr("width", gridW)
                    .attr("y", -margin.top )
                    .attr("height", svgTreeBGH )
                    .style("opacity",.1);
                svgGrids.exit()
                    .remove();
            }

            // redraw info
            function _drawInfo(){
                svgInfo=svgInfo.data(scope.data.selectedInfo);
                svgInfo.attr("x",5)
                    .attr("y",function(d,i){return 20+i*20;})
                    .text(function(d){return d;});
                svgInfo.enter().append('text')
                    .attr("x",5)
                    .attr("y",function(d,i){return 20+i*20;})
                    .text(function(d){return d;});
                svgInfo.exit().remove();

                tree.nodes=tree.getNodes();         // this should be called before tree.getEdges
            }

            // redraw nodes
            function _drawNodes(reload){
                if(reload){
                    // this two line used to remove the old circles, or they will be hide by the background and links
                    // 2016/08/09
                    svgNodes = svgNodes.data([]);
                    svgNodes.exit().remove();
                }
                svgNodes = svgNodes.data(tree.nodes);


                var nodeGroup=svgNodes.enter().append('svg:g');

                nodeGroup
                    .append('rect')
                    .classed('node',true)
                    .attr("width",function(d){
                        return d.citeCount;
                    })
                    .attr("height",6)
                    .attr("x",function(d){
                        return -d.citeCount/2;
                    })
                    .attr("y",-3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                    //    console.log(getTime(d));
                    //    console.log(xTreeScale(getTime(d)));
                        return "translate(" +  xTreeScale(getTime(d)) + ", " +  yTreeScale(d.score) + ")";
                    });

                nodeGroup
                    .append('rect')
                    .attr("fill","yellow")
                    .attr("fill-opacity",0.1)
                    .attr("stroke",function(d){
                        if(d.player==1) return 'red';
                        else if(d.player==2) return 'blue';
                        else return 'grey'
                    })
                    //.attr("stroke","blue")
                    .attr("width",20)
                    .attr("height",6)
                    .attr("x",-10)
                    .attr("y",-3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                        return "translate(" +  xTreeScale(getTime(d)) + ", " +  yTreeScale(d.score) + ")";
                    })
                    .on('mouseenter', function (d) {
                        // console.log("mouse enter");
                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                    })
                    .on('mouseover', function (d) {
                        // console.log("mouse over");
                        scope.$apply(function () {
                            scope.data.onSelectedNode(d,redrawWithoutUpdate);
                        });

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedNode();
                        redrawWithoutUpdate();
                    });

                // without this, the page won't update when an node is deleted
                svgNodes.exit().remove();
            }

            // redraw edges
            function _drawEdges(reload){
                // get all the edges
                var allEdges=tree.getEdges();

                // separate the horizontal edges and the vertical edges
                var horizontalEdges=allEdges.filter(function(e){
                    return e.source.y!= e.target.y;
                });

                var verticalEdges=allEdges.filter(function(e){
                    return e.source.y == e.target.y;
                });

                function _redrawHEdge(reload){
                    svgEdges = svgEdges.data(horizontalEdges);
                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.y, d.x]; });

                    function _updateEdge(edge){
                        edge
                            .classed('citing', function(d){return d.citing;})
                            .classed('cited', function(d){return d.cited;})
                            .classed('focused',function(d){return d.focused;})
                            .classed('referred',function(d){return d.referred;})
                            .classed('selected',function(d){return d.selected;})
                            //    .classed('contrast',function(d){return d.type%2;})
                            //    .classed('rely',function(d){return Math.floor(d.type/2)%2;})
                            //    .classed('context',function(d){return Math.floor(d.type/4)%2;})
                            .attr("d", diagonal);
                    }
                    _updateEdge(svgEdges);
                    _updateEdge(svgEdges.enter().append("path")
                        .classed('reference',true)
                        .on('click', function (d) {
                            _onClickLink(d);
                        }));
                    svgEdges.exit().remove();
                }
                function _onClickLink(d){
                    // console.log("click link");
                    // console.log(d);
                    if(scope.data.operationMode==3){
                        //console.log(d.id);
                        //console.log(d._id);

                        scope.data.removeReference(d.from,d.to,function(){
                            redraw();
                        });
                        return;
                    }
                    //console.log("edge.click"+ d.id);
                    // 0.set all the edges unselected
                    //edges.classed('selected',false);
                    //// 1.set this edge selected
                    //d3.select(this).classed('selected',true);
                    // 2.update the selected style
                    scope.$apply(function () {
                        onSelectedReference(d);
                    });
                }

                function _redrawVEdge(reload){

                    //svgEdgesV = svgEdgesV.data([]);
                    //svgEdgesV.exit().remove();
                    svgEdgesV = svgEdgesV.data(verticalEdges);
                    //var diagonal1 = d3.svg.diagonal()
                    //    .projection(function(d) { return [d.y-10, d.x]; });
                    //var diagonal2 = d3.svg.diagonal()
                    //    .projection(function(d) { return [d.y-10, d.x]; });

                    //svgEdgesV
                    ////.transition()
                    //    .classed('citing', function(d){return d.citing;})
                    //    .classed('cited', function(d){return d.cited;})
                    //    .classed('focused',function(d){return d.focused;})
                    //    .classed('referred',function(d){return d.referred;})
                    //    .classed('selected',function(d){return d.selected;})
                    //    //    .classed('contrast',function(d){return d.type%2;})
                    //    //    .classed('rely',function(d){return Math.floor(d.type/2)%2;})
                    //    //    .classed('context',function(d){return Math.floor(d.type/4)%2;})
                    //    .attr("d", diagonal);

                    function _setEdge(edge){
                        edge
                            .attr("d",function(d) {
                                var skew= d.source.x> d.target.x?50:-50;
                                return "M" + d.source.y + "," + d.source.x
                                    + "S" + (d.source.y+skew) + "," +(d.source.x+ d.target.x)/2
                                    + " " + d.target.y + "," + d.target.x;
                            })
                            .classed('citing', function(d){return d.citing;})
                            .classed('cited', function(d){return d.cited;})
                            .classed('focused',function(d){return d.focused;})
                            .classed('referred',function(d){return d.referred;})
                            .classed('selected',function(d){return d.selected;})
                        //    .classed('contrast',function(d){return d.type%2;})
                        //    .classed('rely',function(d){return Math.floor(d.type/2)%2;})
                        //    .classed('context',function(d){return Math.floor(d.type/4)%2;})
                        //    .attr("stroke", "blue")
                        //    .attr("stroke-width", "2")
                    }
                    _setEdge(svgEdgesV);
                    _setEdge(svgEdgesV.enter().append("path")
                        .classed('reference',true)
                        .on('click', function (d) {
                            _onClickLink(d);
                        }));

                    svgEdgesV.exit().remove();
                }

                _redrawHEdge(reload);

                _redrawVEdge(reload);
            }


            // redraw the svg without update
            function redrawWithoutUpdate(){
                _redraw(false);
            }

            // redraw the svg
            function redraw(){
                _redraw(true);
            }
            // redraw the svg
            function _redraw(reload){
                //console.log("=====redraw tree=====");
                if (!scope.data) { return };
                //var drawMode=1; // define the style of the glyph

                // draw grids
                _drawGrid();

                _drawInfo();
                // redraw edges
                _drawEdges(reload);

               _drawNodes(reload);

               renderAxis(xTreeScale , orient);

                //console.log("=====redraw tree=====");
                //console.log(scope.data);

            }
            function onClick(d){
                //console.log("click");
                if(scope.data.operationMode==2){
                    var r = confirm("Would you like to remove article: '"+ d.name+"'!");
                    if (r == true) { scope.$apply(function () {
                        // remove this one
                        //console.log("=====remove nodes");
                        scope.data.removeArticle(d.id,function(){
                            scope.data.selectedNode={};
                            redraw();
                        });
                    });
                    } else {
                        console.log("remove canceled");
                    }

                }
                else if(scope.data.operationMode==4){
                    scope.data.onNavigation(d,1);
                }
                else if(scope.data.operationMode==5){
                    scope.data.onAddNavigation(d);
                }
                else{
                    d.focused=!d.focused;
                    updateReferenceRefer();
                    /*
                     if(d.focused){
                     d3.select(this).classed('focused',true);
                     onSelectedNode(d,true);
                     }
                     else{
                     d3.select(this).classed('focused',false);
                     onUnSelectedNode(true);
                     }
                     */
                }
            }
            // watch the change of the data
            scope.$watch('data', redraw);
            scope.$watch('data.clustering', redraw);
            scope.$watch(function(){
                return scope.data.nodes;
            }, redraw);
        }
        fencingGameVis();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=', selectedPoint: '=' }
    };
});
