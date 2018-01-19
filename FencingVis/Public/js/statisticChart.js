﻿







mainApp.directive('statisticChart', function () {
    function link(scope, el, attr) {
        function statisticChart(){
            var width = 600,
                height = 400,
                x = d3.scale.linear().range([0, width]),
                y = d3.scale.linear().range([0, height]);

            // L1
            var div = d3.select(el[0]).append("div")
                .attr("class", "chart")
                .style("width", width + "px")
                .style("height", height + "px")
            // L2
            var svg=div.append("svg:svg")
                .attr("width", width)
                .attr("height", height)

            // L3
            var vis = svg.selectAll("vis");

            var partition = d3.layout.partition()
                .value(function(d) { return (d.children_length + 15) * 30; });

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                width = el[0].clientWidth;
                height = el[0].clientHeight;
                if(width<600) width=700;
                if(height<400) height=400;
            //    console.log("w:"+width);
            //    console.log("h:"+height);
                return width+height;
            }, resize);
            // response the size-change
            function resize() {
            //    console.log("====================resize barChart=================");
            //    console.log(svgWidth);
            //    console.log(svgHeight);
                redraw();
            }


            function redraw(){
            //    console.log("redraw statistic chart");

                div
                    .style("width", width + "px")
                    .style("height", height + "px")
                svg
                    .attr("width", width)
                    .attr("height", height)

                x.range([0,width]);
                y.range([0,height]);


                var root=scope.data;
                vis=vis.data({});
                vis.exit().remove();



                console.log(root);
                vis=vis
                    .data(partition.nodes(root))
                console.log(root);

                var kx = width / root.dx,
                    ky = height / 1;

                // L4
                var g=vis
                    .enter().append("g")
                    .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                    .on("click", click);



                g.append("rect")
                    .attr("width", root.dy * kx)
                    .attr("height", function(d) { return d.dx * ky; })
                    .attr("class", function(d) { return d.children ? "parent" : "child"; });

                g.append("text")
                    .attr("transform", transform)
                    .attr("dy", ".35em")
                    .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
                    .text(function(d) { return d.acronym+"("+d.count+")"; })



                vis.exit().remove();


                d3.select(window)
                    .on("click", function() { click(root); })

                function click(d) {
                    redraw();

                }

                function transform(d) {
                    return "translate(8," + d.dx * ky / 2 + ")";
                }




            }
            redraw();

            scope.$watch('data', redraw);

        }
        statisticChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});



