/*
    dsp: directive to show the animation of a bout
    author: Mingdong
    logs:
        created
        2018/02/01
 */
mainApp.directive('boutChart', function () {
    function link(scope, el, attr) {
        function boutChart(){
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
            var margin = {top: 20, right: 100, bottom: 70, left: 40};
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
                .style("font-size", 30)
                .style("text-anchor", "middle")
                .style("font-family", "monospace");



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

            // svg element of fencer 1
            var arrSVGFencer1=[
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
                svgRL2Fencer1,
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

            // show the animation of a bout
            function showBout(){
                console.log("show bout");
                if(scope.data.selected_bout<0) return;
                var arrPos1=[];
                var arrPos2=[];
                var arrMotion1=[];
                var arrMotion2=[];
                var resultText=""
                var bout=scope.data.bouts_data[scope.data.selected_bout-1];
                console.log(scope.data.selected_bout);
                if(bout.result=="b"){
                    arrPos1=[5,5.5,6,7];
                    arrPos2=[9,8.5,8,8];
                    arrMotion1=[0,0,0,1];
                    arrMotion2=[0,0,0,1];
                    resultText="同时互中"
                }
                else if(bout.result=="a"){
                    arrPos1=[5,5.5,6,7];
                    arrPos2=[9,8.5,8,8];
                    arrMotion1=[0,0,0,1];
                    arrMotion2=[0,0,0,1];
                    resultText="进攻反攻"
                }
                else if(bout.result=="r"){
                    arrPos1=[5,5.5,6,7,7];
                    arrPos2=[9,8.5,8,8,8];
                    arrMotion1=[0,0,0,1,1];
                    arrMotion2=[0,0,0,2,3];
                    resultText="防守还击"
                }
                else if(bout.result=="rr"){
                    arrPos1=[5,5.5,6,7,7,7];
                    arrPos2=[9,8.5,8,8,8,8];
                    arrMotion1=[0,0,0,1,2,3];
                    arrMotion2=[0,0,0,2,3,3];
                    resultText="反还击"

                }
                // animation of fencer1
                function animation1(){
                    var index=1;
                    svgFencer1
                        .style("opacity", 1)
                        .attr("transform", "translate("+xScale(arrPos1[0])+", "+svgBoutH/2+")")
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
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
                                    .attr("transform", "translate("+xScale(arrPos1[index++])+", "+svgBoutH/2+")")
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                animation1();
                // elements of fencer1

                // head
                function headAnimation1()
                {
                    var index=1;
                    svgHeadFencer1
                        .attr("cx",arrGlyphCoords[arrMotion1[0]][0].x)
                        .attr("cy",arrGlyphCoords[arrMotion1[0]][0].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("cx",arrGlyphCoords[arrMotion1[index]][0].x)
                                    .attr("cy",arrGlyphCoords[arrMotion1[index++]][0].y)
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
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][1].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][2].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][2].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][1].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][2].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][2].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LA1Animation1()
                {
                    var index=1;
                    svgLA1Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][1].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][3].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][3].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][1].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][3].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][3].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LA2Animation1()
                {
                    var index=1;
                    svgLA2Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][3].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][3].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][4].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][4].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][3].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][3].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][4].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][4].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RA1Animation1()
                {
                    var index=1;
                    svgRA1Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][1].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][5].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][5].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][1].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][5].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][5].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RA2Animation1()
                {
                    var index=1;
                    svgRA2Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][5].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][5].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][6].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][6].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][5].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][5].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][6].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][6].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function sabreAnimation1()
                {
                    var index=1;
                    svgSabreFencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][6].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][6].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][7].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][7].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][6].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][6].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][7].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][7].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LL1Animation1()
                {
                    var index=1;
                    svgLL1Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][2].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][2].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][8].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][8].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][2].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][2].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][8].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][8].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LL2Animation1()
                {
                    var index=1;
                    svgLL2Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][8].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][8].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][9].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][9].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][8].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][8].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][9].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][9].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RL1Animation1()
                {
                    var index=1;
                    svgRL1Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][2].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][2].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][10].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][10].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][2].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][2].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][10].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][10].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RL2Animation1()
                {
                    var index=1;
                    svgRL2Fencer1
                        .attr("x1",arrGlyphCoords[arrMotion1[0]][10].x)
                        .attr("y1",arrGlyphCoords[arrMotion1[0]][10].y)
                        .attr("x2",arrGlyphCoords[arrMotion1[0]][11].x)
                        .attr("y2",arrGlyphCoords[arrMotion1[0]][11].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion1.length){
                                d3.active(this)
                                    .attr("x1",arrGlyphCoords[arrMotion1[index]][10].x)
                                    .attr("y1",arrGlyphCoords[arrMotion1[index]][10].y)
                                    .attr("x2",arrGlyphCoords[arrMotion1[index]][11].x)
                                    .attr("y2",arrGlyphCoords[arrMotion1[index++]][11].y)
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

                // fencer2
                function animation2(){

                    var index=1;
                    svgFencer2
                        .style("opacity", 1)
                        .attr("transform", "translate("+xScale(arrPos2[0])+", "+svgBoutH/2+")")
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index==arrPos2.length){
                                svgFencer2.style("opacity", 0)
                            }
                            else{
                                d3.active(this)
                                    .attr("transform", "translate("+xScale(arrPos2[index++])+", "+svgBoutH/2+")")
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                animation2();
                // elements of fencer2





                // head
                function headAnimation2()
                {
                    var index=1;
                    svgHeadFencer2
                        .attr("cx",-arrGlyphCoords[arrMotion2[0]][0].x)
                        .attr("cy",arrGlyphCoords[arrMotion2[0]][0].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("cx",-arrGlyphCoords[arrMotion2[index]][0].x)
                                    .attr("cy",arrGlyphCoords[arrMotion2[index++]][0].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                // body
                function bodyAnimation2()
                {
                    var index=1;
                    svgBodyFencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][1].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][2].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][2].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][1].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][2].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][2].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LA1Animation2()
                {
                    var index=1;
                    svgLA1Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][1].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][3].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][3].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][1].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][3].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][3].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LA2Animation2()
                {
                    var index=1;
                    svgLA2Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][3].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][3].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][4].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][4].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][3].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][3].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][4].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][4].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RA1Animation2()
                {
                    var index=1;
                    svgRA1Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][1].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][1].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][5].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][5].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][1].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][1].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][5].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][5].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RA2Animation2()
                {
                    var index=1;
                    svgRA2Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][5].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][5].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][6].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][6].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][5].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][5].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][6].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][6].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function sabreAnimation2()
                {
                    var index=1;
                    svgSabreFencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][6].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][6].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][7].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][7].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][6].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][6].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][7].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][7].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LL1Animation2()
                {
                    var index=1;
                    svgLL1Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][2].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][2].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][8].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][8].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][2].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][2].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][8].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][8].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function LL2Animation2()
                {
                    var index=1;
                    svgLL2Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][8].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][8].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][9].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][9].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][8].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][8].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][9].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][9].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RL1Animation2()
                {
                    var index=1;
                    svgRL1Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][2].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][2].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][10].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][10].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][2].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][2].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][10].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][10].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }
                function RL2Animation2()
                {
                    var index=1;
                    svgRL2Fencer2
                        .attr("x1",-arrGlyphCoords[arrMotion2[0]][10].x)
                        .attr("y1",arrGlyphCoords[arrMotion2[0]][10].y)
                        .attr("x2",-arrGlyphCoords[arrMotion2[0]][11].x)
                        .attr("y2",arrGlyphCoords[arrMotion2[0]][11].y)
                        .transition()           // apply a transition
                        .duration(500)         // apply it over 4000 milliseconds
                        .on("start", function repeat() {
                            if(index<arrMotion2.length){
                                d3.active(this)
                                    .attr("x1",-arrGlyphCoords[arrMotion2[index]][10].x)
                                    .attr("y1",arrGlyphCoords[arrMotion2[index]][10].y)
                                    .attr("x2",-arrGlyphCoords[arrMotion2[index]][11].x)
                                    .attr("y2",arrGlyphCoords[arrMotion2[index++]][11].y)
                                    .transition()
                                    .on("start", repeat);
                            }
                        });
                }


                headAnimation2()
                bodyAnimation2()
                LA1Animation2()
                LA2Animation2()
                RA1Animation2()
                RA2Animation2()
                sabreAnimation2()
                LL1Animation2()
                LL2Animation2()
                RL1Animation2()
                RL2Animation2()

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