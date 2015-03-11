var express = require('express'),
  router = express.Router(),
  shortId = require('shortid'),
  async = require('async'),
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

router.post('/api/composition', function (req, res, next) {

    var id = req.body.id;

    async.series({
        model: function(callback){
        	db.Composition.find({where:{id: id }})
            .then(function (comp) {
                console.log(comp);
                callback(null, comp);
            })
            .error(function(err){
                console.log(err);
                callback(null, {});
            });
            
        },
        sounds: function(callback){
            db.Sounds.findAll().then(function (sounds) {
              callback(null, sounds);
            }).error(function(err){
                callback({});
            });
        },
    },
    function(err, results) {
        res.json(results);
    });


});

router.get('/api/sounds', function (req, res, next) {
  db.Sounds.findAll().then(function (sounds) {
      res.json(sounds);
    });
});

router.post('/api/save', function (req, res, next) {

    var data = req.body;

    if(data.model.id != 0){
        db.Composition
            .find({where:{id: data.model.id }})
            .then(function(comp){
                if(comp){
                    comp.sequence = data.sequence.toString();

                    comp.save().success(function(){
                        res.json({success: true, id: comp.id});
                    }).error(function(err) {
                        res.json({success: false, 'errors': err});
                    });
                }else{
                    res.json({success: false, 'errors': "No se encontró la composición."});
                }
            })
            .error(function(err){
                res.json({success: false, 'errors': err});
            });
    }else{
        var _data = {
            'id'        : shortId.generate(),
            'sequence'  : data.sequence.toString(),
        };

        if(data.author)
            _data.author = data.author;

        db.Composition.create(_data)
            .then(function(result){
                res.json({success: true, id: result.id});
            })
            .error(function(err){
                res.json({success: false, 'errors': err.message});
            });
    }


});

router.get('/', handlerAll);
router.get('/*', handlerAll);
