
module.exports = function(app) {
	app.get('/ContourPlot',function(req,res){
        res.sendfile('./public/Contour Plot.html');
    });
    app.get('/HexagonalBinning',function(req,res){
        res.sendfile('./public/Hexagonal Binning.html');
    });
    app.get('/stackedBarChart',function(req,res){
        res.sendfile('./public/StackedBarChart.html');
    });
    app.get('/showReel',function(req,res){
        res.sendfile('./public/showReel.html');
    });
    app.get('/treemap',function(req,res){
        res.sendfile('./public/Treemap.html');
    });
    app.get('/HierarchicalPartitionLayout',function(req,res){
        res.sendfile('./public/Hierarchical Partition Layout.html');
    });
    app.get('/SunBurst',function(req,res){
        res.sendfile('./public/SunBurst.html');
    });
    app.get('/SimpleBarChartWithInteraction',function(req,res){
        res.sendfile('./public/SimpleBarChartWithInteraction.html');
    });
    app.get('/simpleToolTip',function(req,res){
        res.sendfile('./public/simpleToolTip.html');
    });
    app.get('/HorizontalStackedBarChart',function(req,res){
        res.sendfile('./public/HorizontalStackedBarChart.html');
    });
    app.get('/simpleAnimation',function(req,res){
        res.sendfile('./public/simpleAnimation.html');
    });
    app.get('/chainTransition',function(req,res){
        res.sendfile('./public/chainTransition.html');
    });
    app.get('/basicTactics',function(req,res){
        res.sendfile('./public/basicTactics.html');
    });

    app.get('/DirectedGraphEditor',function(req,res){
        res.sendfile('./public/DirectedGraphEditor.html');
    });
    app.get('/directionalArrows',function(req,res){
        res.sendfile('./public/directionalArrows.html');
    });
    app.get('/movingArrow',function(req,res){
        res.sendfile('./public/movingArrow.html');
    });
    app.get('/collapsibleTree',function(req,res){
        res.sendfile('./public/collapsibleTree.html');
    });
    app.get('/chord',function(req,res){
        res.sendfile('./public/chord.html');
    });
    app.get('/ribbon',function(req,res){
        res.sendfile('./public/ribbon.html');
    });
    app.get('/sankey',function(req,res){
        res.sendfile('./public/sankey.html');
    });
    app.get('/brush_zoom', function (req, res) {
        res.sendfile('./public/examples/brush_zoom.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    //
    app.get('/v1', function (req, res) {
        res.sendfile('./public/mainFencing.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
	    console.log("-----get* from "+req.host+" at "+Date());

		//res.sendfile('./public/mainFencing.html'); // load the single view file (angular will handle the page changes on the front-end)
        res.sendfile('./public/main2.html');
	});



};



























