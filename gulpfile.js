var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  gulp.src(['./app.js', './helpers/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});


gulp.watch(['./app.js', './helpers/*.js'], ['jshint'])

gulp.task('default', ['jshint'])