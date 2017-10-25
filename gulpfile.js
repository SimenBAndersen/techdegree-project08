'use strict';

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

gulp.task("scripts", () => {
  return gulp.src(['js/circle/*.js', 'js/global.js'])
  .pipe(maps.init())
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'));
});

gulp.task("styles", () => {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename('all.min.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.stream());
});

gulp.task("images", () => {
  return gulp.src('images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'));
});

gulp.task("clean", () => {
  del('dist/*');
});

gulp.task("browser-sync", ["build"], () => {
    browserSync.init({
        server: "dist"
    });
    gulp.watch('sass/**/*', ["styles"]);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task("build", ["clean", "scripts", "images", "styles"], () => {
  gulp.src('icons/**', {base: './'})
  .pipe(gulp.dest('dist'));
});

gulp.task("default", ["browser-sync"], () => {
  gulp.src('index.html')
  .pipe(htmlReplace({js: 'scripts/all.min.js', css: 'styles/all.min.css'}))
  .pipe(gulp.dest('dist'));
});
