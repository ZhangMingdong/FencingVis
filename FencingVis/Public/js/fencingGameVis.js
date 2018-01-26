/*
    dsp: directive to show the game view of fencing
    author: Mingdong
    logs:
        migrated to d3.v4
        2018/01/24
 */
mainApp.directive('fencingGameVis', function () {
    //console.log("myTree Initializing");
    function link(scope, el, attr) {
        // properties
        function getEnd(d){
            return d.time_end;
        }
        function getStart(d){
            return d.time_start;
        }
        function getIndex(d){
            return d.index;
        }

        function fencingGameVis(){
            el = el[0];
            // 0.definition

            // 0.1.scale
            var xGameScale=d3.scaleTime()
            var yGameScale=d3.scaleLinear();

            // 0.2.size
            var svgGameW=100;
            var svgGameH=100;
            var svgGameBGW=100;
            var svgGameBGH=100;
            var margin = {top: 20, right: 40, bottom: 100, left: 30};

            // 0.3.data
            var nodes=[];
            var grids=[];

            // 1.Add DOM elements
            // 1.1.append a svg as background
            var svgGameBG=d3.select(el).append("svg").attr("width",svgGameBGW).attr("height",svgGameBGH);

            // 1.2.add group for the game
            var svgGame=svgGameBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // 1.3.add two axes
            var xTreeAxis=svgGame.append('g')
            var yTreeAxis=svgGame.append('g')

            // 2.function
            // 2.1.get all the nodes of the tree
            var getNodes = function () {
                var nodes = scope.data.events;
            //    console.log(nodes)
                // 1.Calculate x domain
                var xMin=d3.min(nodes,function(d){return getStart(d);});
                var xMax=d3.max(nodes,function(d){return getEnd(d);});
            //    console.log(nodes);
                var indexMin=d3.min(nodes,function(d){return getIndex(d);});
                var indexMax=d3.max(nodes,function(d){return getIndex(d);});

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


                // calculate grid
                xGameScale.domain([xMin,xMax]);
                yGameScale.domain([yMax,yMin]);
                grids=[];
                var time_start,time_end;
                for(var i=0;i<nodes.length;i++){
                    if(nodes[i].score==8){
                        time_start=nodes[i].time_end;
                        if(i%2==0) time_end=nodes[i+2].time_start;
                        else time_end=nodes[i+1].time_start;
                        break;
                    }
                }
                grids.push({start:time_start,end:time_end});

                return nodes;
            }

            // 2.2.response the size-change
            function resize() {
                //    console.log("====================rezize=====================")

                svgGameBG.attr("width",svgGameBGW)
                    .attr("height",svgGameBGH);
                svgGameW=svgGameBGW-margin.left-margin.right;
                svgGameH=svgGameBGH-margin.top-margin.bottom;

                //    axisHeight = svgH - margin;
                xGameScale.range([0,svgGameW]);
                // *2 is for the axis
                yGameScale.range([0,svgGameH]);
                //console.log("SVGH:"+svgGameH);
                redraw();
            }

            // 2.3.render axes
            function renderAxis(){
                var axis = d3.axisBottom()
                    .scale(xGameScale) // <-E
                xTreeAxis
                    .attr("transform", "translate(0," + (svgGameH+10) + ")")
                    .call(axis
                        .tickFormat(d3.timeFormat("%M:%S")))


                var y_axis = d3.axisLeft()
                    .scale(yGameScale)
                yTreeAxis
                    .call(y_axis.ticks(15))
            }

            // 2.4.redraw grid
            function _drawGrid(){
                var svgGrids=svgGame.selectAll('.grid').data(grids);
                svgGrids
                    .enter().append("rect")
                    .classed("grid",true)
                    .attr("x", function(d) { return xGameScale(d.start)})
                    .attr("width", function(d) { return xGameScale(d.end)-xGameScale(d.start)})
                    .attr("y", -margin.top )
                    .attr("height", svgGameBGH )
                    .style("opacity",.1);
                svgGrids
                    .attr("x", function(d) { return xGameScale(d.start)})
                    .attr("width", function(d) { return xGameScale(d.end)-xGameScale(d.start)})
                    .attr("y", -margin.top )
                    .attr("height", svgGameBGH )
                    .style("opacity",.1);
                svgGrids.exit()
                    .remove();
            }

            // 2.5.redraw info
            function _drawInfo(){
                var svgInfo=svgGame.selectAll('.info').data(scope.data.selectedInfo);
                svgInfo.enter().append('text')
                    .classed("info",true)
                    .attr("x",5)
                    .attr("y",function(d,i){return 20+i*20;})
                    .text(function(d){return d;});

                svgInfo
                    .attr("x",5)
                    .attr("y",function(d,i){return 20+i*20;})
                    .text(function(d){return d;});
                svgInfo.exit().remove();

            }

            // 2.6.redraw events
            function _drawEvents() {


                var svgNodes = svgGame.selectAll(".node").data(nodes);

                svgNodes.enter()
                    .append('rect')
                    .classed("node",true)
                    .attr("fill", "yellow")
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", function (d) {
                        if (d.player == 1) return 'red';
                        else if (d.player == 2) return 'blue';
                        else return 'grey'
                    })
                    //.attr("stroke","blue")
                    .attr("width", function (d) {

                        return xGameScale(getEnd(d)) - xGameScale(getStart(d));
                    })
                    .attr("height", 6)
                    .attr("x", 0)
                    .attr("y", -3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                        return "translate(" + xGameScale(getStart(d)) + ", " + yGameScale(d.score) + ")";
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
                            scope.data.onSelectedNode(d, redraw);
                        });

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedNode();
                        redraw();
                    });

                svgNodes
                    .attr("fill", "yellow")
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", function (d) {
                        if (d.player == 1) return 'red';
                        else if (d.player == 2) return 'blue';
                        else return 'grey'
                    })
                    //.attr("stroke","blue")
                    .attr("width", function (d) {

                        return xGameScale(getEnd(d)) - xGameScale(getStart(d));
                    })
                    .attr("height", 6)
                    .attr("x", 0)
                    .attr("y", -3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                        return "translate(" + xGameScale(getStart(d)) + ", " + yGameScale(d.score) + ")";
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
                            scope.data.onSelectedNode(d, redraw);
                        });

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedNode();
                        redraw();
                    });

                // without this, the page won't update when an node is deleted
                svgNodes.exit().remove();
            }

            // 2.7.redraw bouts
            function _drawBouts(){
                var svgEvents=svgGame.selectAll(".event").data(scope.data.bouts);
                svgEvents.enter()
                    .append('rect')
                    .classed("event",true)
                    .attr("fill","yellow")
                    .attr("fill-opacity",0.1)
                    .attr("stroke",function(d){
                        if(d.player==1) return 'red';
                        else if(d.player==2) return 'blue';
                        else return 'grey'
                    })
                    //.attr("stroke","blue")
                    .attr("width",function(d){

                        return xGameScale(getEnd(d))-xGameScale(getStart(d));
                    })
                    .attr("height",20)
                    .attr("x",0)
                    .attr("y",-3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                        return "translate(" +  xGameScale(getStart(d)) + ", "+(svgGameH+40)+")";
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
                            scope.data.onSelectedNode(d,redraw);
                        });

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedNode();
                        redraw();
                    });

                svgEvents
                    .attr("fill","yellow")
                    .attr("fill-opacity",0.1)
                    .attr("stroke",function(d){
                        if(d.player==1) return 'red';
                        else if(d.player==2) return 'blue';
                        else return 'grey'
                    })
                    //.attr("stroke","blue")
                    .attr("width",function(d){

                        return xGameScale(getEnd(d))-xGameScale(getStart(d));
                    })
                    .attr("height",20)
                    .attr("x",0)
                    .attr("y",-3)
                    .attr("transform", function (d) {
                        // This is where we use the index here to translate the pie chart and rendere it in the appropriate cell.
                        // Normally, the chart would be squashed up against the top left of the cell, obscuring the text that shows the day of the month.
                        // We use the gridXTranslation and gridYTranslation and multiply it by a factor to move it to the center of the cell. There is probably
                        // a better way of doing this though.
                        var currentDataIndex = d[1];
                        return "translate(" +  xGameScale(getStart(d)) + ", "+(svgGameH+40)+")";
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
                            scope.data.onSelectedNode(d,redraw);
                        });

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedNode();
                        redraw();
                    });

                // without this, the page won't update when an node is deleted
                svgEvents.exit().remove();
            }

            // 2.8.redraw the svg
            function redraw(){
            //    console.log("redraw")
                if (!scope.data) { return };
                if(scope.data.bouts.length==0) return;


                nodes=getNodes();         // this should be called before tree.getEdges

                // draw grids
                _drawGrid();
                _drawInfo();

                _drawEvents();

                _drawBouts();

                renderAxis();
            }

            // 2.9.mouse event callback
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

            // watch the size of the window
            scope.$watch(function () {
                //    console.log("watching===============svgGameBG")
                svgGameBGW = el.clientWidth;
                svgGameBGH = el.clientHeight;
                if(svgGameBGW<600) svgGameBGW=600;
                if(svgGameBGH<200) svgGameBGH=200;
                return svgGameBGW + svgGameBGH;
            }, resize);
            // watch the change of the data
            scope.$watch('data', redraw);
            scope.$watchCollection('data.events', redraw);

        }

        fencingGameVis();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=', selectedPoint: '=' }
    };
});
