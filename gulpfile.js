var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber');

// Error catching
function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Styles
gulp.task('styles', function() {
  return gulp.src('assets/scss/design.scss')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sass({ quiet: true }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('theme'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);
});

// Initiate and watch
gulp.task('initiate-and-watch', ['styles', 'watch']);
