var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    shortId = require('shortid'),
    async = require('async'),
    multer  = require('multer'),
    db = require('../models');

var done = false;

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


router.delete('/api/composition/:id', function (req, res, next) {

    var id = req.params.id;

    // fs.unlinkSync('./public/sound/do11426188751026.mp3');

    db.Composition
        .find({where:{id: id }})
        .then(function(comp){

            var file = comp.file;

            comp.destroy().then(function(){
                res.json({success: true});
            }).error(function(err){
                res.json({success:false, errors: 'Error al eliminar el registro.'});
            })

        })
        .error(function(err){
            res.json({success:false, errors: 'Error: No se encontró la composición.'})
        });

});

router.get('/api/sounds', function (req, res, next) {
  db.Sounds.findAll().then(function (sounds) {
      res.json(sounds);
    });
});

router.delete('/api/sound/:id', function (req, res, next) {

    var id = req.params.id;

    // fs.unlinkSync('./public/sound/do11426188751026.mp3');

    db.Sounds
        .find({where:{id: id }})
        .then(function(sound){

            var file = sound.file;

            sound.destroy().then(function(){
                try{
                    fs.unlinkSync('./public/sound/'+ file);
                    res.json({success: true})
                }catch(e){
                    res.json({success:false, errors: 'Error al eliminar el audio.'})
                }
            }).error(function(err){
                res.json({success:false, errors: 'Error al eliminar el registro.'})
            })

        })
        .error(function(err){
            res.json({success:false, errors: 'Error: No se encontró el sonido.'})
        });

});


// Save Sound

var m = multer({ dest: './public/sound',
     rename: function (fieldname, filename) {
        return filename+Date.now();
      },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
      done=true;
    },
    onError: function (error, next){
        console.log(error);
        next(error);
    }
 });

router.post('/api/sound', m, function (req, res, next) {

    var inputs = req.body;
    var file = req.files["file"];

    async.series({
        sound: function(callback){
            if(done){
                db.Sounds.create({
                    'name'      : inputs.name.replace(/"/g, ''),
                    'color'     : inputs.name.replace(/"/g, ''),
                    'file'      : file.name
                })
                .then(function(result){
                    callback(null, result);
                })
                .error(function(err){
                    callback(err, null);
                });
            }else
                callback({message: "Error al subir el audio."}, null);

        },
        sounds: function(callback){
            db.Sounds.findAll().then(function (sounds) {
                callback(null, sounds);
            });
        },
    },
    function(err, results) {
        if(err){
            res.json({"success": false, 'errors': err.message});
        }else
            res.json({"success": true, "sounds": results.sounds });
      
    });

});





//////////////////////
// Save Composition //
//////////////////////

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
