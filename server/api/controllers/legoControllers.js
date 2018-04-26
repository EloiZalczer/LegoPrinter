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
	return res.json(results.rows);
    });
};


exports.create_project = function(req, res) {
    var sql = "INSERT INTO PROJECT (project_name, last_modified, sizex, sizey, sizez) VALUES ($1, $2, $3, $4, $5)";
    console.log(req.body.project_name);
    pg.client.query(sql, [ req.body.project_name, new Date(), req.body.sizex, req.body.sizey, req.body.sizez ], function(err, results){
	if(err){
	    //console.log(sql, [ req.body.project_name, new Date(), req.body.sizex, req.body.sizey, req.body.sizez ]);
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not create project'] });
	}
    });
    sql = "SELECT project_id FROM PROJECT WHERE last_modified=(SELECT MAX(last_modified) FROM PROJECT)";
    pg.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not retrieve new project id']});
	}
	res.statusCode = 201;
	return res.json({results: results.rows[0]});
    });
};


exports.open_project = function(req, res) {
    var sql = 'SELECT * FROM PLACED_PIECES, PIECES WHERE project_id = $1 AND PLACED_PIECES.type=PIECES.type';
    pg.client.query(sql, [ req.params.project_id ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not open project'] });
	}
	res.statusCode = 200;
	console.log(results.rows);
	return res.json(results.rows);
    });
};


exports.save_project = function(req, res) {
    var sql = 'DELETE FROM PLACED_PIECES WHERE project_id = $1';
    pg.client.query(sql, [ req.params.project_id ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project : deletion failed'] });
	}
    });
    if(Object.keys(req.body).length === 0){
	return res.json({warning: ['Empty project']});
    }
    sql = 'INSERT INTO PLACED_PIECES VALUES ';
    console.log(req.params.project_id);
    for (var item in req.body){
	console.log(req.body[item]);
	sql+='('+req.params.project_id+', '+req.body[item].type+', '+req.body[item].orientation+', '+req.body[item].posx+', '+req.body[item].posy+', '+req.body[item].posz+", '"+req.body[item].color+"'),";
    }
    sql = sql.slice(0, -1);
    sql+=';';
    console.log(sql);
    pg.client.query(sql, function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project : insertion failed'] });
	}
	
    });
    sql = 'UPDATE PROJECT SET last_modified = $1 WHERE project_id = $2';
    console.log(sql);
    pg.client.query(sql, [ new Date(), req.params.project_id ], function(err, results){
	if(err){
	    console.error(err);
	    res.statusCode = 500;
	    return res.json({errors: ['Could not save project : new date setting failed'] });
	}
	res.statusCode = 200;
	return res.json(results);
    });
};


exports.delete_project = function(req, res) {
    var sql = 'DELETE FROM PLACED_PIECES WHERE project_id = $1';
    var project_id = req.params.project_id;
    console.log("Received delete request : "+project_id);
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
	});
    });
}

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
	return res.json(results.rows);
    });
}

exports.list_colors = function(req, res){
    var sql = 'SELECT * FROM COLORS_MINIMAL';
    pg.client.query(sql, function(err, results){
        if(err){
            console.error(err);
            res.statusCode = 500;
            return res.json({errors: ['Could not load colors'] });
        }
        res.statusCode = 200;
        return res.json(results.rows);
    });
}
