﻿/*
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
            //    var data=scope.data.motion;
                var data = [{"salesperson":"Bob","sales":33},{"salesperson":"Robin","sales":12},{"salesperson":"Anne","sales":41},{"salesperson":"Mark","sales":16},{"salesperson":"Joe","sales":59},{"salesperson":"Eve","sales":38},{"salesperson":"Karen","sales":21},{"salesperson":"Kirsty","sales":25},{"salesperson":"Chris","sales":30},{"salesperson":"Lisa","sales":47},{"salesperson":"Tom","sales":5},{"salesperson":"Stacy","sales":20},{"salesperson":"Charles","sales":13},{"salesperson":"Mary","sales":29}];

// set the dimensions and margins of the graph
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

// set the ranges
                var y = d3.scaleBand()
                    .range([height, 0])
                    .padding(0.1);

                var x = d3.scaleLinear()
                    .range([0, width]);



                // format the data
                data.forEach(function(d) {
                    d.sales = +d.sales;
                });

                // Scale the range of the data in the domains
                x.domain([0, d3.max(data, function(d){ return d.sales; })])
                y.domain(data.map(function(d) { return d.salesperson; }));
                //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

                // append the rectangles for the bar chart
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    //.attr("x", function(d) { return x(d.sales); })
                    .attr("width", function(d) {return x(d.sales); } )
                    .attr("fill",function(d){return color(0)})
                    .attr("y", function(d) { return y(d.salesperson); })
                    .attr("height", y.bandwidth());


                // add the x Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // add the y Axis
                svg.append("g")
                    .call(d3.axisLeft(y));
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