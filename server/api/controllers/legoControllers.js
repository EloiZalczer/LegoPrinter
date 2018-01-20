'use strict';

exports.list_projects = function(req, res) {
    res.json({test:"list_projects"});
};


exports.create_project = function(req, res) {
  res.json({test:"create_project"});
};


exports.open_project = function(req, res) {
  res.json({test:"open_project"});
};


exports.save_project = function(req, res) {
    console.log(req.body);
    var sql = 'SELECT * FROM PROJET';
    postgres.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project'] });
	}
    });
  res.json({test:"save_project"});
};


exports.delete_project = function(req, res) {
  res.json({test:"delete_project"});
};

exports.mainpage = function(req, res){
    res.render('lego_main.html');
};
