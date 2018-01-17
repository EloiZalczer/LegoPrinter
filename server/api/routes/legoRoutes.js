'use strict';
module.exports = function(app) {
  var lego = require('../controllers/legoControllers');

    // todoList Routes
    app.route('/').get(lego.mainpage);
  
  app.route('/tasks')
    .get(lego.list_projects)
    .post(lego.create_project);

  app.route('/tasks/:taskId')
    .get(lego.open_project)
    .put(lego.save_project)
    .delete(lego.delete_project);
};
