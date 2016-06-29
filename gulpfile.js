// Variables with all technologies.
// ----------------------------------------------------------------------
var gulp        = require('gulp'),                  // Task Runner.
    plumber     = require('gulp-plumber'),          // Prevent breakings caused by plugins errors.
    watch       = require('gulp-watch'),            // Directories Streamer.
    browserSync = require('browser-sync').create(), // Time-saving synchronised browser testing.
    jade        = require('gulp-jade'),             // HTML Template Engine.
    sass        = require('gulp-sass'),             // CSS preprocessor.
    uglify      = require('gulp-uglify'),           // To minify JS files.
    sourcemaps  = require('gulp-sourcemaps'),       // To generate CSS and JS sourcemaps.
    imagemin    = require('gulp-imagemin');         // To image compress.


// Constants with all directories and files path.
// ----------------------------------------------------------------------
const src_path = {
  html: 'src/html/*.jade',
  htmlAll: 'src/html/**/*.jade',
  css: 'src/css/*.sass',
  cssPure: 'src/css/*.css',
  cssAll: 'src/css/**/*',
  js: 'src/js/**/*.js',
  images: 'src/images/*'
}
const build_path = {
  index: 'build',
  css: 'build/css/',
  js: 'build/js/',
  images: 'build/images/'
}


// HTML task.
// Using Jade with gulp-jade plugin.
// ----------------------------------------------------------------------
gulp.task('html', function(){
  gulp.src(src_path.html)
      .pipe(plumber())
      .pipe(jade({
        pretty: true // HTML Compress: false to enable.
      }))
      .pipe(gulp.dest(build_path.index))
      .pipe(browserSync.stream());
});


// CSS task.
// Using Sass, Skeleton, and Sourcemaps
// with gulp-sass, and gulp-sourcemaps plugins.
// ----------------------------------------------------------------------
gulp.task('css', function(){
  gulp.src(src_path.css)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({
        // outputStyle: 'compressed' // CSS Compress: Just uncomment to enable.
      }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(build_path.css))
      .pipe(browserSync.stream());
});

// Skeleton Grid System
gulp.task('cssPure', function() {
    gulp.src(src_path.cssPure)
        .pipe(gulp.dest(build_path.css));
});


// JavaScript task.
// Using gulp-uglify plugin.
// ---------------------------------------------------------------------
gulp.task('js', function() {
    gulp.src(src_path.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build_path.js))
        .pipe(browserSync.stream());
});


// Image compress task.
// With gulp-imagemin plugin.
// ---------------------------------------------------------------------
gulp.task('images', function(){
  gulp.src(src_path.images)
      .pipe(plumber())
      .pipe(imagemin({
        progressive: true,
        optimizationLevel: 4
      }))
      .pipe(gulp.dest(build_path.images));
});


// Watching directories with gulp-watch plugin.
// ---------------------------------------------------------------------
gulp.task('watch', function(){
  gulp.watch(src_path.htmlAll, ['html']);
  gulp.watch(src_path.cssAll, ['css']);
  gulp.watch(src_path.js, ['js']);
  gulp.watch(src_path.images, ['images']);
});


// Synchronised browser testing.
// ---------------------------------------------------------------------
gulp.task('browser-sync', ['css'], function() {
  browserSync.init({
    server: build_path.index
  });

  gulp.watch(build_path.cssAll, ['css']);
  gulp.watch(build_path.htmlAll).on('chanche', browserSync.reload);

});


// Gulp tasks.
// ---------------------------------------------------------------------
gulp.task('build', ['html', 'css', 'cssPure', 'js', 'images']);
gulp.task('no-bs', ['watch', 'html', 'css', 'cssPure', 'js', 'images']);
gulp.task('default', ['watch', 'html', 'css', 'cssPure', 'js', 'images', 'browser-sync']);
