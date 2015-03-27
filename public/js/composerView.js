
// Composer View

var ComposerView = Backbone.View.extend({
    
    events: {},

    initialize: function(id) {            

        var that = this;

        this.secuencia = [];
        this.audio = null; 

        this.isPlaying = false;

        this.path = "/sound/";

        this.model = {
            id : 0
        };

        this.$sounds = $('.soundsContainer .panel-body');
        this.$panels = $('.songContainer .panel-body');
        this.$pentagram = $('.pentagram');
        this.$save = $('#save');
        this.$navBar = $('.nav.navbar-nav');

        this.templateSound = _.template($('#tmpl-sound-element').html());
        this.templatePanel = _.template($('#tmpl-panel-element').html());
        this.templateMenu = _.template($('#tmpl-menu').html());

        $('.soundsContainer').css('display', 'block').addClass('animated bounceInLeft');
        $('.songContainer').css('display', 'block').addClass('animated bounceInRight');
        $('.navbar').css('display', 'block').addClass('animated bounceInRight');
        $('.page-header').css('display', 'block').addClass('animated bounceInDown');

        $('#play').on('click', $.proxy(this.onPlay, this));
        this.$save.on('click', $.proxy(this.onSave, this));

        if(id){
            this.loadModel(id, function (){
                that.isBtnActive();
                that.setupControl();
                that.updateSaveStatus();
            });
        }else{
            this.loadData();
            this.isBtnActive();
            this.setupControl();
        }
    },

    updateSaveStatus: function(){
        if(this.secuencia.length > 0)
            this.$save.prop('disabled', false);
        else
            this.$save.prop('disabled', true);
    },

    loadData: function(){
        var that = this;
        app.pushData('/api/types', {}, function(data){
            that.types = data;
            app.pushData('/api/notes', {}, $.proxy(that.loadNav, that), 'GET');
        }, 'GET');
    },

    loadNav: function(data){

        var that = this;

        this.$navBar.empty();

        this.sounds = data;

        for(var i in this.sounds){
            this.sounds[i].Sounds = _.map(this.sounds[i].Sounds, function(sound){
                sound.type = _.find(that.types, function(type){
                    return type.id == sound.idType
                });
                return sound;
            });
        }

        for(var n in this.sounds){
            this.$navBar.append(this.templateMenu(this.sounds[n]));
        }

        $('.note-add a', this.$navBar).on('click', $.proxy(this.onClickSound, this));

    },

    loadModel: function(id, cb){
        
        var that = this;

        app.pushData('/api/composition', {"id": id}, function(data){
            
            that.types = data.types;

            // Muestro los sonidos
            that.loadNav(data.notes);

            // Cargo la secuencia
            that.model.id = data.model.id;
            that.model.author = data.model.author;

            var sounds = that.getSequenceSound(data);

            console.log(sounds);

            for(var i in sounds){
                that.addSound(_.cloneToDepth(sounds[i]), sounds[i].note );
            }

            cb();

        }, 'POST');
    },

    getSequenceSound: function(data){

        var sequence = data.model.sequence.split(",");
        sequence = _.map(sequence, function(num){ return Number(num); });

        var sounds = [];

        for(var seq in sequence){
            for(var n in this.sounds){
                sound = _.find(this.sounds[n].Sounds, function(s){
                    return sequence[seq] == s.id;
                });

                if(sound){
                    sound.note = this.sounds[n];
                    sounds.push(sound);
                }
            }
            
        }


        return sounds;

    },


    isBtnActive: function(){
        $btn = $('#btnAdd');

        if(!$btn.is('.active')){
            $btn.addClass('active');
            $('i',$btn).removeClass('mdi-content-add')
                .addClass('mdi-navigation-close');
        }
    },

    setupControl: function(){

        this.control = {
            lockedState : false,
            val : 50, // Volumen
            $elm : $("#volumen"),
        };

        this.control.$elm.noUiSlider({
            start: this.control.val,
            connect: 'lower',
            range: {
                min: 0,
                max: 100
            }
        });

        this.control.$elm.on('set', $.proxy(this.onUpdateVolumen, this));

    },

    onUpdateVolumen: function(){
        this.control.val = this.control.$elm.val();
    },

    onClickSound: function(e){
        e.preventDefault();

        $el = $(e.currentTarget);
        var id = $el.data('id');
        var parentId = $el.data('parent');

        // Buscamos la nota
        var note = _.find(this.sounds, function(sound){
            return parentId == sound.id;
        });

        // Si existe la nota
        if(note){

            // Buscamos el sonido seleccionado
            var sound = _.find(note.Sounds, function(sound){
                return id == sound.id;
            });
                
            console.log(sound);

            if(sound)
                this.addSound(_.cloneToDepth(sound), note);
            else
                $.snackbar({content: "Error: no se encontró el sonido", timeout:3000});

        }else
            $.snackbar({content: "Error: no se encontró la nota"+ data.error, timeout:3000});


    },

    addSound: function(sound, parent){
        if(!this.isPlaying){
            sound.audio = new Audio();
            sound.audio.autoplay = false;
            sound.audio.src = this.path + sound.file;
            sound.parent = parent;
            sound._id = "nota_" + (this.secuencia.length+1);

            sound.$el = this.addElementPanel(sound, (this.secuencia.length+1));

            this.secuencia.push(sound);
            this.updateSaveStatus();
        }
    },

    addElementPanel: function(sound, index){
        var $el = $(this.templatePanel({"sound": sound, "index": index}));

        // $el.addClass('animated rollIn');

        $el.appendTo($('.line:eq('+ sound.parent.position +')', this.$pentagram));
        // $('#close', $el).on('click', $.proxy(this.onRemovePanel, this));

        return $el;
    },
  
    onRemovePanel: function(e){
        $el = $(e.currentTarget).parent();
        var id = $el.data('id');

        for(var i in this.secuencia){
            if(this.secuencia[i]._id == id){
                this.secuencia.splice(i, 1);
            }
        }
        this.updateSaveStatus();
        this.removeElementPanel($el);

    },

    removeElementPanel: function($el){
        $el.removeClass('animated rollIn')
            .addClass('animated rollOut');

        setTimeout(function(){
            $el.remove();
        }, 1000);

    },

    onPlay: function(e){
        if($(e.currentTarget).is('.active')){
            this.pauseAudio();
        }else{
            if(this.secuencia.length > 0){
                this.playAudio();
            }
        }
    },

    changeStatusPlay: function(action){
        var $play = $('#play');

        if(action == 'play'){
            $play.addClass('active');
            $('i' ,$play).removeClass().addClass('mdi-av-stop');
        }else{
            $play.removeClass('active');
            $('i' ,$play).removeClass().addClass('mdi-av-play-arrow');
            $('.active', this.$panels).removeClass('active');
        }
    },
    
    pauseAudio: function(){
        this.changeStatusPlay('pause');
        
        this.isPlaying = false;
        if(this.audio){
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    },

    playAudio: function (){

        var that = this;
        this.changeStatusPlay('play');

        this.isPlaying = true;

        async.eachSeries(this.secuencia, function(sound, callback) {
            
            if(that.isPlaying){

                sound.$el.parent().parent().find('.note').removeClass('active');
                sound.$el.addClass('active');

                sound.audio.volume = that.control.val / 100;
                that.audio = sound.audio;
                sound.audio.play();

                $(sound.audio).off('ended').on('ended', function (){
                    sound.audio.currentTime = 0;
                    callback();
                })

            }else{
                callback();
            }
        }, function(err) {
            $('.active', that.$panels).removeClass('active');
            that.pauseAudio();
        });

    },

    onSave: function(){
        var that = this;
        var sec = _.map(this.secuencia, function(el){
            return el.id;
        });

        app.pushData('/api/save', { "sequence": sec, "model" : this.model }, function(data){
            if(data.success){
                that.model.id = data.id;
                app.router.navigate("/"+ that.model.id);
                $.snackbar({content: "Secuencia guardada", timeout:2000});
            }else{
                $.snackbar({content: "Error: "+ data.error, timeout:0});
            }
        }, 'POST');
    },

    remove: function(){
        $('.soundsContainer').removeClass('animated bounceInDown').addClass('animated bounceOutLeft');
        $('.songContainer').removeClass('animated bounceInDown').addClass('animated bounceOutRight');
        $('.page-header').removeClass('animated bounceInDown').addClass('animated bounceOutUp');
        $('.navbar').removeClass('animated bounceInDown').addClass('animated bounceOutRight');
    }

});

