
module.exports = function(app) {
	app.get('/1',function(req,res){
        res.sendfile('./public/Contour Plot.html');
    });
    app.get('/2',function(req,res){
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
	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
	    console.log("-----get* from "+req.host+" at "+Date());

		res.sendfile('./public/mainFencing.html'); // load the single view file (angular will handle the page changes on the front-end)
	});



};



























