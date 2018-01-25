/*
    dsp: directive to show the tactics view of fencing
    author: Mingdong
    logs:
        migrated to d3.v4
        2018/01/24
 */
mainApp.directive('tacticsChart', function () {
    function link(scope, el, attr) {
        function tacticsChart(){
            // 0.definition

            // 0.1.size
            var svgTacticsBGW=400;
            var svgTacticsBGH=800;
            var svgTacticsW=400;
            var svgTacticsH=800;
            var margin = {top: 20, right: 20, bottom: 70, left: 40};


            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgTacticsBGW).attr("height",svgTacticsBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var topAxisSVG =svg.append("g").attr("class", "x axis");
            var bottomAxisSVG =svg.append("g").attr("class", "x axis");
            var yAxisSVG = svg.append("g").attr("class", "y axis");




            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            /*
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
            */

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
                svgTacticsBGW = el[0].clientWidth;
                svgTacticsBGH = el[0].clientHeight;
            //    if(svgTacticsBGW<600) svgTacticsBGW=600;
            //    if(svgTacticsBGH<400) svgTacticsBGH=400;

                return svgTacticsBGW + svgTacticsBGH;
            }, resize);
            // response the size-change
            function resize() {
                /*
                console.log("====================resize tactics chart=================");
                */

                svgTacticsW = svgTacticsBGW - margin.left - margin.right;
                svgTacticsH = svgTacticsBGH - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgTacticsBGW)
                    .attr("height", svgTacticsBGH)

                svg
                    .attr("width", svgTacticsW)
                    .attr("height", svgTacticsH)

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
                console.log("===redraw tactics chart===")
                var data=scope.data.tactics;

                var xScale = d3.scaleBand().rangeRound([0, svgTacticsW]).padding(.05)
                    .domain(data.map(function(d) { return d.name; }));

                var yScale = d3.scaleLinear().range([svgTacticsH, 0])
                    .domain([0, 1]);

                var topAxis = d3.axisTop().scale(xScale)

                var bottomAxis = d3.axisBottom().scale(xScale)

                var yAxis = d3.axisLeft().scale(yScale).ticks(10);

                topAxisSVG
                    .call(topAxis)
                bottomAxisSVG
                    .attr("transform", "translate(0," + (svgTacticsH) + ")")
                    .call(bottomAxis)

                var bouts1 = svg.selectAll(".bout1").data(data);
                var bouts2 = svg.selectAll(".bout2").data(data);

                bouts1.enter()
                    .append("rect")
                    .classed("bout1",true)
                    .on('click',function(d){
                        scope.data.onClick(d.name);
                    })
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField1(d)); })
                    .attr("stroke","red")
                    .attr("fill",function(d){
                        if(d.score==1) return "red"
                        else if(d.score==2) return "gray"
                        return "lightgray";
                    })
                    .on('mouseover', function(d){

                    })
                    .on('mouseout', function(d){

                    })

                bouts2.enter()
                    .append("rect")
                    .classed("bout2",true)
                    .on('click',function(d){
                        scope.data.onClick(d.name);
                    })
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return yScale(getField2(d)); })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField2(d)); })
                    .attr("stroke","blue")
                    .attr("fill",function(d){
                        if(d.score==1) return "gray"
                        else if(d.score==2) return "blue"
                        return "lightgray";
                    })


                bouts1
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField1(d)); })
                    .attr("stroke","red")
                    .attr("fill",function(d){
                        if(d.score==1) return "red"
                        else if(d.score==2) return "gray"
                        return "lightgray";
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>行动:</strong> <span style='color:red'>" + translateMotion(d.motion1)+"</span>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                bouts2
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return yScale(getField2(d)); })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField2(d)); })
                    .attr("stroke","blue")
                    .attr("fill",function(d){
                        if(d.score==1) return "gray"
                        else if(d.score==2) return "blue"
                        return "lightgray";
                    })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>行动:</strong> <span style='color:red'>" + translateMotion(d.motion2)+"</span>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                bouts1.exit()
                    .remove();
                bouts2.exit()
                    .remove();



/*
                var bouts = svg.selectAll(".bout").data(data);

                var g=bouts.enter().append("g")
                    .classed("bout",true);

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

                svg.selectAll("#player1")
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField1(d)); })
                    .attr("stroke","red")
                    .attr("fill",function(d){
                        if(d.score==1) return "red"
                        else if(d.score==2) return "gray"
                        return "lightgray";
                    })
                    .on('mouseover', function(d){

                    })
                    .on('mouseout', function(d){

                    })

                svg.selectAll("#player2")
                    .attr("x", function(d) { return xScale(d.name); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return yScale(getField2(d)); })
                    .attr("height", function(d) { return svgTacticsH - yScale(getField2(d)); })
                    .attr("stroke","blue")
                    .attr("fill",function(d){
                        if(d.score==1) return "gray"
                        else if(d.score==2) return "blue"
                        return "lightgray";
                    })
                    .on('mouseover', function(d){

                    })
                    .on('mouseout', function(d){

                    })
                bouts.exit()
                    .remove();
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

