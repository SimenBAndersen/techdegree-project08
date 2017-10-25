'use strict';

// Required modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const htmlReplace = require('gulp-html-replace');
const replace = require('gulp-replace');

// - Concatenate and minify Javascript files
// - Generate source map
// - Copy the files to the 'dist/scipts' folder
gulp.task("scripts", () => {
  return gulp.src(['js/circle/*.js', 'js/global.js'])
  .pipe(maps.init())
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'));
});

// - Compile Sass into CSS
// - Compress compiled code
// - Generate source map
// - Copy the files to the 'dist/styles' folder
// - Prepare code to be reloaded (refresh the page)
gulp.task("styles", () => {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename('all.min.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.stream());
});

// - Compress image files
// - Copy them to the 'dist/content' folder
gulp.task("images", () => {
  return gulp.src('images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/content'));
});

// Delete everything in the 'dist' folder
gulp.task("clean", () => {
  del('dist/*');
});

// Reload the page on Sass changes
gulp.task("browser-sync", ["build"], () => {
    browserSync.init({
        server: "dist"
    });
    gulp.watch('sass/**/*', ["styles"]);
    gulp.watch('*.html').on('change', browserSync.reload);
});

// - Runs the clean, scripts, images and styles tasks
// - Adds all the icons to the 'dist' folder
gulp.task("build", ["clean", "scripts", "images", "styles"], () => {
  gulp.src('icons/**', {base: './'})
  .pipe(gulp.dest('dist'));
});

// Updates the paths to the images, js and css in the 'dist' folder
gulp.task("default", ["browser-sync"], () => {
  gulp.src('index.html')
  .pipe(replace('images/', 'content/'))
  .pipe(htmlReplace({js: 'scripts/all.min.js', css: 'styles/all.min.css'}))
  .pipe(gulp.dest('dist'));
});
