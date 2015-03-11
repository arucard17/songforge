var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/', router);
};

function handlerAll(req, res, next) {
    res.render('index', {
      title: 'SongForge'
    });
}

router.get('/api/compositions', function (req, res, next) {
	db.Composition.findAll().then(function (comps) {
    	res.json(comps);
    });
});

router.get('/api/sounds', function (req, res, next) {
	db.Sounds.findAll().then(function (sounds) {
    	res.json(sounds);
    });
});

router.get('/', handlerAll);
router.get('/*', handlerAll);
