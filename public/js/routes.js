
var Routes = Backbone.Router.extend({

    routes: {
        "": "home",
        "new": "create",
        ":song": "loadSong",

    },

    home: function() {
        app.loadView('home');
    },

    create: function() {
        app.loadView('create');
    },

    loadSong: function(song) {
        app.loadView(song);
    }

});

