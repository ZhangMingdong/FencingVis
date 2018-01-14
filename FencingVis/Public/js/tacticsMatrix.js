







mainApp.directive('tacticsMatrix', function () {
    function link(scope, el, attr) {
        function matrix(){


            var w = 500,
                h = 500,
                xScale = d3.scale.linear().range([0, w]).domain([0,1]),
                yScale = d3.scale.linear().range([0, h]).domain([0,1]);

            var vis = d3.select(el[0]).append("div")
                .attr("class", "chart")
                .style("width", w + "px")
                .style("height", h + "px")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h);

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgWidth = el[0].clientWidth;
                svgHeight = el[0].clientHeight;
            //    if(svgWidth<600) svgWidth=600;
            //    if(svgHeight<400) svgHeight=400;

                return svgWidth + svgHeight;
            }, resize);
            // response the size-change
            function resize() {
            //    console.log("====================resize barChart=================");
            //    console.log(svgWidth);
            //    console.log(svgHeight);
                redraw();
            }

            function redraw(){
                var data=scope.data.statistics;
                // generate graphics from matrix data
                function generateMatrix(data){
                    var result=[];
                    var sum=data[0].count+data[1].count+data[2].count+data[3].count;
                    var w1=(data[0].count+data[1].count)/sum;
                    var h1=(data[0].count+data[2].count)/sum;
                    var result = [{
                        x:0,
                        y:0,
                        w:w1,
                        h:h1
                    },{
                        x:0,
                        y:h1,
                        w:w1,
                        h:1-h1
                    },{
                        x:w1,
                        y:0,
                        w:1-w1,
                        h:h1
                    },{
                        x:w1,
                        y:h1,
                        w:1-w1,
                        h:1-h1
                    }
                    ]
                    return result;

                }
                function generateGrid(data){

                    var result=[];
                    var sum=data[0].count+data[1].count+data[2].count+data[3].count;
                    var l=data[0].count+data[1].count;
                    var t=data[0].count+data[2].count
                    var w1=l/sum;
                    var h1=t/sum;
                    var coordinate = [{
                        x:0,
                        y:0,
                        w:l,
                        h:t
                    },{
                        x:0,
                        y:t,
                        w:l,
                        h:sum-t
                    },{
                        x:l,
                        y:0,
                        w:sum-l,
                        h:t
                    },{
                        x:l,
                        y:t,
                        w:sum-l,
                        h:sum-t
                    }
                    ]
                    for(var i=0;i<4;i++){       // for each region
                        var x=0;
                        var y=0;
                        for(var j=0;j<data[i].player1;j++){
                            result.push({
                                x:(coordinate[i].x+x)/sum,
                                y:(coordinate[i].y+y)/sum,
                                w:1/sum,
                                h:coordinate[i].h/sum,
                                score:1
                            })
                            x+=1;
                        }
                        // player 2
                        x=0;
                        y=0;
                        console.log(data[i].player2);
                        for(var j=0;j<data[i].player2;j++){
                            result.push({
                                x:(coordinate[i].x+coordinate[i].w-x-1)/sum,
                                y:(coordinate[i].y+y)/sum,
                                w:1/sum,
                                h:coordinate[i].h/sum,
                                score:2
                            })
                            x+=1;
                        }
                    }
                    return result;
                }





                // the matrix
                var matrix = vis.selectAll("g")
                    .data(generateMatrix(data))
                    .enter().append("svg:rect")
                matrix
                    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
                    .attr("width", function(d){return xScale(d.w);})
                    .attr("height", function(d) { return yScale(d.h)})
                    .attr("fill","gray")
                    .attr("stroke","gold")

                // the score grid


                var grid = vis.selectAll(".grid")
                    .data(generateGrid(data))
                    .enter().append("svg:rect")
                grid
                    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
                    .attr("width", function(d){return xScale(d.w);})
                    .attr("height", function(d) { return yScale(d.h)})
                    .attr("fill",function(d){return d.score==1?"red":"blue"})
                    .attr("stroke","purple")

            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.statistics', redraw);

        }
        matrix();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});


