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
            var arrGlyphCoords=[
                [
                    // en garde
                    {x:0,y:-30},
                    {x:0,y:-20},
                    {x:0,y:10},
                    {x:-20,y:0},
                    {x:-10,y:10},
                    {x:20,y:0},
                    {x:30,y:0},
                    {x:30,y:-30},
                    {x:-20,y:20},
                    {x:-20,y:40},
                    {x:20,y:20},
                    {x:25,y:40}
                ],
                [
                    // lunge
                    {x:8,y:-12},
                    {x:0,y:0},
                    {x:-10,y:10},
                    {x:-20,y:-20},
                    {x:-30,y:-30},
                    {x:20,y:0},
                    {x:30,y:0},
                    {x:60,y:0},
                    {x:-20,y:20},
                    {x:-40,y:40},
                    {x:20,y:10},
                    {x:30,y:40}
                ]
            ]

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

            var svgFencer1=svg.append("g")
                .style("opacity", 0)
            var svgFencer2=svg.append("g")
                .style("opacity", 0)



            var svgHeadFencer1=svgFencer1.append("circle")
                .attr('cy', -30)
                .attr("r", 9)
                .attr("fill", "red")

            var svgBodyFencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("x1", 0)
                .attr("y1", -20)
                .attr("x2", 0)
                .attr("y2", 10)

            // left arm
            var svgLA1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 0)
                .attr("y1", -20)
                .attr("x2", -20)
                .attr("y2", 0)
            var svgLA2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", -20)
                .attr("y1", 0)
                .attr("x2", -10)
                .attr("y2", 10)
            // right arm
            var svgRA1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 0)
                .attr("y1", -20)
                .attr("x2", 20)
                .attr("y2", 0)
            var svgRA2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 20)
                .attr("y1", 0)
                .attr("x2", 30)
                .attr("y2", 0)

            // sabre
            var svgSabreFencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",2)
                .attr("stroke-linecap","round")
                .attr("x1", 30)
                .attr("y1", 0)
                .attr("x2", 30)
                .attr("y2", -30)

            // left legs
            var svgLL1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 0)
                .attr("y1", 10)
                .attr("x2", -20)
                .attr("y2", 20)
            var svgLL2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1",  -20)
                .attr("y1",  20)
                .attr("x2", -20)
                .attr("y2", 40)

            // right legs

            var svgRL1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 0)
                .attr("y1", 10)
                .attr("x2", 20)
                .attr("y2", 20)
            var svgRL2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
                .attr("x1", 20)
                .attr("y1", 20)
                .attr("x2", 25)
                .attr("y2", 40)

            var svgHeadFencer2=svgFencer2.append("circle")
                .attr('cy', -20)        // position the circle at 250 on the y axis
                .attr("fill", "blue")   // fill the circle with 'blue'
                .attr("r", 10)          // set the radius to 10 pixels

            /*
            var svgBodyFencer1=svgFencer1.append("rect")
                .attr("fill", "red")
                .attr("x", -1.5)
                .attr("y", -10)
                .attr("width", 3)
                .attr("height", 25)
                */



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
                //    .attr('cx', xScale(arrPos1[0]))         // position the circle at 40 on the x axis
                    .attr("transform", "translate("+xScale(arrPos1[0])+", "+svgBoutH/2+")")
                    .transition()           // apply a transition
                    .duration(500)         // apply it over 4000 milliseconds
                    .on("start", function repeat() {
                        if(index1==arrPos1.length){
                            svgFencer1.style("opacity", 0)
                        }
                        else{
                            d3.active(this)
                                .attr("transform", "translate("+xScale(arrPos1[index1++])+", "+svgBoutH/2+")")
                                .transition()
                                .on("start", repeat);
                        }
                    });
                // elements of fencer1
                {
                    svgHeadFencer1
                        .attr('cx', arrGlyphCoords[0][0].x)
                        .attr('cy', arrGlyphCoords[0][0].y)

                    svgBodyFencer1
                        .attr("x1", arrGlyphCoords[0][1].x)
                        .attr("y1", arrGlyphCoords[0][1].y)
                        .attr("x2", arrGlyphCoords[0][2].x)
                        .attr("y2", arrGlyphCoords[0][2].y)

                    // left arm
                    svgLA1Fencer1
                        .attr("x1", arrGlyphCoords[0][1].x)
                        .attr("y1", arrGlyphCoords[0][1].y)
                        .attr("x2", arrGlyphCoords[0][3].x)
                        .attr("y2", arrGlyphCoords[0][3].y)
                    svgLA2Fencer1
                        .attr("x1", arrGlyphCoords[0][3].x)
                        .attr("y1", arrGlyphCoords[0][3].y)
                        .attr("x2", arrGlyphCoords[0][4].x)
                        .attr("y2", arrGlyphCoords[0][4].y)
                    // right arm
                    svgRA1Fencer1
                        .attr("x1", arrGlyphCoords[0][1].x)
                        .attr("y1", arrGlyphCoords[0][1].y)
                        .attr("x2", arrGlyphCoords[0][5].x)
                        .attr("y2", arrGlyphCoords[0][5].y)
                    svgRA2Fencer1
                        .attr("x1", arrGlyphCoords[0][5].x)
                        .attr("y1", arrGlyphCoords[0][5].y)
                        .attr("x2", arrGlyphCoords[0][6].x)
                        .attr("y2", arrGlyphCoords[0][6].y)

                    // sabre
                    svgSabreFencer1
                        .attr("x1", arrGlyphCoords[0][6].x)
                        .attr("y1", arrGlyphCoords[0][6].y)
                        .attr("x2", arrGlyphCoords[0][7].x)
                        .attr("y2", arrGlyphCoords[0][7].y)

                    // left legs
                    svgLL1Fencer1
                        .attr("x1", arrGlyphCoords[0][2].x)
                        .attr("y1", arrGlyphCoords[0][2].y)
                        .attr("x2", arrGlyphCoords[0][8].x)
                        .attr("y2", arrGlyphCoords[0][8].y)
                    svgLL2Fencer1
                        .attr("x1", arrGlyphCoords[0][8].x)
                        .attr("y1", arrGlyphCoords[0][8].y)
                        .attr("x2", arrGlyphCoords[0][9].x)
                        .attr("y2", arrGlyphCoords[0][9].y)

                    // right legs

                    svgRL1Fencer1
                        .attr("x1", arrGlyphCoords[0][2].x)
                        .attr("y1", arrGlyphCoords[0][2].y)
                        .attr("x2", arrGlyphCoords[0][10].x)
                        .attr("y2", arrGlyphCoords[0][10].y)
                    svgRL2Fencer1
                        .attr("x1", arrGlyphCoords[0][10].x)
                        .attr("y1", arrGlyphCoords[0][10].y)
                        .attr("x2", arrGlyphCoords[0][11].x)
                        .attr("y2", arrGlyphCoords[0][11].y)

                    var arrMotion=[0,0,0,1
                    ];
                    // head
                    function headAnimation1()
                    {
                        var index=1;
                        svgHeadFencer1
                            .attr("cx",arrGlyphCoords[arrMotion[index]][0].x)
                            .attr("cy",arrGlyphCoords[arrMotion[index]][0].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("cx",arrGlyphCoords[arrMotion[index]][0].x)
                                        .attr("cy",arrGlyphCoords[arrMotion[index++]][0].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    // body
                    function bodyAnimation1()
                    {
                        var index=1;
                        svgBodyFencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][2].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][2].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][2].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][2].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function LA1Animation1()
                    {
                        var index=1;
                        svgLA1Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][3].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][3].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][3].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][3].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function LA2Animation1()
                    {
                        var index=1;
                        svgLA2Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][3].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][3].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][4].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][4].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][3].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][3].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][4].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][4].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function RA1Animation1()
                    {
                        var index=1;
                        svgRA1Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][5].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][5].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][1].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][1].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][5].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][5].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function RA2Animation1()
                    {
                        var index=1;
                        svgRA2Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][5].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][5].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][6].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][6].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][5].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][5].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][6].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][6].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function sabreAnimation1()
                    {
                        var index=1;
                        svgSabreFencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][6].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][6].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][7].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][7].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][6].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][6].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][7].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][7].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function LL1Animation1()
                    {
                        var index=1;
                        svgLL1Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][2].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][2].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][8].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][8].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][2].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][2].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][8].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][8].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function LL2Animation1()
                    {
                        var index=1;
                        svgLL2Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][8].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][8].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][9].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][9].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][8].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][8].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][9].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][9].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function RL1Animation1()
                    {
                        var index=1;
                        svgRL1Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][2].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][2].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][10].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][10].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][2].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][2].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][10].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][10].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }
                    function RL2Animation1()
                    {
                        var index=1;
                        svgRL2Fencer1
                            .attr("x1",arrGlyphCoords[arrMotion[index]][10].x)
                            .attr("y1",arrGlyphCoords[arrMotion[index]][10].y)
                            .attr("x2",arrGlyphCoords[arrMotion[index]][11].x)
                            .attr("y2",arrGlyphCoords[arrMotion[index]][11].y)
                            .transition()           // apply a transition
                            .duration(500)         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion.length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[index]][10].x)
                                        .attr("y1",arrGlyphCoords[arrMotion[index]][10].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[index]][11].x)
                                        .attr("y2",arrGlyphCoords[arrMotion[index++]][11].y)
                                        .transition()
                                        .on("start", repeat);
                                }
                            });
                    }

                    headAnimation1()
                    bodyAnimation1()
                    LA1Animation1()
                    LA2Animation1()
                    RA1Animation1()
                    RA2Animation1()
                    sabreAnimation1()
                    LL1Animation1()
                    LL2Animation1()
                    RL1Animation1()
                    RL2Animation1()
                }



                /*
                var index2=1;
                svgFencer2
                    .style("opacity", 1)
                    .attr("transform", "translate("+xScale(arrPos2[0])+", "+svgBoutH/2+")")
                    .transition()           // apply a transition
                    .duration(500)         // apply it over 4000 milliseconds
                    .on("start", function repeat() {
                        if(index2==arrPos2.length){
                            svgFencer2.style("opacity", 0)
                        }
                        else{
                            d3.active(this)
                                .attr("transform", "translate("+xScale(arrPos2[index2++])+", "+svgBoutH/2+")")
                                .transition()
                                .on("start", repeat);
                        }
                    });
                    */
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