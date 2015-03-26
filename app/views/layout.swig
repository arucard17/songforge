<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">
		<title>{{ title }}</title>

		<!-- <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet"> -->
		<link href="/components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
		<link href="/components/snackbarjs/dist/snackbar.min.css" rel="stylesheet">
		<link href="/components/snackbarjs/themes-css/material.css" rel="stylesheet">
		<link href="/components/bootstrap-material-design/dist/css/ripples.min.css" rel="stylesheet">
		<link href="/components/bootstrap-material-design/dist/css/material-wfont.min.css" rel="stylesheet">

		<link rel="stylesheet" href="/css/animate.css">
		<link rel="stylesheet" href="/css/importer.css">
		
	  	<script src="http://localhost:35729/livereload.js"></script>
	</head>
	<body>
		<div class="container">
	  		{% block content %}{% endblock %}
		</div>


		<!-- Javascript -->
		<script src="/components/jquery/dist/jquery.min.js"></script>
		<script src="/components/bootstrap/dist/js/bootstrap.min.js"></script>
		<script src="/components/bootstrap-material-design/dist/js/ripples.min.js"></script>
		<script src="/components/bootstrap-material-design/dist/js/material.min.js"></script>
		<script src="/components/underscore/underscore-min.js"></script>
		<script src="/components/backbone/backbone.js"></script>
		<script src="/components/snackbarjs/dist/snackbar.min.js"></script>
		<script src="/js/dependences/jquery.nouislider.min.js"></script>
		<script src="/components/async/lib/async.js"></script>
		<script src="/components/moment/moment.js"></script>
		<script src="/js/plugins.js"></script>

		<script src="/js/routes.js"></script>
		<script src="/js/appView.js"></script>
		<script src="/js/homeView.js"></script>
		<script src="/js/soundView.js"></script>
		<script src="/js/composerView.js"></script>
		<script>
		    var app = new AppView;
		    app.router = new Routes;

		    Backbone.history.start({
		        pushState: true
		    });
		</script>
	</body>
</html>
