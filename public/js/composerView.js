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
        this.$save = $('#save');

        this.templateSound = _.template($('#tmpl-sound-element').html());
        this.templatePanel = _.template($('#tmpl-panel-element').html());

        $('.soundsContainer').css('display', 'block').addClass('animated bounceInDown');
        $('.songContainer').css('display', 'block').addClass('animated bounceInDown');
        $('.page-header').css('display', 'block').addClass('animated bounceInLeft');

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
            this.updateSaveStatus();
        }

    },

    updateSaveStatus: function(){
        if(this.secuencia.length > 0)
            this.$save.prop('disabled', false);
        else
            this.$save.prop('disabled', true);
    },

    loadData: function(){
        app.pushData('/api/compositions', {}, $.proxy(this.render, this), 'GET');
    },

    loadModel: function(id, cb){
        var that = this;
        app.pushData('/api/composition', {"id": id}, function(data){
            
            // Muestro los sonidos
            that.render(data.sounds);

            // Cargo la secuencia
            that.model.id = data.model.id;
            that.model.author = data.model.author;

            data.model.sequence = data.model.sequence.split(",");

            for(var i in data.model.sequence){
                that.renderOne(data.model.sequence[i]);
            }

            cb();

        }, 'POST');

    },

    renderOne: function(id){
        var sound = _.find(this.sounds, function(sound){
            return id == sound.id;
        });

        this.addSound(_.cloneToDepth(sound));
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

    loadData: function(){
        app.pushData('/api/sounds', {}, $.proxy(this.render, this), 'GET');
    },

    render: function(data){
        var that = this;

        this.sounds = data;
        this.$sounds.empty();

        _.each(data, function(el) {
            var $el = $(that.templateSound(el)).appendTo(that.$sounds);
            $el.on('click', $.proxy(that.onClickSound, that));
        });
    },

    onClickSound: function(e){
        e.preventDefault();
        $el = $(e.currentTarget);
        var id = $el.data('id');

        var sound = _.find(this.sounds, function(sound){
            return id == sound.id;
        });

        this.addSound(_.cloneToDepth(sound));

    },

    addSound: function(sound){
        if(!this.isPlaying){
            sound.audio = new Audio();
            sound.audio.autoplay = false;
            sound.audio.src = this.path + sound.file;
            sound._id = "panel_" + (this.secuencia.length+1);

            sound.$el = this.addElementPanel(sound);

            this.secuencia.push(sound);
            this.updateSaveStatus();
        }
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

    addElementPanel: function(sound){
        var $el = $(this.templatePanel(sound));

        $el.addClass('animated rollIn');

        $el.appendTo(this.$panels);
        $('#close', $el).on('click', $.proxy(this.onRemovePanel, this));

        return $el;
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

                sound.$el.siblings().removeClass('active');
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
        $('.soundsContainer').removeClass('animated bounceInDown').addClass('animated bounceOutUp');
        $('.songContainer').removeClass('animated bounceInDown').addClass('animated bounceOutUp');
        $('.page-header').removeClass('animated bounceInDown').addClass('animated bounceOutLeft');
    }

});

