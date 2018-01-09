







mainApp.directive('tacticsChart', function () {
    function link(scope, el, attr) {
        function barChart(){
            var svgWidth=400;
            var svgHeight=400;
            var margin = {top: 20, right: 20, bottom: 70, left: 40};
            var svgBG = d3.select(el[0]).append("svg");
            svg=svgBG
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            var topAxisSVG =svg.append("g").attr("class", "x axis");
            var bottomAxisSVG =svg.append("g").attr("class", "x axis");
            var yAxisSVG = svg.append("g").attr("class", "y axis");


            var bouts = svg.selectAll("bout");

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    if(d.all==undefined)
                        return "<strong>Score:</strong> <span style='color:red'>" + d.count+"</span>";
                    else
                        return "<strong>Frequency:</strong> <span style='color:red'>" + d.count+"/"+ d.all + "</span>";
                });
            svg.call(tip);


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

            // get the display field
            function getField1(d){
                if(d.tactic1=="a") return .4;
                else return .2;
            }
            function getField2(d){
                if(d.tactic2=="a") return .4;
                else return .2;
            }

            function redraw(){
                var data=scope.data.Data;

                var width = svgWidth - margin.left - margin.right;
                var height = svgHeight - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)

                svg
                    .attr("width", width)
                    .attr("height", height)


                var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                var y = d3.scale.linear().range([height, 0]);

                var topAxis = d3.svg.axis()
                    .scale(x)
                    .orient("top")

                var bottomAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);


                x.domain(data.map(function(d) { return d.name; }));
                //y.domain([0, d3.max(data, function(d) { return getField(d); })]);
                y.domain([0, 1]);

                topAxisSVG
                    .call(topAxis)
                bottomAxisSVG
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(bottomAxis)

                /*
                yAxisSVG
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("");
                    */

                bouts=bouts.data(data);

                var g=bouts.enter().append("g");
                g.append("rect")
                    .attr("class", "bar")
                    .attr("id","player1")
                g.append("rect")
                    .attr("class", "bar")
                    .attr("id","player2")


                bouts.selectAll("#player1")
                    .attr("x", function(d) { return x(d.name); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return height - y(getField1(d)); })
                    .attr("stroke","red")
                    .attr("fill",function(d){
                        return d.score==1? "red":"lightgray";
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('click',function(d){
                        scope.data.onClick(d.name);
                    });

                bouts.selectAll("#player2")
                    .attr("x", function(d) { return x(d.name); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(getField2(d)); })
                    .attr("height", function(d) { return height - y(getField2(d)); })
                    .attr("stroke","blue")
                    .attr("fill",function(d){
                        return d.score==2? "blue":"lightgray";
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('click',function(d){
                        scope.data.onClick(d.name);
                    });

                bouts.exit()
                    .remove();
            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.Data', redraw);

        }
        barChart();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});

