/*
    dsp: directive to show the motion view of fencing
    author: Mingdong
    logs:
        created
        2018/01/25
 */
mainApp.directive('motionChart', function () {
    function link(scope, el, attr) {
        function motionChart(){
            // 0.definition

            // 0.1.size
            var margin = {top: 20, right: 100, bottom: 70, left: 40};
            var svgMotionBGW=1000;
            var svgMotionBGH=800;
            var svgMotionW = svgMotionBGW - margin.left - margin.right;
            var svgMotionH = svgMotionBGH - margin.top - margin.bottom;

            // 0.2.color
            var color = d3.scaleOrdinal(d3.schemeCategory20)

            var parseDate = d3.timeParse("%m/%Y")
            function type2color(type){
                if(type=="f") return d3.schemeCategory20[0]
                if(type=="b") return d3.schemeCategory20[1]
                if(type=="a") return d3.schemeCategory20[2]
                return "black"
            }


            function type2color_hand(type){
                if(type=="ha") return d3.schemeCategory20[6]
                if(type=="hp") return d3.schemeCategory20[8]
                if(type=="hr") return d3.schemeCategory20[7]
                if(type=="hc") return d3.schemeCategory20[10]
                return "black"
            }

            function boutColor(bout){
                if(bout.score==1) return "red"
                else if(bout.score==2) return "blue"
                else return "gray"
            }

            function getY(d){
                return "p"+d.player+"b"+d.bout;
            }

            function resultText(result){
                return result.toUpperCase();
                if(result=="a") return "进攻反攻"
                if(result=="i") return "意外情况"
                if(result=="g") return "一方犯规"
                if(result=="r") return "防守还击"
                if(result=="rr") return "反还击"
                if(result=="b") return "同时互中"
            }


            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgMotionBGW).attr("height",svgMotionBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var gAxisX=svg.append("g")
                .attr("class", "axis axis--x")
            var gAxisXBottom=svg.append("g")
                .attr("class", "axis axis--x")

            var gAxisY=svg.append("g")
                .attr("class", "axis axis--y")

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgMotionBGW = el[0].clientWidth;
                svgMotionBGH = el[0].clientHeight;

                return svgMotionBGW + svgMotionBGH;
            }, resize);
            // response the size-change
            function resize() {

            //    console.log("====================resize motion chart=================");


                svgMotionW = svgMotionBGW - margin.left - margin.right;
                svgMotionH = svgMotionBGH - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgMotionBGW)
                    .attr("height", svgMotionBGH)

                svg
                    .attr("width", svgMotionW)
                    .attr("height", svgMotionH)


                redraw();
            }
            function redraw(){
                console.log("redraw motion chart");
                var data_feet=scope.data.motion;
                var data_hands=scope.data.motion_hands;

                // generate bout data
                var boutsData=scope.data.bouts_data;
                if(scope.data.filter=="3 second"){
                    var duration =[];
                    for(var i=0;i<boutsData.length;i++) duration.push(0);
                    data_feet.forEach(function(d){
                        if(d.frame_end>90) duration[d.bout]=1;
                    })
                    data_hands.forEach(function(d){
                        if(d.frame_end>90) duration[d.bout]=1;
                    })
                    boutsData=boutsData.filter(function(d){return duration[d.bout]==0})
                    data_feet=data_feet.filter(function(d){return duration[d.bout]==0})
                    data_hands=data_hands.filter(function(d){return duration[d.bout]==0})
                }

                var yScale = d3.scaleBand()
                    .domain(data_feet.map(function(d) { return getY(d); }))
                    .range([0,svgMotionH])
                    .padding(0.1);

                var xScale = d3.scaleLinear()
                    .domain([0, Math.max(d3.max(data_feet, function(d){ return d.frame_end; }),d3.max(data_hands, function(d){ return d.frame_end; }))])
                    .range([0, svgMotionW]);

                // update axes
                gAxisX
                    .attr("transform", "translate(0," + -2 + ")")
                    .call(d3.axisTop(xScale));
                gAxisXBottom
                    .attr("transform", "translate(0," + svgMotionH + ")")
                    .call(d3.axisBottom(xScale))

                gAxisY
                    .call(d3.axisLeft(yScale));


                // append the rectangles for the background

                var bouts=svg.selectAll(".bout").data(boutsData);
                bouts
                    .enter().append("rect")
                    .attr("class", "bout")
                    .attr("x", function(d) { return xScale(0); })
                    .attr("width", function(d) {return svgMotionW } )
                    .attr("stroke",function(d){return boutColor(d)})
                    .attr("fill","AntiqueWhite")
                    .attr("y", function(d) { return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*2)
                    .on('click', function (d) {
                        // console.log("mouse leave");
                        scope.data.selected_bout=d.bout;
                        scope.$apply();
                    });
                bouts
                    .attr("x", function(d) { return xScale(0); })
                    .attr("width", function(d) {return svgMotionW } )
                    .attr("stroke",function(d){return boutColor(d)})
                    .attr("fill","AntiqueWhite")
                    .attr("y", function(d) { return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*2);

                bouts.exit().remove();


                var boutsText=svg.selectAll(".boutText").data(boutsData);
                boutsText
                    .enter().append("text")
                    .attr("class", "boutText")
                    .text(function(d) { return resultText(d.result); })
                    .attr("x", function(d) {return svgMotionW+10 } )
                    .attr("y", function(d) { return yScale(getY(d))+yScale.bandwidth()*1.5; })
                    .attr("stroke",function(d){return boutColor(d)})
                    .style("font-size", 20)
                    .style("text-anchor", "left")
                    .style("font-family", "monospace");
                boutsText
                    .text(function(d) { return resultText(d.result); })
                    .attr("x", function(d) {return svgMotionW+10 } )
                    .attr("y", function(d) { return yScale(getY(d))+yScale.bandwidth()*1.5; })
                    .attr("stroke",function(d){return boutColor(d)})
                    .style("font-size", 20)
                    .style("text-anchor", "left")
                    .style("font-family", "monospace");

                boutsText.exit().remove();

                //data_feet.forEach(function(d){console.log(d)})

                // append the rectangles for the feet
                var feet=svg.selectAll(".foot");

                feet=feet.data([]);
                feet.exit().remove();

                feet=feet.data(data_feet);
                feet
                    .enter().append("rect")
                    .attr("class", "foot")
                    .attr("x", function(d) { return xScale(d.frame_start); })
                    .attr("width", function(d) {return xScale(d.frame_end-d.frame_start); } )
                    .attr("fill",function(d){return type2color(d.type)})
                    .attr("y", function(d) { return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*.8);
                feet
                    .attr("x", function(d) { return xScale(d.frame_start); })
                    .attr("width", function(d) {return xScale(d.frame_end-d.frame_start); } )
                    .attr("fill",function(d){return type2color(d.type)})
                    .attr("y", function(d) {return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*.8);

                feet.exit().remove();


                // append the rectangles for the hands
                var hands=svg.selectAll(".hand")
                hands=hands.data([])
                hands.exit().remove();
                hands=hands.data(data_hands);
                hands
                    .enter().append("rect")
                    .attr("class", "hand")
                    .attr("x", function(d) { return xScale(d.frame_start); })
                    .attr("width", function(d) {return xScale(d.frame_end-d.frame_start); } )
                    .attr("fill",function(d){return type2color_hand(d.type)})
                    .attr("y", function(d) { return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*.4);
                hands
                    .attr("x", function(d) { return xScale(d.frame_start); })
                    .attr("width", function(d) {return xScale(d.frame_end-d.frame_start); } )
                    .attr("fill",function(d){return type2color_hand(d.type)})
                    .attr("y", function(d) { return yScale(getY(d)); })
                    .attr("height", yScale.bandwidth()*.4);

                hands.exit().remove();
            }
            redraw();


            scope.$watch('data', redraw);
            scope.$watch('data.motion', redraw);
            scope.$watch('data.motion_hands', redraw);
            scope.$watch('data.filter', redraw);
        }
        motionChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});