'use strict';

var pg = require('../../lib/postgres');

exports.list_projects = function(req, res) {
    var sql = 'SELECT * FROM PROJECT';
    pg.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not load projects list'] });
	}
	res.statusCode = 200;
	return res.json(results);
    });
};


exports.create_project = function(req, res) {
    var sql = 'INSERT INTO PROJECT (project_name, last_modified, size_x, size_y, size_z) VALUES ($1, $2, $3, $4, $5)';
    pg.client.query(sql, [ req.params.project_name, new Date(), req.params.size_x, req.params.size_y, req.params.size_z ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not create project'] });
	}
	res.statusCode = 201;
	return res.json(results);
    });
};


exports.open_project = function(req, res) {
    var sql = 'SELECT * FROM PLACED_PIECES WHERE project_id = $1';
    pg.client.query(sql, [ req.params.project_id ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not open project'] });
	}
	res.statusCode = 201;
	return res.json(results);
    });
};


exports.save_project = function(req, res) {
    console.log(req.body);
    var sql = 'DELETE FROM PLACED_PIECES WHERE project_id = $1';
    pg.client.query(sql, [ req.params.project_id ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project'] });
	}
    });
    sql = 'INSERT INTO PLACED_PIECES VALUES ';
    for item in req.body{
	sql+='('+req.params.project_id+', '+item.type+', '+item.orientation+', '+item.position_x+', '+item.position_y+', '+item.position_z+'),';
    }
    sql = sql.slice(0, -1);
    sql+=';';
    pg.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project'] });
	}
	res.statusCode = 200;
	return res.json(results);
    })
};


exports.delete_project = function(req, res) {
    var sql = 'DELETE FROM PLACED_PIECES WHERE project_id = $1';
    var project_id = req.params.projectId;
    pg.client.query(sql, [ project_id ],function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not delete project pieces'] });
	}
	sql = 'DELETE FROM PROJECT WHERE project_id = $1';
	pg.client.query(sql, [ project_id ], function(err, results){
	    if(err){
		console.error(err);
		res.statusCode=500;
		return res.json({errors: ['Could not delete project'] });
	    }
	    res.statusCode = 200;
	    return res.json(results);
	)};
    });
    res.json({test:"delete_project"});
};

exports.mainpage = function(req, res){
    res.render('lego_main.html');
};

exports.list_pieces = function(req, res){
    var sql = 'SELECT * FROM PIECES';
    pg.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not load pieces'] });
	}
	res.statusCode = 200;
	return res.json(results);
    });
}
