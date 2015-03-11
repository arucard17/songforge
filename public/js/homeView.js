
var HomeView = Backbone.View.extend({
    
    events: {},

    initialize: function() {            
        this.loadData();

        this.$tbody = $('#tbody_comp');

        this.templateRow = _.template($('#tmpl-row').html());
    },

    loadData: function(){
        app.pushData('/api/compositions', {}, $.proxy(this.render, this), 'GET');
    },

    render: function(data){
        var that = this;

        this.$tbody.empty();

        _.each(data, function(el) {
            var $el = $(that.templateRow(el)).appendTo(that.$tbody);
            $('a', $el).on('click', $.proxy(that.onClick, that));
        });
    },

    onClick: function(e){
        e.preventDefault();

        var id = $(e.currentTarget).data('id');
        
        app.router.navigate("/"+ id, {trigger: true, replace: true});
    },

    remove: function(){
        $('.page-header').removeClass('animated bounceInDown')
                         .addClass('animated bounceOutUp');
        $('.table-container').removeClass('animated bounceInLeft')
                         .addClass('animated bounceOutLeft');
    }

});

