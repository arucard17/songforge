var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  less = require('gulp-less');

// Development
gulp.task('less', function () {
  gulp.src('./public/css/importer.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.less', ['less']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js swig',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('less-prod', function () {
  gulp.src('./public/css/importer.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', [
  'less',
  'develop',
  'watch'
]);

gulp.task('prod', [
  'less-prod'
]);
