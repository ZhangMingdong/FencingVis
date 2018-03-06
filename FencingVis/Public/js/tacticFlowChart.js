/*
    dsp: directive to show tactic flow of a bout
    author: Mingdong
    logs:
        created
        2018/02/10
 */
mainApp.directive('tacticFlowChart', function () {
    function link(scope, el, attr) {
        function tacticFlowChart(){
            // 0.definition

            // 0.1.size
            var margin = {top: 85, right: 0, bottom: 0, left: 0};
            var svgBGW=1000;
            var svgBGH=800;
            var svgW = svgBGW - margin.left - margin.right;
            var svgH = svgBGH - margin.top - margin.bottom;


            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgBGW).attr("height",svgBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgBGW = el[0].clientWidth;
                svgBGH = el[0].clientHeight;

                if(svgBGW<600) svgBGW=600;
                if(svgBGH<400) svgBGH=400;

                return svgBGW + svgBGH;
            }, resize);
            // switch element in the array of index1 and index 2
            function switchFlow(arr,index1,index2){
                var width=arr[index1].width;
                var focused=arr[index1].focused;
                var w1=arr[index1].w1;
                var w2=arr[index1].w2;
                arr[index1].width=arr[index2].width;
                arr[index1].focused=arr[index2].focused;
                arr[index1].w1=arr[index2].w1;
                arr[index1].w2=arr[index2].w2;
                arr[index2].width=width;
                arr[index2].focused=focused;
                arr[index2].w1=w1;
                arr[index2].w2=w2;
            }
            // response the size-change
            function resize() {
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
            //    console.log("redraw tactic flow chart");
                var flowRange=40;           // range of the flow width
                var r=20;
                var biasEarW=60;
                var biasEarH=60;
                var biasTopW=80;
                var biasTopH=150;
                var biasBottomW=100;
                var biasBottomH=200;
                var middle=svgW/2;
                var nodes=[
                     {x:middle-50   ,y:000,name:"S"}
                    ,{x:middle+50   ,y:000,name:"BB"}
                    ,{x:middle+200  ,y:160,name:"FB"}
                    ,{x:middle      ,y:160,name:"FF"}
                    ,{x:middle-200  ,y:160,name:"BF"}
                    ,{x:middle-200  ,y:320,name:"1"}
                    ,{x:middle      ,y:320,name:"B"}
                    ,{x:middle+200  ,y:320,name:"2"}
                    ]
                var lines=[
                     {s:0,d:1,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"sbb"}      //0    S-BB
                    ,{s:0,d:2,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"sfb"}      //1    S-FB
                    ,{s:0,d:3,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"sff"}      //2    S-FF
                    ,{s:0,d:4,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"sbf"}      //3    S-BF
                    ,{s:1,d:2,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bbfb"}      //4    BB-FB
                    ,{s:1,d:3,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bbff"}      //5    BB-FF
                    ,{s:1,d:4,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bbbf"}      //6    BB-BF
                    ,{s:2,d:5,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"fb1"}      //7    FBF
                    ,{s:2,d:7,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"fb2"}      //8    FBR\FBA
                    ,{s:3,d:5,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"ff1"}      //9    FF1
                    ,{s:3,d:6,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"ffb"}      //10   FFB
                    ,{s:3,d:7,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"ff2"}      //11   FF2
                    ,{s:4,d:5,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bf1"}      //12   BFR\BFA
                    ,{s:4,d:7,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bf2"}      //13   BFF
                    ,{s:2,d:4,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"fbb"}      //14   FBB
                    ,{s:4,d:2,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bfb"}      //15   BFB
                    ,{s:2,d:2,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"fbfb"}      //16   FBFB
                    ,{s:4,d:4,width:0,w1:0,w2:0,selectedw:0,focused:false,name:"bfbf"}      //17   BFBF
                ]

                // var nodes=scope.data.flow.nodes;
                var flow=scope.data.flow;
                // fill data
                var flow_total=[
                     flow.sbb
                    ,flow.sfb
                    ,flow.sff
                    ,flow.sbf
                    ,flow.bbfb
                    ,flow.bbff
                    ,flow.bbbf
                    ,flow.fb1
                    ,flow.fb2
                    ,flow.ff1
                    ,flow.ffb
                    ,flow.ff2
                    ,flow.bf1
                    ,flow.bf2
                    ,flow.fbb
                    ,flow.bfb
                    ,flow.fbfb
                    ,flow.bfbf
                ]
                var flow_focused=[
                     scope.data.focused_flow.sbb
                    ,scope.data.focused_flow.sfb
                    ,scope.data.focused_flow.sff
                    ,scope.data.focused_flow.sbf
                    ,scope.data.focused_flow.bbfb
                    ,scope.data.focused_flow.bbff
                    ,scope.data.focused_flow.bbbf
                    ,scope.data.focused_flow.fb1
                    ,scope.data.focused_flow.fb2
                    ,scope.data.focused_flow.ff1
                    ,scope.data.focused_flow.ffb
                    ,scope.data.focused_flow.ff2
                    ,scope.data.focused_flow.bf1
                    ,scope.data.focused_flow.bf2
                    ,scope.data.focused_flow.fbb
                    ,scope.data.focused_flow.bfb
                    ,scope.data.focused_flow.fbfb
                    ,scope.data.focused_flow.bfbf
                ]
                var flow_1st=[
                     scope.data.flow_1st.sbb
                    ,scope.data.flow_1st.sfb
                    ,scope.data.flow_1st.sff
                    ,scope.data.flow_1st.sbf
                    ,scope.data.flow_1st.bbfb
                    ,scope.data.flow_1st.bbff
                    ,scope.data.flow_1st.bbbf
                    ,scope.data.flow_1st.fb1
                    ,scope.data.flow_1st.fb2
                    ,scope.data.flow_1st.ff1
                    ,scope.data.flow_1st.ffb
                    ,scope.data.flow_1st.ff2
                    ,scope.data.flow_1st.bf1
                    ,scope.data.flow_1st.bf2
                    ,scope.data.flow_1st.fbb
                    ,scope.data.flow_1st.bfb
                    ,scope.data.flow_1st.fbfb
                    ,scope.data.flow_1st.bfbf
                ]
                var flow_2nd=[
                     scope.data.flow_2nd.sbb
                    ,scope.data.flow_2nd.sfb
                    ,scope.data.flow_2nd.sff
                    ,scope.data.flow_2nd.sbf
                    ,scope.data.flow_2nd.bbfb
                    ,scope.data.flow_2nd.bbff
                    ,scope.data.flow_2nd.bbbf
                    ,scope.data.flow_2nd.fb1
                    ,scope.data.flow_2nd.fb2
                    ,scope.data.flow_2nd.ff1
                    ,scope.data.flow_2nd.ffb
                    ,scope.data.flow_2nd.ff2
                    ,scope.data.flow_2nd.bf1
                    ,scope.data.flow_2nd.bf2
                    ,scope.data.flow_2nd.fbb
                    ,scope.data.flow_2nd.bfb
                    ,scope.data.flow_2nd.fbfb
                    ,scope.data.flow_2nd.bfbf
                ]
                var flow_selected=[
                     scope.data.selected_flow.sbb
                    ,scope.data.selected_flow.sfb
                    ,scope.data.selected_flow.sff
                    ,scope.data.selected_flow.sbf
                    ,scope.data.selected_flow.bbfb
                    ,scope.data.selected_flow.bbff
                    ,scope.data.selected_flow.bbbf
                    ,scope.data.selected_flow.fb1
                    ,scope.data.selected_flow.fb2
                    ,scope.data.selected_flow.ff1
                    ,scope.data.selected_flow.ffb
                    ,scope.data.selected_flow.ff2
                    ,scope.data.selected_flow.bf1
                    ,scope.data.selected_flow.bf2
                    ,scope.data.selected_flow.fbb
                    ,scope.data.selected_flow.bfb
                    ,scope.data.selected_flow.fbfb
                    ,scope.data.selected_flow.bfbf
                ]

                if(!flow.sbb){

                    flow_total=[
                         0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                    ]
                    flow_focused=[
                         0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                    ]
                    flow_1st=[
                         0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                    ]
                    flow_2nd=[
                         0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                    ]
                    flow_selected=[
                         0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                        ,0
                    ]
                }


                //var max_count=Math.max.apply(Math,scope.data.flow.flow.map(function(o){return o.count;}))
                var max_count=Math.max(...flow_total);
                //console.log(flow_total,max_count);
                if(max_count)
                    lines.forEach(function(d,i){
                        if(scope.data.Sum_flow){
                            lines[i].width=flowRange*flow_total[i]/max_count;
                            lines[i].focused=(flow_focused[i]>0)
                            lines[i].selectedw=flowRange*flow_selected[i]/max_count;
                        }
                        else{
                            lines[i].w1=flowRange*flow_1st[i]/max_count;
                            lines[i].w2=flowRange*flow_2nd[i]/max_count;
                        }
                    })

                // Switch Position
                if (scope.data.Switch_pos){
                    switchFlow(lines,1,3);
                    switchFlow(lines,4,6);
                    switchFlow(lines,7,13);
                    switchFlow(lines,8,12);
                    switchFlow(lines,9,11);
                    switchFlow(lines,14,15);
                    switchFlow(lines,16,17);
                }

                var svgNodes = svg.selectAll(".node").data(nodes);

                // 1.nodes

                /*
                svgNodes.enter().append("circle")
                    .attr("class","node")
                    .attr("r",function(d){return r;})
                    .attr("cx",function(d){return d.x})
                    .attr("cy",function(d){return d.y})
                    */
                svgNodes.enter().append("rect")
                    .attr("class","node")
                    .attr("width",function(d){return r*2;})
                    .attr("height",function(d){return r*2;})
                    .attr("x",function(d){return d.x-r})
                    .attr("y",function(d){return d.y-r})
                    .on('mouseover', function (d) {
                        // console.log("mouse over");
                        scope.$apply(function(){
                            scope.data.onSelectedFlowNode(d, redraw);
                        });
                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedFlowNode();
                        redraw();
                    })
                svgNodes
                    .attr("width",function(d){return r*2;})
                    .attr("height",function(d){return r*2;})
                    .attr("x",function(d){return d.x-r})
                    .attr("y",function(d){return d.y-r})
                svgNodes.exit().remove();

                var svgText = svg.selectAll("text").data(nodes);
                svgText.enter()
                    .append("text")
                    .text(function(d){return d.name})
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y+r/2;
                    })
                svgText
                    .text(function(d){return d.name})
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y+r/2;
                    })

                svgText.exit().remove();

                function diagonal(indexS, indexD) {
                    var topBias=14;
                    var bottomBias=14;
                    var path;
                    if(indexS==4&&indexD==2){
                        /*
                        var s={x:nodes[indexS].x-r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x+r,y:nodes[indexD].y}
                        path = `M ${s.x} ${s.y}
                                C ${s.x-3*r} ${s.y},
                                  ${s.x-3*r} ${s.y-topBias*r},
                                  ${(s.x+d.x)/2} ${s.y-topBias*r}
                                C ${d.x+3*r} ${d.y-topBias*r},
                                  ${d.x+3*r} ${d.y},
                                  ${d.x} ${d.y}`
                        */
                        var s={x:nodes[indexS].x,y:nodes[indexS].y-r}
                        var d={x:nodes[indexD].x,y:nodes[indexD].y-r}
                        path = `M ${s.x} ${s.y}
                                C ${s.x} ${s.y-topBias*r},
                                  ${d.x} ${d.y-topBias*r},
                                  ${d.x} ${d.y}`

                    }
                    else if(indexS==2&&indexD==4){
                        var s={x:nodes[indexS].x+r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x-r,y:nodes[indexD].y}
                        path = `M ${s.x                 } ${s.y}
                                C ${s.x+biasBottomW     } ${s.y},
                                  ${s.x+biasBottomW     } ${s.y+bottomBias*r},
                                  ${(s.x+d.x)/2         } ${s.y+bottomBias*r}
                                C ${d.x-biasBottomW     } ${d.y+bottomBias*r},
                                  ${d.x-biasBottomW     } ${d.y},
                                  ${d.x                 } ${d.y}`

                    }
                    else if(indexS==0&&indexD==1){
                        var s={x:nodes[indexS].x+r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x-r,y:nodes[indexD].y}
                        path = `M ${s.x} ${s.y}
                                L  ${d.x} ${d.y}`

                    }
                    else if(indexS==4&&indexD==4){
                        var x=nodes[indexS].x;
                        var y=nodes[indexS].y;
                        path = `M ${x         } ${y+r}
                                C ${x         } ${y+biasEarH},
                                  ${x-biasEarW} ${y+biasEarH},
                                  ${x-biasEarW} ${y}
                                C ${x-biasEarW} ${y-biasEarH},
                                  ${x         } ${y-biasEarH},
                                  ${x         } ${y-r}`
                    }
                    else if(indexS==2&&indexD==2){
                        var x=nodes[indexS].x;
                        var y=nodes[indexS].y;
                        path = `M ${x         } ${y+r}
                                C ${x         } ${y+biasEarH},
                                  ${x+biasEarW} ${y+biasEarH},
                                  ${x+biasEarW} ${y}
                                C ${x+biasEarW} ${y-biasEarH},
                                  ${x         } ${y-biasEarH},
                                  ${x         } ${y-r}`
                    }
                    else{
                        var s={x:nodes[indexS].x,y:nodes[indexS].y+r}
                        var d={x:nodes[indexD].x,y:nodes[indexD].y-r}
                        path = `M ${s.x} ${s.y}
                                C ${s.x} ${(s.y + d.y) / 2},
                                  ${d.x} ${(s.y + d.y) / 2},
                                  ${d.x} ${d.y}`
                    }
                    return path
                }

                function drawTube(b){
                    var svgLinkTube = svg.selectAll(".linktube").data(b?lines:[]);
                    svgLinkTube.enter().insert('path', "g")
                        .attr("class", "linktube")
                        .attr('d', function(d){
                            return diagonal(d.s, d.d)
                        })
                    svgLinkTube
                        .attr('d', function(d){
                            return diagonal(d.s, d.d)
                        })
                    svgLinkTube.exit().remove();
                }

                drawTube(scope.data.Show_tube);


                // 2.links
                var svgLink = svg.selectAll(".link").data(lines);
                svgLink.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.width})
                    .on('mouseover', function (d) {
                        // console.log("mouse over");
                        scope.data.onSelectedFlow(d, redraw);
                        redraw();

                    })
                    .on('mouseleave', function (d) {
                        // console.log("mouse leave");
                        scope.data.onUnSelectedFlow();
                        redraw();
                    })
                svgLink
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.width})
                svgLink.exit().remove();

                var svgFocusedLink = svg.selectAll(".linkfocused").data(lines);
                svgFocusedLink.enter().append('path', "g")
                    .attr("class", "linkfocused")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.focused? flowRange/max_count:0
                    })
                svgFocusedLink
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.focused? flowRange/max_count:0
                    })
                svgFocusedLink.exit().remove();

                var svgLink1 = svg.selectAll(".link1").data(lines);
                svgLink1.enter().append('path', "g")
                    .attr("class", "link1")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.w1})
                svgLink1
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.w1})
                svgLink1.exit().remove();

                var svgLink2 = svg.selectAll(".link2").data(lines);
                svgLink2.enter().append('path', "g")
                    .attr("class", "link2")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.w2})
                svgLink2
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.w2})
                svgLink2.exit().remove();

                var svgLinkSelected = svg.selectAll(".linkselected").data(lines);
                svgLinkSelected.enter().append('path', "g")
                    .attr("class", "linkselected")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.selectedw})
                svgLinkSelected
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.selectedw})
                svgLinkSelected.exit().remove();

                var flow_player1=scope.data.flow_player1;
                var flow_player2=scope.data.flow_player2;


                // 3.for players
                if(flow_player1.b)
                {
                    var nodes1=[
                        {x:middle-400   ,y:000,name:"S"}
                        ,{x:middle-450  ,y:160,name:"B"}
                        ,{x:middle-350  ,y:160,name:"F"}
                        ,{x:middle-480  ,y:320,name:"1"}
                        ,{x:middle-400  ,y:320,name:"B"}
                        ,{x:middle-320  ,y:320,name:"2"}
                    ]
                    var nodes2=[
                        {x:middle+400   ,y:000,name:"S"}
                        ,{x:middle+450  ,y:160,name:"B"}
                        ,{x:middle+350  ,y:160,name:"F"}
                        ,{x:middle+480  ,y:320,name:"1"}
                        ,{x:middle+400  ,y:320,name:"B"}
                        ,{x:middle+320  ,y:320,name:"2"}
                    ]
                    var maxW=flow_player1.b+flow_player1.f;
                    var lines1=[
                         {s:0,d:1,width:flow_player1.b, w1:0,w2:0,selectedw:0,focused:false,name:"b"}
                        ,{s:0,d:2,width:flow_player1.f, w1:0,w2:0,selectedw:0,focused:false,name:"f"}
                        ,{s:1,d:3,width:flow_player1.b1,w1:0,w2:0,selectedw:0,focused:false,name:"b1"}
                        ,{s:1,d:4,width:flow_player1.bb,w1:0,w2:0,selectedw:0,focused:false,name:"bb"}
                        ,{s:1,d:5,width:flow_player1.b2,w1:0,w2:0,selectedw:0,focused:false,name:"b2"}
                        ,{s:2,d:3,width:flow_player1.f1,w1:0,w2:0,selectedw:0,focused:false,name:"f1"}
                        ,{s:2,d:4,width:flow_player1.fb,w1:0,w2:0,selectedw:0,focused:false,name:"fb"}
                        ,{s:2,d:5,width:flow_player1.f2,w1:0,w2:0,selectedw:0,focused:false,name:"f2"}
                    ]
                    var lines2=[
                         {s:0,d:1,width:flow_player2.b, w1:0,w2:0,selectedw:0,focused:false,name:"b"}
                        ,{s:0,d:2,width:flow_player2.f, w1:0,w2:0,selectedw:0,focused:false,name:"f"}
                        ,{s:1,d:3,width:flow_player2.b1,w1:0,w2:0,selectedw:0,focused:false,name:"b1"}
                        ,{s:1,d:4,width:flow_player2.bb,w1:0,w2:0,selectedw:0,focused:false,name:"bb"}
                        ,{s:1,d:5,width:flow_player2.b2,w1:0,w2:0,selectedw:0,focused:false,name:"b2"}
                        ,{s:2,d:3,width:flow_player2.f1,w1:0,w2:0,selectedw:0,focused:false,name:"f1"}
                        ,{s:2,d:4,width:flow_player2.fb,w1:0,w2:0,selectedw:0,focused:false,name:"fb"}
                        ,{s:2,d:5,width:flow_player2.f2,w1:0,w2:0,selectedw:0,focused:false,name:"f2"}
                    ]
                    if(!scope.data.Show_individual){
                        nodes1=[];
                        nodes2=[];
                        lines1=[];
                        lines2=[];
                    }
                    function playerDiagnal(nodeS,nodeD){
                        var s={x:nodeS.x,y:nodeS.y+r}
                        var d={x:nodeD.x,y:nodeD.y-r}
                        var path = `M ${s.x} ${s.y}
                                C ${s.x} ${(s.y + d.y) / 2},
                                  ${d.x} ${(s.y + d.y) / 2},
                                  ${d.x} ${d.y}`
                        return path;
                    }
                    var svgNodes1 = svg.selectAll(".node1").data(nodes1);
                    svgNodes1.enter().append("rect")
                        .attr("class","node1")
                        .attr("width",function(d){return r*2;})
                        .attr("height",function(d){return r*2;})
                        .attr("x",function(d){return d.x-r})
                        .attr("y",function(d){return d.y-r})
                    svgNodes1
                        .attr("width",function(d){return r*2;})
                        .attr("height",function(d){return r*2;})
                        .attr("x",function(d){return d.x-r})
                        .attr("y",function(d){return d.y-r})
                    svgNodes1.exit().remove();

                    var svgLinkplayer1 = svg.selectAll(".linkplayer1").data(lines1);
                    svgLinkplayer1.enter().append('path', "g")
                        .attr("class", "linkplayer1")
                        .attr('d', function(d){
                            return playerDiagnal(nodes1[d.s], nodes1[d.d])
                        })
                        .style("stroke-width", function(d){return d.width})
                    svgLinkplayer1
                        .attr('d', function(d){
                            return playerDiagnal(nodes1[d.s], nodes1[d.d])
                        })
                        .style("stroke-width", function(d){return d.width})
                    svgLinkplayer1.exit().remove();


                    var svgNodes2 = svg.selectAll(".node2").data(nodes2);
                    svgNodes2.enter().append("rect")
                        .attr("class","node2")
                        .attr("width",function(d){return r*2;})
                        .attr("height",function(d){return r*2;})
                        .attr("x",function(d){return d.x-r})
                        .attr("y",function(d){return d.y-r})
                    svgNodes2
                        .attr("width",function(d){return r*2;})
                        .attr("height",function(d){return r*2;})
                        .attr("x",function(d){return d.x-r})
                        .attr("y",function(d){return d.y-r})
                    svgNodes2.exit().remove();

                    var svgLinkplayer2 = svg.selectAll(".linkplayer2").data(lines2);
                    svgLinkplayer2.enter().append('path', "g")
                        .attr("class", "linkplayer2")
                        .attr('d', function(d){
                            return playerDiagnal(nodes2[d.s], nodes2[d.d])
                        })
                        .style("stroke-width", function(d){return d.width})
                    svgLinkplayer2
                        .attr('d', function(d){
                            return playerDiagnal(nodes2[d.s], nodes2[d.d])
                        })
                        .style("stroke-width", function(d){return d.width})
                    svgLinkplayer2.exit().remove();


                    var svgText1 = svg.selectAll(".text1").data(nodes1);
                    svgText1.enter()
                        .append("text")
                        .attr("class", "text1")
                        .text(function(d){return d.name})
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function(d) {
                            return d.y+r/2;
                        })
                    svgText1
                        .text(function(d){return d.name})
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function(d) {
                            return d.y+r/2;
                        })

                    svgText1.exit().remove();

                    var svgText2 = svg.selectAll("text2").data(nodes2);
                    svgText2.enter()
                        .append("text")
                        .attr("class", "text2")
                        .text(function(d){return d.name})
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function(d) {
                            return d.y+r/2;
                        })
                    svgText2
                        .text(function(d){return d.name})
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function(d) {
                            return d.y+r/2;
                        })

                    svgText2.exit().remove();
                }


            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.flow', redraw);
            scope.$watch('data.focused_flow', redraw);
            scope.$watch('data.Sum_flow', redraw);
            scope.$watch('data.Switch_pos', redraw);
            scope.$watch('data.Show_tube', redraw);
            scope.$watch('data.Show_individual', redraw);
        }
        tacticFlowChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});