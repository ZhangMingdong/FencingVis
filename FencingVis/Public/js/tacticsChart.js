/*
    chart to show the tactics of a fencing match
    author: Mingdong
    date: 2018/01/10
 */

mainApp.directive('tacticsChart', function () {
    function link(scope, el, attr) {
        function tacticsChart(){
            var svgWidth=400;
            var svgHeight=800;
            var margin = {top: 20, right: 20, bottom: 70, left: 40};
            var svgBG = d3.select(el[0]).append("svg");
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var topAxisSVG =svg.append("g").attr("class", "x axis");
            var bottomAxisSVG =svg.append("g").attr("class", "x axis");
            var yAxisSVG = svg.append("g").attr("class", "y axis");


            var bouts = svg.selectAll("bout");

            var scoresSVG=svg.selectAll("score");

            var tip1 = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>行动:</strong> <span style='color:red'>" + translateMotion(d.motion1)+"</span>";
                });
            var tip2 = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>行动:</strong> <span style='color:red'>" + translateMotion(d.motion2)+"</span>";
                });
            svg.call(tip1);
            svg.call(tip2);

            function translateMotion(str){
                var len=str.length;
                var result=""
                for(var i=0;i<len;i++){
                    if(str[i]=='a') result+="进攻";
                    else if(str[i]=='p') result+="防守";
                    else if(str[i]=='c') result+="抢攻";
                    else if(str[i]=='r') result+="还击";
                    else if(str[i]=='f') result+="前进";
                    else if(str[i]=='b') result+="后退";
                    else if(str[i]=='-') result+="持续";
                    else if(str[i]=='+') result+="错误动作";
                    else if(str[i]=='h') result+="停顿";
                }
                return result;
            }
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
                /*
                console.log("====================resize tactics chart=================");
                console.log(svgWidth);
                console.log(svgHeight);
                */
                redraw();
            }

            // get the display field
            var hA=.4;
            var hR=.2
            function getField1(d){
                if(d.tactic1=="a") return hA;
                else return hR;
            }
            function getField2(d){
                if(d.tactic2=="a") return hA;
                else return hR;
            }
            var scoreH=1-.1/15;
            function getScores(){
                return [
                    {
                        name: 1
                        ,y:.5
                        ,h:scoreH
                    }
                ];
            }

            function redraw(){
            //    console.log("===redraw tactics chart===")
                var data=scope.data.tactics;

                var width = svgWidth - margin.left - margin.right;
                var height = svgHeight - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)

                svg
                    .attr("width", width)
                    .attr("height", height)


                var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                var yScale = d3.scale.linear().range([height, 0]);

                var topAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")

                var bottomAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(10);


                xScale.domain(data.map(function(d) { return d.name; }));
                //y.domain([0, d3.max(data, function(d) { return getField(d); })]);
                yScale.domain([0, 1]);

                topAxisSVG
                    .call(topAxis)
                bottomAxisSVG
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(bottomAxis)

                /*
                yAxisSVG
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("");
                    */

                // these two lines are used to update the visualization
                {
                    bouts=bouts.data([])
                    bouts.exit()
                        .remove();
                }
                //console.log(data);
                //console.log(xScale.rangeBand());

                bouts=bouts.data(data);


                var g=bouts.enter().append("g");
                g.append("rect")
                    .attr("class", "bar")
                    .attr("id","player1")
                g.append("rect")
                    .attr("class", "bar")
                    .attr("id","player2")

                bouts.selectAll('rect')
                    .on('click',function(d){
                        scope.data.onClick(d.name);
                    });

                bouts.selectAll("#player1")
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.rangeBand())
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return height - yScale(getField1(d)); })
                    .attr("stroke","red")
                    .attr("fill",function(d){
                        if(d.score==1) return "red"
                        else if(d.score==2) return "gray"
                        return "lightgray";
                    })
                    .on('mouseover', tip1.show)
                    .on('mouseout', tip1.hide)

                bouts.selectAll("#player2")
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.rangeBand())
                    .attr("y", function(d) { return yScale(getField2(d)); })
                    .attr("height", function(d) { return height - yScale(getField2(d)); })
                    .attr("stroke","blue")
                    .attr("fill",function(d){
                        if(d.score==1) return "gray"
                        else if(d.score==2) return "blue"
                        return "lightgray";
                    })
                    .on('mouseover', tip2.show)
                    .on('mouseout', tip2.hide)

                bouts.exit()
                    .remove();


                // score grids
/*
                {
                    scoresSVG=scoresSVG.data([])
                    scoresSVG.exit()
                        .remove();
                }
                scoresSVG=scoresSVG.data(getScores());
                var scores=scoresSVG.enter().append("rect")
                    .attr("class", "bar");

                console.log(xScale.rangeBand());
                scores
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.rangeBand())
                    .attr("y", function(d) { return yScale(d.y) })
                    .attr("height", function(d) { return yScale(d.h); })
                    .attr("stroke","red")
                .attr("fill","green")

                scoresSVG.exit().remove();
                */
            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.tactics', redraw);

        }
        tacticsChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});

