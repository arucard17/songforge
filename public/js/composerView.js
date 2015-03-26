
// Composer View

var ComposerView = Backbone.View.extend({
    
    events: {},

    initialize: function(id) {            

        var that = this;

        this.sounds = [
            {
                id: 5,
                name: 'DO',
                notas: [
                    {
                        id: 1,
                        file: 'DO_NEGRA.mp3',
                        type: 1 
                    }
                ],
            },{
                id: 6,
                name: 'SI',
                notas: [
                    {
                        id: 1,
                        file: 'SI_NEGRA.mp3',
                        type: 1 
                    }
                ]
            },{
                id: 7,
                name: 'LA',
                notas: [
                    {
                        id: 1,
                        file: 'LA_NEGRA.mp3',
                        type: 1 
                    }
                ],
            },{
                id: 8,
                name: 'FA',
                notas: [
                    {
                        id: 1,
                        file: 'FA_NEGRA.mp3',
                        type: 1 
                    }
                ],
            },{
                id: 9,
                name: 'MI',
                notas: [
                    {
                        id: 1,
                        file: 'MI_NEGRA.mp3',
                        type: 1 
                    }
                ],
            },{
                id: 10,
                name: 'RE',
                notas: [
                    {
                        id: 1,
                        file: 'RE_NEGRA.mp3',
                        type: 1 
                    }
                ],
            }
        ];

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


        this.loadNav();
        this.isBtnActive();
        this.setupControl();

    },

    loadNav: function(){

        this.$navBar.empty();

        for(var n in this.sounds){
            this.$navBar.append(this.templateMenu(this.sounds[n]));
        }

        $('.note-add a', this.$navBar).on('click', $.proxy(this.onClickSound, this));

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
        var parentId = $el.data('parent');

        var sound = _.find(this.sounds, function(sound){
            console.log(parentId, sound);
            return parentId == sound.id;
        });

        this.addSound(_.cloneToDepth(sound.notas[0]), sound.id);

    },

    addSound: function(sound, parent){
        if(!this.isPlaying){
            sound.audio = new Audio();
            sound.audio.autoplay = false;
            sound.audio.src = this.path + sound.file;
            sound.parent = parent;
            sound._id = "nota_" + (this.secuencia.length+1);

            console.log(sound, this.secuencia.length+1);
            sound.$el = this.addElementPanel(sound, (this.secuencia.length+1));

            this.secuencia.push(sound);
            this.updateSaveStatus();
        }
    },

    addElementPanel: function(sound, index){
        var $el = $(this.templatePanel({"sound": sound, "index": index}));

        // $el.addClass('animated rollIn');

        $el.appendTo($('.line:eq('+ sound.parent +')', this.$pentagram));
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

