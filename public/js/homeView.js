
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

        $.each(data, function(el) {
            that.$tbody.append(that.templateRow(el));
        });
    },

    remove: function(){
        $('.page-header').removeClass('animated bounceInDown')
                         .addClass('animated bounceOutUp');
        $('.table-container').removeClass('animated bounceInLeft')
                         .addClass('animated bounceOutLeft');
    }

});

