
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
    app.get('/boutChartAnimationTest',function(req,res){
        res.sendfile('./public/boutChartAnimationTest.html');
    });
	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
	    console.log("-----get* from "+req.host+" at "+Date());

		res.sendfile('./public/mainFencing.html'); // load the single view file (angular will handle the page changes on the front-end)
	});



};



























