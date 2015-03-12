
var AppView = Backbone.View.extend({

    el: 'body',


    /////////////
    // Eventos //
    /////////////

    events: {
        'click #btnAdd' : 'onClickAdd',
        'click #btnAddSound' : 'onClickAddSound'
    },

    /////////////////
    // Constructor //
    /////////////////

    initialize: function() {
        // Contenedor que se actualizará con el cambio de vista
        this.$container = $('#content');

        // Cargo los templates
        this.templateHome = _.template($('#tmpl-home').html());
        this.templateNew = _.template($('#tmpl-new').html());
        this.templateSound = _.template($('#tmpl-sound').html());

        // View active
        this.view = null;

    },

    loadView: function (str){

        var that = this; 

        this.ifWithView(function (){
            switch(str){
                case 'home': 
                    that.loadHome();
                    break;
                case 'create':
                    that.loadCreate();
                    break;
                case 'sound':
                    that.loadSound();
                    break;
                default: 
                    that.load(str);
                    break;
            }
        });

    },

    ifWithView: function (cb){
        if(this.view){
            this.view.remove();
            this.view = null;
            setTimeout(function(){
                cb();
            }, 1000);
        }else
            cb();        
    },

    loadHome: function(){
        this.render(this.templateHome());
        this.view = new HomeView();
    },

    loadCreate: function(){
        this.render(this.templateNew());
        this.view = new ComposerView();
    },

    loadSound: function(){
        this.render(this.templateSound());
        this.view = new SoundView();
    },

    load: function(id){
        this.render(this.templateNew());
        this.view = new ComposerView(id);
    },

    render: function(tmpl) {
        this.$container.html(tmpl);
        
        // InitMaterial
        $.material.init();
    },

    pushData: function(url, data, onSuccess, method, dataType) {

        var jqxhr = $.ajax({
            url: url,
            type: method || 'POST',
            data: data, // add your request parameters in the data object.
            dataType: dataType || "json", // specify the dataType for future reference
            statusCode: { // if you want to handle specific error codes, use the status code mapping settings.
                401: function() {

                    app.handleAlert(app.block, 'Su sesión ha caducado. será redireccionado a la pÃ¡gina de inicio de sesión.', false, app.FAILED);

                    if (app.block.children().length <= 0)
                        app.block.fadeIn('fast');

                    setTimeout(function() {
                        window.location = '/login';
                    }, 5 * 1000);
                },
                404: function() {
                    app.handleAlert(app.block, 'Existe un problema con el servicio. Por favor contacte con el Administrador.', false, app.FAILED);

                    if (app.block.children().length <= 0)
                        app.block.fadeIn('fast');
                },
                500: function() {

                    app.handleAlert(app.block, 'Existe un problema con el servicio. Por favor contacte con el Administrador.', false, app.FAILED);

                    if (app.block.children().length <= 0)
                        app.block.fadeIn('fast');
                },
            }
        });

        jqxhr.done(onSuccess);

        jqxhr.fail(function(xhr, textStatus, errorThrown) {
            app.handleAlert(app.block, errorThrown);
            if (typeof app.viewActive.handleError == 'function')
                app.viewActive.handleError(errorThrown);
        });

    },

    pushXHR: function( url, data, method, onSuccess, onError){

        var xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.onreadystatechange = function (e) {

            if (onSuccess && xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                onSuccess($.parseJSON(xmlHttpRequest.responseText));
            }
            if (onError && xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 500) {
                onError($.parseJSON(xmlHttpRequest.responseText));
            }
        };

        xmlHttpRequest.open(method, url, true);

        var formData = new FormData();
        for(var d in data){ 
            if(d != 'file')
                formData.append(d, JSON.stringify(data[d]));
        }

        formData.append('file', data['file']);

        xmlHttpRequest.send(formData);
        return xmlHttpRequest;
    
    },


    /////////////
    // Eventos //
    /////////////

    onClickAdd: function (e){
        $btn = $(e.currentTarget);
        
        if(!$btn.is('.active')){
            app.router.navigate("/new", {trigger: true, replace: true});
            $btn.removeClass('animated bounceInUp');
        }else{
            app.router.navigate("/", {trigger: true, replace: true});
        }


        $btn.toggleClass('active');

        if($btn.is('.active'))
            $('i',$btn).removeClass('mdi-content-add')
                .addClass('mdi-navigation-close');
        else
            $('i',$btn).removeClass('mdi-navigation-close')
                .addClass('mdi-content-add');

        // this.view.remove();

    },

    onClickAddSound: function (e){
        $btn = $(e.currentTarget);
        
        if(!$btn.is('.active')){
            app.router.navigate("/sound", {trigger: true, replace: true});
            $btn.removeClass('animated bounceInUp');
        }else{
            app.router.navigate("/", {trigger: true, replace: true});
        }


        $btn.toggleClass('active');

        if($btn.is('.active'))
            $('i', $btn).removeClass('mdi-av-my-library-music')
                .addClass('mdi-content-reply');
        else
            $('i', $btn).removeClass('mdi-content-reply')
                .addClass('mdi-av-my-library-music');

    },


    /* ==========================================================================
       Handler Search
       ========================================================================== */

    onSearchSubmit: function (e){
        e.preventDefault();
        that.onSearchAction();
    },

    onSearchAction: function(e) {

        var query = this.search.val(),
            type = '',
            value = '';

        if (e.keyCode == 13)
            return;

        if (typeof app.viewActive.search == 'function') {

            if (query.indexOf(':') != -1) {

                type = _.str.strLeft(query, ':');
                value = _.str.strRight(query, ':');

            } else if (query != '') {
                type = 'descripcion';
                value = query;
            } else {
                type = '';
                value = query;
            }

            app.viewActive.search(type, value);
        }
    },

    activeSearch: function() {
        this.search
            .removeClass('disabled')
            .attr('disabled', false);
    },

    desactiveSearch: function() {
        this.search
            .addClass('disabled')
            .attr('disabled', 'disabled');
    },


    /* ==========================================================================
       Handler Errors
       ========================================================================== */

    handleAlert: function(message, timeout) {
        if(!timeout) timeout = 0;
        $.snackbar({content: message, timeout:timeout});
    },

});

