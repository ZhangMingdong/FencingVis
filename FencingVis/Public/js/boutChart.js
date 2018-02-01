/*
    dsp: directive to show the motion view of fencing
    author: Mingdong
    logs:
        created
        2018/01/25
 */
mainApp.directive('boutChart', function () {
    function link(scope, el, attr) {
        function boutChart(){
            // 0.definition

            // 0.1.size
            var margin = {top: 20, right: 100, bottom: 70, left: 40};
            var svgBoutBGW=1000;
            var svgBoutBGH=800;
            var svgBoutW = svgBoutBGW - margin.left - margin.right;
            var svgBoutH = svgBoutBGH - margin.top - margin.bottom;

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
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgBoutBGW).attr("height",svgBoutBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var svgFencer1=svg.append("g");
            var svgFencer2=svg.append("g")
            svgFencer1.append("circle")
                .attr("fill", "red")   // fill the circle with 'blue'
                .attr("r", 20)          // set the radius to 10 pixels
                .style("opacity", 0)
            svgFencer2.append("circle")
                .attr("fill", "blue")   // fill the circle with 'blue'
                .attr("r", 20)          // set the radius to 10 pixels
                .style("opacity", 0)

            var gAxisX=svg.append("g")
                .attr("class", "axis axis--x")
            var gAxisXBottom=svg.append("g")
                .attr("class", "axis axis--x")

            var gAxisY=svg.append("g")
                .attr("class", "axis axis--y")

            var gAxisYRight=svg.append("g")
                .attr("class", "axis axis--y")


            var pisteWidth=10;

            var yScale = d3.scaleBand()
                .domain([0,pisteWidth])

            var xScale = d3.scaleLinear()
                .domain([0, 14])

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgBoutBGW = el[0].clientWidth;
                svgBoutBGH = el[0].clientHeight;

                return svgBoutBGW + svgBoutBGH;
            }, resize);
            // response the size-change
            function resize() {

            //    console.log("====================resize motion chart=================");


                svgBoutW = svgBoutBGW - margin.left - margin.right;
                svgBoutH = svgBoutBGH - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgBoutBGW)
                    .attr("height", svgBoutBGH)

                svg
                    .attr("width", svgBoutW)
                    .attr("height", svgBoutH)


                redraw();
            }
            function redraw(){
                console.log("redraw motion chart");

                yScale
                    .range([0,svgBoutH])

                xScale
                    .range([0, svgBoutW]);

                // update axes
                gAxisX
                    .attr("transform", "translate(0," + -2 + ")")
                    .call(d3.axisTop(xScale));
                gAxisXBottom
                    .attr("transform", "translate(0," + svgBoutH + ")")
                    .call(d3.axisBottom(xScale))

                /*
                gAxisY
                    .call(d3.axisLeft(yScale));
                gAxisYRight
                    .attr("transform", "translate(" + svgMotionW + ",0)")
                    .call(d3.axisRight(yScale));
                   */

                // lines
                var lineData=[0,2,5,9,12,14];
                var lines=svg.selectAll(".line").data(lineData);
                lines
                    .enter().append("line")
                    .attr("class", "line")
                    .attr("x1", function(d) { return xScale(d); })
                    .attr("x2", function(d) { return xScale(d); })
                    .attr("y1", function(d) { return 0; })
                    .attr("y2", function(d) { return svgBoutH; })
                    .attr("stroke","black")


                lines
                    .attr("x1", function(d) { return xScale(d); })
                    .attr("x2", function(d) { return xScale(d); })
                    .attr("y1", function(d) { return 0; })
                    .attr("y2", function(d) { return svgBoutH; })
                    .attr("stroke","black")

                // fencers




            }
            redraw();

            function showBout(){
                console.log("show bout");
                var arrPos1=[5,5.5,6,7];
                var arrPos2=[9,8.5,8,7];
                var index1=1;
                svgFencer1
                    .style("opacity", 1)
                    .attr('cx', xScale(arrPos1[0]))         // position the circle at 40 on the x axis
                    .attr('cy', svgBoutH/2)        // position the circle at 250 on the y axis
                    .transition()           // apply a transition
                    .duration(500)         // apply it over 4000 milliseconds
                    .on("start", function repeat() {
                        if(index1==arrPos1.length){
                            svgFencer1.style("opacity", 0)
                        }
                        else{
                            d3.active(this)
                                .attr("cx", xScale(arrPos1[index1++]))
                                .transition()
                                .on("start", repeat);
                        }
                    });


                var index2=1;
                svgFencer2
                    .style("opacity", 1)
                    .attr('cx', xScale(arrPos2[0]))         // position the circle at 40 on the x axis
                    .attr('cy', svgBoutH/2)        // position the circle at 250 on the y axis
                    .transition()           // apply a transition
                    .duration(500)         // apply it over 4000 milliseconds
                    .on("start", function repeat() {
                        if(index2==arrPos2.length){
                            svgFencer2.style("opacity", 0)
                        }
                        else{
                            d3.active(this)
                                .attr("cx", xScale(arrPos2[index2++]))
                                .transition()
                                .on("start", repeat);
                        }
                    });
            }


            scope.$watch('data', redraw);
            scope.$watch('data.selected_bout', showBout);
        }
        boutChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});