
var SoundView = Backbone.View.extend({
    
    events: {},

    initialize: function() {            

        this.$tbody = $('#tbody');
        this.$modal = $('#modal-sound');

        this.path = '/sound/';

        // Templates
        this.templateRow = _.template($('#tmpl-row-sound').html());

        //inicializo las variables para el paginador
        this.setpaginator();

        this.loadData();
        this.setupBtn();
        this.bindEvents();
    },

    loadData: function(){
        app.pushData('/api/sounds', {}, $.proxy(this.handleData, this), 'GET');
    },

    handleData: function(data){
        this.collection = data;

        // Actualizo el paginador
        this.updatePaginator();
        this.render();
    },

    bindEvents: function(){

        var that = this;

        // Add Sound
        $('#addSound').on('click', $.proxy(this.onClickAddSound, this));


        // Modal
        this.$modal.modal({
            show: false
        });
        this.$modal.off('shown.bs.modal').on('shown.bs.modal', function () {
            $('#name').focus();
        });

        this.$modal.on('hidden.bs.modal', function (){
            $('form', that.$modal)[0].reset();
        });

    },

    render: function(){
        var that = this;

        this.$tbody.empty();

        _.each(this.collection, function(el) {
            that.options.count++;
            if ((that.options.count >= that.options.ini) && (that.options.count <= that.options.lim))
                that.renderOne(el);
        });

        //Reseteo el Contador
        that.options.count = 0;
    },

    renderOne: function(el){
        var $el = $(this.templateRow(el)).appendTo(this.$tbody);
        $('a#playSound', $el).on('click', $.proxy(this.onPlaySound, this));
        $('a#removeSound', $el).on('click', $.proxy(this.onRemoveSound, this));
    },

    setupBtn: function(){
        $('#btnAdd').prop('disabled', 'disabled')
                    .addClass('disabled');
        // app.changeStatusBtnSound('active');

        $btn = $('#btnAddSound');

        if(!$btn.is('.active')){
            $btn.addClass('active');
            $('i', $btn).removeClass('mdi-av-my-library-music')
                .addClass('mdi-content-reply');
        }

    },


    /* ==========================================================================
       Paginador
       ========================================================================== */

    setpaginator: function() {
        this.options = {
            nitems: 5, // Numero de items a mostrar por cada pagina
            numPages: '', // Valor que depende de los modelos que traiga la BD
            ini: 1, //Limite minimo de la lista de la pag. actual
            lim: 5, // Limite Maximo de la lista de la pag. actual
            count: 0,
            pageactual: 1 //Pagina actual, Default 1
        };

        $('#pag-inicio').off('click').on('click', $.proxy(this.pagInicioAction, this));
        $('#pag-final').off('click').on('click', $.proxy(this.pagFinalAction, this));
    },

    nextAction: function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.options.numPages >= this.options.pageactual + 1)
            this.paginator(this.options.pageactual + 1);
    },

    prevAction: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.paginator(this.options.pageactual - 1);
    },

    pagInicioAction: function(e) {
        e.preventDefault();
        e.stopPropagation();
        // this.paginator(1);
        this.changePageAction(1);
    },

    pagFinalAction: function(e) {
        e.preventDefault();
        e.stopPropagation();
        // this.paginator(this.options.numPages);
        this.changePageAction(this.options.numPages);
    },

    changePageAction: function(e) {
        if(is_int(e)){
            var $pagination = $('.pagination');

            $el = $('li[data-page='+ e +']' ,$pagination);
            $el.siblings().removeClass('active');
            $el.addClass('active');

            this.paginator(e);
        }else{
            e.preventDefault();
            e.stopPropagation();

            var $el = $(e.currentTarget).parent();

            if(!$el.is('.active')){
                var page = Number($el.data('page'));

                $el.siblings().removeClass('active');
                $el.addClass('active');

                this.paginator(page);
            }
            
        }

    },

    paginator: function(page) {

        if (!page)
            page = this.options.pageactual;

        // this.updatePaginator();

        if ((this.options.numPages < page) || (1 > page))
            this.options.pageactual = 1;
        else {
            this.options.pageactual = page;
        }

        this.options.lim = (this.options.pageactual * this.options.nitems);
        this.options.ini = this.options.lim - (this.options.nitems - 1);

        this.render();
    },

    updatePaginator: function() {
        // Calculó el número de las páginas 
        if (this.collection.length == 0) // Sí no hay registros 
            this.options.numPages = 1;
        else{            
            this.options.numPages = is_float(this.collection.length / this.options.nitems) ? parseInt(this.collection.length / this.options.nitems) + 1 : this.collection.length / this.options.nitems;
        }

        // this.options.$elPages.text(this.options.numPages);
        this.renderPag(this.options.numPages)
    },

    renderPag: function(num){
        var $pagination = $('.pagination');

        $('li:not(#pag-inicio-cont, #pag-final-cont)', $pagination).remove();

        for(var i = num - 1; i >= 0; i--){
            if((Number(i)+1) == this.options.pageactual)
                $('#pag-inicio-cont', $pagination).after('<li class="active" data-page="'+ (Number(i)+1) +'" ><a href="#">'+ (Number(i)+1) +'</a></li>');
            else
                $('#pag-inicio-cont', $pagination).after('<li data-page="'+ (Number(i)+1) +'" ><a href="#">'+ (Number(i)+1) +'</a></li>');
        }

        $('li:not(#pag-inicio-cont, #pag-final-cont) a', $pagination).on('click', $.proxy(this.changePageAction, this));

    },


    /////////////
    // Eventos //
    /////////////

    onClickAddSound: function (){
        this.$modal.modal('show');

        $('#saveSound', this.$modal).off('click').on('click', $.proxy(this.onSaveSound, this));
    },

    onSaveSound: function(){
        var that = this;

        var data = {
            name: $('#name', this.$modal).val(),
            color: $('#color', this.$modal).val(),
            file: $('#soundFile', this.$modal)[0].files[0]
        };

        app.pushXHR('/api/sound', data, 'POST', function(data){
            if(data.success){
                app.handleAlert("Se ha creado el nuevo sonido.", 2000);
                
                that.handleData(data.sounds);

                that.$modal.modal('hide');

            }else{
                if(data.errors)
                    app.handleAlert(data.errors);
                else
                    app.handleAlert('Error al registrar el sonido.');
            }
        }, function(err){
            app.handleAlert(err);
        });

    },

    
    onPlaySound: function(e){
        e.preventDefault();

        var id = $(e.currentTarget).data('id');
        
        var sound = _.find(this.collection, function(elm){
            return id == elm.id;
        });

        if(sound){
            var audio = new Audio();
            audio.src = this.path + sound.file;
            audio.play();
        }else{
            app.handleAlert('Error al reproducir', 1000);
        }
        
    },

    onRemoveSound: function(e){
        e.preventDefault();
        var that = this;

        var id = $(e.currentTarget).data('id');
        // var $el = $(e.currentTarget).parent().parent();
        
        app.pushData('/api/sound/'+ id, {}, function(data){

            if(data.success){
                that.removeSound(id);
                app.handleAlert("Audio eliminado!", 2000);
            }else{
                if(data.errors)
                    app.handleAlert(data.errors);
                else
                    app.handleAlert('Error al eliminar sonido');
            }

        }, "DELETE");

    },

    removeSound: function (id){
        for(var c in this.collection){
            if(this.collection[c].id == id){
                this.collection.splice(c, 1);
            }
        }

        this.handleData(this.collection);
    },

    ///////////////////////////////////
    // Evento para salir de la vista //
    ///////////////////////////////////
    
    remove: function(){

        $('.page-header').removeClass('animated bounceInDown')
                         .addClass('animated bounceOutUp');
        $('.table-container-sound').removeClass('animated bounceInLeft')
                         .addClass('animated bounceOutLeft');
        $('.pagination').removeClass('animated bounceInLeft')
                         .addClass('animated bounceOutLeft');
        $('#btnAdd').prop('disabled', false)
                    .removeClass('disabled');
    }

});

