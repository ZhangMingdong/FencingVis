







mainApp.directive('statisticChart', function () {
    function link(scope, el, attr) {
        function statisticChart(){
            var svgWidth=400;
            var svgHeight=400;

            var w = 960,
                h = 500,
                x = d3.scale.linear().range([0, w]),
                y = d3.scale.linear().range([0, h]);

            var vis = d3.select(el[0]).append("div")
                .attr("class", "chart")
                .style("width", w + "px")
                .style("height", h + "px")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h).selectAll("g");

            var partition = d3.layout.partition()
                .value(function(d) { return (d.children_length + 15) * 30; });

            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgWidth = el[0].clientWidth;
                svgHeight = el[0].clientHeight;
            //    if(svgWidth<600) svgWidth=600;
            //    if(svgHeight<400) svgHeight=400;

                return svgWidth + svgHeight;
            }, resize);
            // response the size-change
            function resize() {
            //    console.log("====================resize barChart=================");
            //    console.log(svgWidth);
            //    console.log(svgHeight);
                redraw();
            }


            function redraw(){
                console.log("redraw statistic chart");
                var root=scope.data.tree;
                var g=vis
                    .data(partition.nodes(root))
                    .enter().append("g")
                    .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                    .on("click", click);

                var kx = w / root.dx,
                    ky = h / 1;

                g.append("svg:rect")
                    .attr("width", root.dy * kx)
                    .attr("height", function(d) { return d.dx * ky; })
                    .attr("class", function(d) { return d.children ? "parent" : "child"; });

                g.append("svg:text")
                    .attr("transform", transform)
                    .attr("dy", ".35em")
                    .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
                    .text(function(d) { return d.acronym; })
                //vis.exit().remove();

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
            scope.$watch('data.Data', redraw);

        }
        statisticChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});