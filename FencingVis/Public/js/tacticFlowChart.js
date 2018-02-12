/*
    dsp: directive to show the animation of a bout
    author: Mingdong
    logs:
        created
        2018/02/01
 */
mainApp.directive('tacticFlowChart', function () {
    function link(scope, el, attr) {
        function tacticFlowChart(){
            // 0.definition
            // 0.1.size
            var margin = {top: 20, right: 100, bottom: 70, left: 40};
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
                var r=20;
                console.log("redraw tactic flow chart");
                var nodes=scope.data.flow.nodes;
                var lines=scope.data.flow.flow;

                var max_count=Math.max.apply(Math,scope.data.flow.flow.map(function(o){return o.count;}))
                console.log(max_count)
                if(max_count)
                    lines.forEach(function(d,i){
                        lines[i].r=30*d.count/max_count;
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
                    if(indexS==1&&indexD==3){
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
                    else if(indexS==3&&indexD==1){
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
                    .attr("stroke","red")
                    .style("stroke-width", 30)
                    .style("stroke-opacity", .05)


                svgLinkTube.exit().remove();

                var svgLink = svg.selectAll(".link").data(lines);
                svgLink.enter().append('path', "g")
                    .attr("class", "link")
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){return d.r})
                    .style("stroke-opacity", .2)
                    .style("stroke", "#895621")

                svgLink
                    .attr('d', function(d){
                        return diagonal(d.s, d.d)
                    })
                    .style("stroke-width", function(d){
                        return d.r})
                    .style("stroke-opacity", .2)
                    .style("stroke", "#895621")

                svgLink.exit().remove();

            }
            redraw();



            scope.$watch('data', redraw);
            scope.$watch('data.flow', redraw);
        }
        tacticFlowChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});