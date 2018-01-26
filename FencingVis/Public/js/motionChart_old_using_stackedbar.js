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
            var margin = {top: 20, right: 20, bottom: 70, left: 40};
            var svgMotionBGW=1000;
            var svgMotionBGH=800;
            var svgMotionW = svgMotionBGW - margin.left - margin.right;
            var svgMotionH = svgMotionBGH - margin.top - margin.bottom;

            // 0.2.color
            var color = d3.scaleOrdinal(d3.schemeCategory20)

            var parseDate = d3.timeParse("%m/%Y")



            // 1.Add DOM elements
            var svgBG = d3.select(el[0]).append("svg").attr("width",svgMotionBGW).attr("height",svgMotionBGH);
            var svg=svgBG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var gAxisX=svg.append("g")
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
            //    console.log("redraw motion chart");
                var data=scope.data.motion;
                var stackKey = ["wounds", "other", "disease"];
            //    data.sort(function(a, b) { return b.total - a.total; });
                var stack = d3.stack()
                    .keys(stackKey)
                    /*.order(d3.stackOrder)*/
                    .offset(d3.stackOffsetNone);


                var layers= stack(data);

                var xScale = d3.scaleLinear()
                    .rangeRound([0, svgMotionW])
                    .domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();
                var yScale = d3.scaleBand()
                    .rangeRound([svgMotionH, 0]).padding(0.1)
                    .domain(data.map(function(d) { return parseDate(d.date); }));


                var xAxis = d3.axisBottom(xScale)
                var yAxis =  d3.axisLeft(yScale).tickFormat(d3.timeFormat("%b"));

                gAxisX
                    .attr("transform", "translate(0," + (svgMotionH+5) + ")")
                    .call(xAxis);

                gAxisY
                    .attr("transform", "translate(0,0)")
                    .call(yAxis);

                // this line used to remove the old data
                svg.selectAll(".layer")
                    .data({}).exit().remove();

                var layer = svg.selectAll(".layer")
                    .data(layers)
                    .enter().append("g")
                    .attr("class", "layer")
                    .style("fill", function(d, i) { return color(i); });

                layer.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter().append("rect")
                    .attr("y", function(d) { return yScale(parseDate(d.data.date)); })
                    .attr("x", function(d) { return xScale(d[0]); })
                    .attr("height", yScale.bandwidth())
                    .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });




            }
            redraw();




            scope.$watch('data', redraw);
        }
        motionChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});