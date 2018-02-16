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
            var margin = {top: 20, right: 50, bottom: 70, left: 50};
            var svgBGW=1000;
            var svgBGH=800;
            var svgW = svgBGW - margin.left - margin.right;
            var svgH = svgBGH - margin.top - margin.bottom;


            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgBGW).attr("height",svgBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //    var svgArrows = svg.selectAll(".arrow");

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgBGW = el[0].clientWidth;
                svgBGH = el[0].clientHeight;

                return svgBGW + svgBGH;
            }, resize);
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
                var r=20;
                var nodes=[
                    {x:350,y:100,name:"S"}
                    ,{x:450,y:100,name:"BB"}
                    ,{x:200,y:300,name:"FB"}
                    ,{x:400,y:300,name:"FF"}
                    ,{x:600,y:300,name:"BF"}
                    ,{x:200,y:500,name:"1"}
                    ,{x:400,y:500,name:"B"}
                    ,{x:600,y:500,name:"2"}
                    ]
                var lines=[
                     {s:0,d:1,width:0,w1:0,w2:0,selected:false}      //0BB
                    ,{s:0,d:2,width:0,w1:0,w2:0,selected:false}      //1FB
                    ,{s:0,d:3,width:0,w1:0,w2:0,selected:false}      //2FF
                    ,{s:0,d:4,width:0,w1:0,w2:0,selected:false}      //3BF
                    ,{s:1,d:2,width:0,w1:0,w2:0,selected:false}      //4FB
                    ,{s:1,d:3,width:0,w1:0,w2:0,selected:false}      //5FF
                    ,{s:1,d:4,width:0,w1:0,w2:0,selected:false}      //6BF
                    ,{s:2,d:5,width:0,w1:0,w2:0,selected:false}      //7FBF
                    ,{s:2,d:7,width:0,w1:0,w2:0,selected:false}      //8FBR\FBA
                    ,{s:3,d:5,width:0,w1:0,w2:0,selected:false}      //9FF1
                    ,{s:3,d:6,width:0,w1:0,w2:0,selected:false}      //10FFB
                    ,{s:3,d:7,width:0,w1:0,w2:0,selected:false}      //11FF2
                    ,{s:4,d:5,width:0,w1:0,w2:0,selected:false}      //12BFR\BFA
                    ,{s:4,d:7,width:0,w1:0,w2:0,selected:false}      //13BFF
                    ,{s:2,d:4,width:0,w1:0,w2:0,selected:false}      //14FBB
                    ,{s:4,d:2,width:0,w1:0,w2:0,selected:false}      //15BFB
                    ,{s:2,d:2,width:0,w1:0,w2:0,selected:false}      //16FBFB
                    ,{s:4,d:4,width:0,w1:0,w2:0,selected:false}      //17BFBF
                ]

                // var nodes=scope.data.flow.nodes;
                var flow=scope.data.flow;
                // fill data
                var widths=[
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
                var focused_flow=[
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



                //var max_count=Math.max.apply(Math,scope.data.flow.flow.map(function(o){return o.count;}))
                var max_count=Math.max(...widths);
                if(max_count)
                    lines.forEach(function(d,i){
                        if(scope.data.Sum_flow){
                            lines[i].width=30*widths[i]/max_count;
                            lines[i].selected=(focused_flow[i]>0)
                        }
                        else{
                            lines[i].w1=30*flow_1st[i]/max_count;
                            lines[i].w2=30*flow_2nd[i]/max_count;
                        }
                    })

                var svgNodes = svg.selectAll(".node").data(nodes);

                svgNodes.enter().append("circle")
                    .attr("class","node")
                    .attr("r",function(d){return r;})
                    .attr("cx",function(d){return d.x})
                    .attr("cy",function(d){return d.y})
                    .attr("stroke","red")
                    .attr("fill","white")
                svgNodes.exit().remove();

/*
                svgArrows=svgArrows.data(nodes);
                svgArrows.enter()
                    .append('svg:path')
                    .attr("class","arrow")
                    .attr('d', 'M0,-5L10,0L0,5')
                    .attr('fill', '#000')
                    .attr("refX",function(d){return d.x})
                    .attr("refY",function(d){return d.y})
                    .attr("transform",function(d){
                        return "translate(" + d.x+","+d.y + ") rotate( " + 90 + ")";
                    });
*/

                var svgText = svg.selectAll(".text").data(nodes);
                svgText.enter()
                    .append("text")
                    .attr("class","text")
                    .text(function(d){return d.name})
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y+r/2;
                    })
                    .attr("text-anchor", function(d) {
                        return "middle"
                    })
                    .style("font","20px sans-serif")

                svgText.exit().remove();

                function diagonal(indexS, indexD) {
                    var path;
                    if(indexS==2&&indexD==4){
                        var s={x:nodes[indexS].x-r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x+r,y:nodes[indexD].y}
                        path = `M ${s.x} ${s.y}
                                C ${s.x-3*r} ${s.y},
                                  ${s.x-3*r} ${s.y-15*r},
                                  ${(s.x+d.x)/2} ${s.y-15*r}
                                C ${d.x+3*r} ${d.y-15*r},
                                  ${d.x+3*r} ${d.y},
                                  ${d.x} ${d.y}`

                    }
                    else if(indexS==4&&indexD==2){
                        var s={x:nodes[indexS].x+r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x-r,y:nodes[indexD].y}
                        path = `M ${s.x} ${s.y}
                                C ${s.x+6*r} ${s.y},
                                  ${s.x+6*r} ${s.y+20*r},
                                  ${(s.x+d.x)/2} ${s.y+20*r}
                                C ${d.x-6*r} ${d.y+20*r},
                                  ${d.x-6*r} ${d.y},
                                  ${d.x} ${d.y}`

                    }
                    else if(indexS==0&&indexD==1){
                        var s={x:nodes[indexS].x+r,y:nodes[indexS].y}
                        var d={x:nodes[indexD].x-r,y:nodes[indexD].y}
                        path = `M ${s.x} ${s.y}
                                L  ${d.x} ${d.y}`

                    }
                    else if(indexS==2&&indexD==2){
                        var s={x:nodes[indexS].x,y:nodes[indexS].y+r}
                        var d={x:nodes[indexD].x,y:nodes[indexD].y-r}
                        path = `M ${s.x    } ${s.y}
                                C ${s.x    } ${s.y+2*r},
                                  ${s.x-3*r} ${s.y+2*r},
                                  ${d.x-3*r} ${d.y+r}
                                C ${d.x-3*r} ${d.y-2*r},
                                  ${d.x    } ${d.y-2*r},
                                  ${d.x    } ${d.y}`
                    }
                    else if(indexS==4&&indexD==4){
                        var s={x:nodes[indexS].x,y:nodes[indexS].y+r}
                        var d={x:nodes[indexD].x,y:nodes[indexD].y-r}
                        path = `M ${s.x    } ${s.y}
                                C ${s.x    } ${s.y+2*r},
                                  ${s.x+3*r} ${s.y+2*r},
                                  ${d.x+3*r} ${d.y+r}
                                C ${d.x+3*r} ${d.y-2*r},
                                  ${d.x    } ${d.y-2*r},
                                  ${d.x    } ${d.y}`
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

                var svgLinkTube = svg.selectAll(".linktube").data(lines);
                svgLinkTube.enter().insert('path', "g")
                    .attr("class", "linktube")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .attr("fill","none")
                    .attr("stroke","gray")
                    .style("stroke-width", 30)
                    .style("stroke-opacity", .05)

                svgLinkTube.exit().remove();
                var svgLink = svg.selectAll(".link").data(lines);
                svgLink.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.width})
                    .style("stroke-opacity", .2)
                    .style("stroke", "gray")
                svgLink
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.width})
                    .style("stroke-opacity", .2)
                    .style("stroke", "gray")
                svgLink.exit().remove();

                var svgSelectedLink = svg.selectAll(".selectedlink").data(lines);
                svgSelectedLink.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.selected? 30/max_count:0
                    })
                    .style("stroke-opacity", .6)
                    .style("stroke", "black")
                svgSelectedLink
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.selected? 30/max_count:0
                    })
                    .style("stroke-opacity", .6)
                    .style("stroke", "black")
                svgSelectedLink.exit().remove();
                var svgLink1 = svg.selectAll(".link1").data(lines);
                svgLink1.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.w1})
                    .style("stroke-opacity", .3)
                    .style("stroke", "blue")
                svgLink1
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.w1})
                    .style("stroke-opacity", .3)
                    .style("stroke", "blue")
                svgLink1.exit().remove();

                var svgLink2 = svg.selectAll(".link2").data(lines);
                svgLink2.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.w2})
                    .style("stroke-opacity", .3)
                    .style("stroke", "red")
                svgLink2
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.w2})
                    .style("stroke-opacity", .3)
                    .style("stroke", "red")
                svgLink2.exit().remove();

            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.flow', redraw);
            scope.$watch('data.focused_flow', redraw);
            scope.$watch('data.Sum_flow', redraw);
        }
        tacticFlowChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});