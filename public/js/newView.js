
var NewView = Backbone.View.extend({
    
    events: {},

    initialize: function() {            

        this.secuencia = [];
        this.audio = null; 

        this.status = false;

        this.path = "/sound/";

        this.$sounds = $('.soundsContainer .panel-body');
        this.$panels = $('.songContainer .panel-body');

        this.templateSound = _.template($('#tmpl-sound-element').html());
        this.templatePanel = _.template($('#tmpl-panel-element').html());

        $('.soundsContainer').css('display', 'block').addClass('animated bounceInDown');
        $('.songContainer').css('display', 'block').addClass('animated bounceInDown');
        $('.page-header').css('display', 'block').addClass('animated bounceInLeft');

        $('#play').on('click', $.proxy(this.onPlay, this));

        this.loadData();
        this.isBtnActive();
        this.setupControl();

    },

    loadData: function(){
        app.pushData('/api/compositions', {}, $.proxy(this.render, this), 'GET');
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

        this.addSound(sound);

    },

    addSound: function(sound){
        sound.audio = new Audio();
        sound.audio.src = this.path + sound.file;
        sound.$el = this.addElementPanel(sound);
        this.secuencia.push(sound);
    },
  
    onRemovePanel: function(e){
        $el = $(e.currentTarget).parent();
        var id = $el.data('id');

        for(var i in this.secuencia){
            if(this.secuencia[i].id == id){
                this.secuencia.slice(i, 1);
            }
        }

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
        }
    },
    
    pauseAudio: function(){
        this.changeStatusPlay('pause');
        
        this.status = false;
        this.audio.pause();
        // this.audio = null;
    },

    playAudio: function (){

        var that = this;
        this.changeStatusPlay('play');

        this.status = true;

        async.each(this.secuencia, function(sound, callback) {
            if(that.status){

                sound.$el.siblings().removeClass('active');
                sound.$el.addClass('active');

                sound.audio.volume = that.control.val / 100;
                that.audio = sound.audio;
                sound.audio.play();

                sound.audio.addEventListener("ended", onEnd);

                function onEnd(){
                    sound.audio.removeEventListener("ended", onEnd);
                    callback();
                }
                // setTimeout(function (){
                // }, sound.audio.duration);

            }else{
                callback();
            }
        }, function(err) {
            if(err) {
                console.log("There was an error" + err);
            } else {
                console.log("Loop is done");
            }

            $('.active', this.$panels).removeClass('active');
            that.pauseAudio();
        });

    },

    remove: function(){
        $('.soundsContainer').removeClass('animated bounceInDown').addClass('animated bounceOutUp');
        $('.songContainer').removeClass('animated bounceInDown').addClass('animated bounceOutUp');
        $('.page-header').removeClass('animated bounceInDown').addClass('animated bounceOutLeft');
    }

});

