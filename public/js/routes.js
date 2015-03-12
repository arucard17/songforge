
var Routes = Backbone.Router.extend({

    routes: {
        "": "home",
        "new/": "create",
        "sound/": "sound",
        ":song": "loadSong",

    },

    home: function() {
        app.loadView('home');
    },

    create: function() {
        app.loadView('create');
    },

    sound: function() {
        app.loadView('sound');
    },

    loadSong: function(song) {
        app.loadView(song);
    }

});

