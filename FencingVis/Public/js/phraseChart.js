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
                    {x:30,y:-40},       // sword tip
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
                    {x:70,y:0},      // sword tip
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
                    {x:10,y:-40},      // sword tip
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
                    {x:60,y:-20},      // sword tip
                    {x:-20,y:20},
                    {x:-30,y:40},
                    {x:10,y:20},
                    {x:15,y:40}
                ]  // reposte
            ]

            // 0.1.size
            var margin = {top: 20, right: 20, bottom: 20, left: 20};
            var svgBGW=1000;
            var svgBGH=800;
            var svgW = svgBGW - margin.left - margin.right;
            var svgH = svgBGH - margin.top - margin.bottom;



            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgBGW).attr("height",svgBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var svgFencer1=svg.append("g")
                .style("opacity", 0)
            var svgFencer2=svg.append("g")
                .style("opacity", 0)
            var svgResultText=svg.append("text")
                .classed("result",true)
                .style("opacity", 0)



            var svgHeadFencer1=svgFencer1.append("circle")
                .classed("fencerhead1",true)
                .attr("r", 9)

            var svgBodyFencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)

            // left arm
            var svgLA1Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)
            var svgLA2Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)
            // right arm
            var svgRA1Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)
            var svgRA2Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)

            // sabre
            var svgSabreFencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("sword",true)

            // left legs
            var svgLL1Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)
            var svgLL2Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)

            // right legs

            var svgRL1Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)
            var svgRL2Fencer1=svgFencer1.append("line")
                .classed("fencer1",true)
                .classed("body",true)





            var svgHeadFencer2=svgFencer2.append("circle")
                .classed("fencerhead2",true)
                .attr("r", 9)

            var svgBodyFencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)

            // left arm
            var svgLA1Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)
            var svgLA2Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)
            // right arm
            var svgRA1Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)
            var svgRA2Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)

            // sabre
            var svgSabreFencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("sword",true)

            // left legs
            var svgLL1Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)
            var svgLL2Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)

            // right legs

            var svgRL1Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)
            var svgRL2Fencer2=svgFencer2.append("line")
                .classed("fencer2",true)
                .classed("body",true)

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
            var gAxisXBottom=svg.append("g")

            var gAxisY=svg.append("g")

            var gAxisYRight=svg.append("g")


            var pisteWidth=10;

            var yScale = d3.scaleBand()
                .domain([0,pisteWidth])

            var xScale = d3.scaleLinear()
                .domain([0, 14])

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgBGW = el[0].clientWidth;
                svgBGH = el[0].clientHeight;

                if(svgBGH<100) svgBGH=100;

                return svgBGW + svgBGH;
            }, resize);
            // response the size-change
            function resize() {
                //    console.log("====================resize motion chart=================");
                svgW = svgBGW - margin.left - margin.right;
                svgH = svgBGH - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgBGW)
                    .attr("height", svgBGH)

                svg
                    .attr("width", svgW)
                    .attr("height", svgH)


                redraw();
            }
            function redraw(){
            //    console.log("redraw bout chart");

                yScale
                    .range([0,svgH])

                xScale
                    .range([0, svgW]);

                // update axes
                gAxisX
                    .attr("transform", "translate(0," + -2 + ")")
                    .call(d3.axisTop(xScale));
                gAxisXBottom
                    .attr("transform", "translate(0," + svgH + ")")
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
                    .attr("y2", function(d) { return svgH; })
                    .attr("stroke","black")


                lines
                    .attr("x1", function(d) { return xScale(d); })
                    .attr("x2", function(d) { return xScale(d); })
                    .attr("y1", function(d) { return 0; })
                    .attr("y2", function(d) { return svgH; })
                    .attr("stroke","black")

                // fencers




            }
            redraw();
            // position sequence
            var arrPositionSequence={
                attack:[2.5,2,1.5,.5]
                ,reposte:[2.5,2,1.0,.8,.4]
                ,anti_reposte:[2.5,2,1.5,.5,.8,.5]
            }
            // motion sequence
            var arrMotionSequence={
                attack:[0,0,0,1,1]
                ,reposte:[0,0,0,2,3]
                ,anti_reposte:[0,0,0,1,2,3]
            }
            // generate sequence for player1 and player2
            function generateP1Sequence(seq){
                var result=[];
                seq.forEach(function(d){
                    result.push(7-d);
                })
                return result;
            }
            function generateP2Sequence(seq){
                var result=[];
                seq.forEach(function(d){
                    result.push(7+d);
                })
                return result;

            }
            // show the animation of a bout
            function showBout(){
            //    console.log("show bout");
                if(scope.data.selected_phrase<0) return;
                // length of steps
                var stepLen=0;
                // array of positions
                var arrPos1=[];
                var arrPos2=[];
                // array of motions
                var arrMotion1=[];
                var arrMotion2=[];
                // array of durations
                var arrTime1=[500,500,500,500,500,500,500,500,500,500];
                var arrTime2=[500,500,500,500,500,500,500,500,500,500];
                // result text
                var resultText=""

                var bout=scope.data.phrases[scope.data.selected_phrase-1];
                if(bout.result=="b"){
                    arrPos1=generateP1Sequence(arrPositionSequence.attack)
                    arrPos2=generateP2Sequence(arrPositionSequence.attack)
                    arrMotion1=arrMotionSequence.attack;
                    arrMotion2=arrMotionSequence.attack;
                    resultText="同时互中"
                    stepLen=4;
                }
                else if(bout.result=="r"){
                    if(scope.data.exchange){
                        arrPos1=generateP1Sequence(arrPositionSequence.reposte)
                        arrPos2=generateP2Sequence(arrPositionSequence.attack)
                        arrMotion1=arrMotionSequence.reposte;
                        arrMotion2=arrMotionSequence.attack;
                    }
                    else{
                        arrPos1=generateP1Sequence(arrPositionSequence.attack)
                        arrPos2=generateP2Sequence(arrPositionSequence.reposte)
                        arrMotion1=arrMotionSequence.attack;
                        arrMotion2=arrMotionSequence.reposte;

                    }
                    resultText="防守还击"
                    stepLen=5;
                }
                else if(bout.result=="rr"){
                    if(scope.data.exchange){
                        arrPos1=generateP1Sequence(arrPositionSequence.reposte)
                        arrPos2=generateP2Sequence(arrPositionSequence.anti_reposte)
                        arrMotion1=arrMotionSequence.reposte;
                        arrMotion2=arrMotionSequence.anti_reposte;
                    }
                    else{
                        arrPos1=generateP1Sequence(arrPositionSequence.anti_reposte)
                        arrPos2=generateP2Sequence(arrPositionSequence.reposte)
                        arrMotion1=arrMotionSequence.anti_reposte;
                        arrMotion2=arrMotionSequence.reposte;
                    }
                    resultText="反还击"
                    stepLen=6;

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
                    stepLen=9;
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
                        .attr("transform", "translate("+xScale(arrPos1[0])+", "+svgH/2+")")
                        .transition()           // apply a transition
                        .duration(arrTime1[0])         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index==stepLen){
                                svgFencer1.style("opacity", 0)
                                svgResultText
                                    .text(resultText)
                                    .attr("x",xScale(7))
                                    .attr("y",svgH/2)
                                    .style("opacity",1)
                                    .transition()           // apply a transition
                                    .duration(1000)         // apply it over 4000 milliseconds
                                    .style("opacity",0)
                            }
                            else{
                                var pos=index<arrPos1.length?arrPos1[index]:arrPos1[arrPos1.length-1];
                                var time=index<arrTime1.length?arrTime1[index]:arrTime1[arrTime1.length-1];
                                index++;
                                d3.active(this)
                                    .attr("transform", "translate("+xScale(pos)+", "+svgH/2+")")
                                    .transition()
                                    .duration(time)
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
                        .attr("transform", "translate("+xScale(arrPos2[0])+", "+svgH/2+")")
                        .transition()           // apply a transition
                        .duration(arrTime2[0])         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index==stepLen){
                                svgFencer2.style("opacity", 0)
                            }
                            else{
                                var pos=index<arrPos2.length?arrPos2[index]:arrPos2[arrPos2.length-1];
                                var time=index<arrTime2.length?arrTime2[index]:arrTime2[arrTime2.length-1];
                                index++;
                                d3.active(this)
                                    .attr("transform", "translate("+xScale(pos)+", "+svgH/2+")")
                                    .transition()
                                    .duration(time)
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
                        arrSVGFencer[player-1][indexPart]
                            .attr("cx",arrGlyphCoords[arrMotion[player-1][0]][0].x*revert)
                            .attr("cy",arrGlyphCoords[arrMotion[player-1][0]][0].y)
                            .transition()           // apply a transition
                            .duration(arrTime[player-1][0])         // apply it over 4000 milliseconds
                            .on("start", function repeat() {
                                if(index<stepLen){
                                    var playerMotion=arrMotion[player-1]
                                    var motion=index<playerMotion.length?playerMotion[index]:playerMotion[playerMotion.length-1];
                                    var playerTime=arrTime[player-1]
                                    var time=index<playerTime.length?playerTime[index]:playerTime[playerTime.length-1]
                                    index++;
                                    d3.active(this)
                                        .attr("cx",arrGlyphCoords[motion][0].x*revert)
                                        .attr("cy",arrGlyphCoords[motion][0].y)
                                        .transition()
                                        .duration(time)         // apply it over 4000 milliseconds
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
            scope.$watch('data.selected_phrase', showBout);
        }
        phraseChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});