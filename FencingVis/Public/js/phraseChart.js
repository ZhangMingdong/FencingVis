/*
    dsp: directive to show the animation of a bout
    author: Mingdong
    logs:
        created
        2018/02/01
 */
mainApp.directive('phraseChart', function () {
    function link(scope, el, attr) {
        function phraseChart(){
            // 0.definition
            // coordinates of every critical point of the glyph for every motion
            var arrGlyphCoords=[
                [
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
                ],  // en garde
                [
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
                ],   // lunge
                [
                    {x:-10,y:-30},
                    {x:-10,y:-20},
                    {x:-10,y:10},
                    {x:-30,y:0},
                    {x:-20,y:10},
                    {x:0,y:0},
                    {x:10,y:0},
                    {x:10,y:-30},
                    {x:-20,y:20},
                    {x:-30,y:40},
                    {x:10,y:20},
                    {x:15,y:40}
                ],  // parry
                [
                    {x:-10,y:-30},
                    {x:-10,y:-20},
                    {x:-10,y:10},
                    {x:-30,y:0},
                    {x:-20,y:10},
                    {x:10,y:-20},
                    {x:20,y:-20},
                    {x:50,y:-20},
                    {x:-20,y:20},
                    {x:-30,y:40},
                    {x:10,y:20},
                    {x:15,y:40}
                ]  // reposte
            ]

            // 0.1.size
            var margin = {top: 40, right: 50, bottom: 50, left: 50};
            var svgBoutBGW=1000;
            var svgBoutBGH=800;
            var svgBoutW = svgBoutBGW - margin.left - margin.right;
            var svgBoutH = svgBoutBGH - margin.top - margin.bottom;



            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgBoutBGW).attr("height",svgBoutBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var svgFencer1=svg.append("g")
                .style("opacity", 0)
            var svgFencer2=svg.append("g")
                .style("opacity", 0)
            var svgResultText=svg.append("text")
                .style("opacity", 0)



            var svgHeadFencer1=svgFencer1.append("circle")
                .attr('cy', -30)
                .attr("r", 9)
                .attr("fill", "red")

            var svgBodyFencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)

            // left arm
            var svgLA1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgLA2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            // right arm
            var svgRA1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgRA2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")

            // sabre
            var svgSabreFencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",2)
                .attr("stroke-linecap","round")

            // left legs
            var svgLL1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgLL2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")

            // right legs

            var svgRL1Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgRL2Fencer1=svgFencer1.append("line")
                .attr("stroke", "red")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")





            var svgHeadFencer2=svgFencer2.append("circle")
                .attr('cy', -20)        // position the circle at 250 on the y axis
                .attr("fill", "blue")   // fill the circle with 'blue'
                .attr("r", 10)          // set the radius to 10 pixels
            var svgBodyFencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)

            // left arm
            var svgLA1Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgLA2Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            // right arm
            var svgRA1Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgRA2Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")

            // sabre
            var svgSabreFencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",2)
                .attr("stroke-linecap","round")

            // left legs
            var svgLL1Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgLL2Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")

            // right legs

            var svgRL1Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")
            var svgRL2Fencer2=svgFencer2.append("line")
                .attr("stroke", "blue")
                .attr("stroke-width",5)
                .attr("stroke-linecap","round")

            // svg element of fencer 1
            var arrSVGFencer=[
                [
                    svgHeadFencer1,
                    svgBodyFencer1,
                    svgLA1Fencer1,
                    svgLA2Fencer1,
                    svgRA1Fencer1,
                    svgRA2Fencer1,
                    svgSabreFencer1,
                    svgLL1Fencer1,
                    svgLL2Fencer1,
                    svgRL1Fencer1,
                    svgRL2Fencer1
                ],
                [
                    svgHeadFencer2,
                    svgBodyFencer2,
                    svgLA1Fencer2,
                    svgLA2Fencer2,
                    svgRA1Fencer2,
                    svgRA2Fencer2,
                    svgSabreFencer2,
                    svgLL1Fencer2,
                    svgLL2Fencer2,
                    svgRL1Fencer2,
                    svgRL2Fencer2
                ]
            ]
            // indices of glyph
            var arrGlyphIndices=[
                [0,0],
                [1,2],
                [1,3],
                [3,4],
                [1,5],
                [5,6],
                [6,7],
                [2,8],
                [8,9],
                [2,10],
                [10,11],
            ]


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
            //    console.log("redraw bout chart");

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

            // show the animation of a bout
            function showBout(){
                console.log("show bout");
                if(scope.data.selected_bout<0) return;
                var arrPos1=[];
                var arrPos2=[];
                var arrMotion1=[];
                var arrMotion2=[];
                var arrTime1=[500,500,500,500,500,500,500,500,500,500];
                var arrTime2=[500,500,500,500,500,500,500,500,500,500];
                var resultText=""
                var bout=scope.data.bouts_data[scope.data.selected_bout-1];
                if(bout.result=="b"){
                    arrPos1=[
                        4.5
                        ,5
                        ,5.5
                        ,6.5
                    ];
                    arrPos2=[
                        9.5
                        ,9
                        ,8.5
                        ,7.5
                    ];
                    arrMotion1=[
                        0
                        ,0
                        ,0
                        ,1
                    ];
                    arrMotion2=[
                        0
                        ,0
                        ,0
                        ,1
                    ];
                    resultText="同时互中"
                }
                else if(bout.result=="r"){
                    arrPos1=[4.5,5,5.5,6.5,6.5];
                    arrPos2=[9.5,9,8.5,7.8,7.5];
                    arrMotion1=[0,0,0,1,1];
                    arrMotion2=[0,0,0,2,3];
                    resultText="防守还击"
                }
                else if(bout.result=="rr"){
                    arrPos1=[4.5,5,5.5,6.5,6.2,6.5];
                    arrPos2=[9.5,9,8.5,7.8,7.5,7.5];
                    arrMotion1=[0,0,0,1,2,3];
                    arrMotion2=[0,0,0,2,3,3];
                    resultText="反还击"

                }
                else if(bout.result=="a1"){
                    arrPos1=[4.5,5,5.5,6,7.5];
                    arrPos2=[9.5,9,8.5,8.2,8.5];
                    arrMotion1=[0,0,0,0,1];
                    arrMotion2=[0,0,0,0,2];
                    resultText="进攻反攻"
                }
                else if(bout.result=="a3"){
                    arrPos1=[4.5,5,5.5,6,7,8,9.5];
                    arrPos2=[9.5,9,8.5,8.2,8.5,9.5,10.5];
                    arrMotion1=[0,0,0,0,0,0,1];
                    arrMotion2=[0,0,0,0,0,0,2];
                    resultText="进攻反攻"
                }
                else if(bout.result=="a"){
                    arrPos1=[
                        4.5
                        ,5
                        ,5.5
                        ,6.5
                    ];
                    arrPos2=[
                        9.5
                        ,9
                        ,8.5
                        ,7.5
                    ];
                    arrMotion1=[
                        0
                        ,0
                        ,0
                        ,1
                    ];
                    arrMotion2=[
                        0
                        ,0
                        ,0
                        ,1
                    ];
                    resultText="进攻反攻"
                }
                else if(bout.result=="ra"){
                    arrPos1=[4.5,5,5.5,6,7,8,9.5,9,8];
                    arrPos2=[9.5,9,8.5,8.2,8.5,9.5,11,10.8,9];
                    arrMotion1=[0,0,0,0,0,0,1,0,2];
                    arrMotion2=[0,0,0,0,0,0,2,0,1];
                    resultText="进攻反攻"
                }
                else{
                    return;
                }

                var arrTime=[arrTime1,arrTime2]
                var arrMotion=[arrMotion1,arrMotion2]
                var arrPos=[arrPos1,arrPos2];
                // animation of fencer1
                function animation1(){
                    var index=1;
                    svgFencer1
                        .style("opacity", 1)
                        .attr("transform", "translate("+xScale(arrPos1[0])+", "+svgBoutH/2+")")
                        .transition()           // apply a transition
                        .duration(arrTime1[0])         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index==arrPos1.length){
                                svgFencer1.style("opacity", 0)
                                svgResultText
                                    .text(resultText)
                                    .attr("x",xScale(7))
                                    .attr("y",svgBoutH/2)
                                    .style("opacity",1)
                                    .transition()           // apply a transition
                                    .duration(1000)         // apply it over 4000 milliseconds
                                    .style("opacity",0)
                            }
                            else{
                                d3.active(this)
                                    .attr("transform", "translate("+xScale(arrPos1[index])+", "+svgBoutH/2+")")
                                    .transition()
                                    .duration(arrTime1[index++])
                                    .on("start", repeat);
                            }
                        });
                }
                animation1();
                // fencer2
                function animation2(){

                    var index=1;
                    svgFencer2
                        .style("opacity", 1)
                        .attr("transform", "translate("+xScale(arrPos2[0])+", "+svgBoutH/2+")")
                        .transition()           // apply a transition
                        .duration(arrTime2[0])         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index==arrPos2.length){
                                svgFencer2.style("opacity", 0)
                            }
                            else{
                                d3.active(this)
                                    .attr("transform", "translate("+xScale(arrPos2[index])+", "+svgBoutH/2+")")
                                    .transition()
                                    .duration(arrTime2[index++])
                                    .on("start", repeat);
                            }
                        });
                }
                animation2();
                // elements
                function animationPart(player,indexPart,index1,index2){
                    var revert=player==2?-1:1;
                    var index=1;
                    if(indexPart==0){
                        console.log(arrSVGFencer)
                        arrSVGFencer[player-1][indexPart]
                            .attr("cx",arrGlyphCoords[arrMotion[player-1][0]][0].x*revert)
                            .attr("cy",arrGlyphCoords[arrMotion[player-1][0]][0].y)
                            .transition()           // apply a transition
                            .duration(arrTime[player-1][0])         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion[player-1].length){
                                    d3.active(this)
                                        .attr("cx",arrGlyphCoords[arrMotion[player-1][index]][0].x*revert)
                                        .attr("cy",arrGlyphCoords[arrMotion[player-1][index]][0].y)
                                        .transition()
                                        .duration(arrTime[player-1][index++])         // apply it over 4000 milliseconds
                                        .on("start", repeat);
                                }
                            });
                    }
                    else{
                        arrSVGFencer[player-1][indexPart]
                            .attr("x1",arrGlyphCoords[arrMotion[player-1][0]][index1].x*revert)
                            .attr("y1",arrGlyphCoords[arrMotion[player-1][0]][index1].y)
                            .attr("x2",arrGlyphCoords[arrMotion[player-1][0]][index2].x*revert)
                            .attr("y2",arrGlyphCoords[arrMotion[player-1][0]][index2].y)
                            .transition()           // apply a transition
                            .duration(arrTime[player-1][0])         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<arrMotion[player-1].length){
                                    d3.active(this)
                                        .attr("x1",arrGlyphCoords[arrMotion[player-1][index]][index1].x*revert)
                                        .attr("y1",arrGlyphCoords[arrMotion[player-1][index]][index1].y)
                                        .attr("x2",arrGlyphCoords[arrMotion[player-1][index]][index2].x*revert)
                                        .attr("y2",arrGlyphCoords[arrMotion[player-1][index]][index2].y)
                                        .transition()
                                        .duration(arrTime[player-1][index++])         // apply it over 4000 milliseconds
                                        .on("start", repeat);
                                }
                            });

                    }
                }
                for(var i=0;i<11;i++){
                    animationPart(1,i,arrGlyphIndices[i][0],arrGlyphIndices[i][1])
                    animationPart(2,i,arrGlyphIndices[i][0],arrGlyphIndices[i][1])
                }
            }


            scope.$watch('data', redraw);
            scope.$watch('data.selected_bout', showBout);
        }
        phraseChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});