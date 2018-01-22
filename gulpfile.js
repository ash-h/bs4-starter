/**
 * Created by ashleighhenry on 18/07/16.
 */

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const htmlPartial = require('gulp-html-partial');
const autoprefixer = require('gulp-autoprefixer');
const htmlbeautify = require('gulp-html-beautify');

gulp.task('html', function () {
    gulp.src(['src/*.html'])
        .pipe(htmlPartial({
            basePath: 'src/partials/'
        }))
        .pipe(gulp.dest('dist'));
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'html'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("../src/sass/**/*.scss", ['sass']);
    gulp.watch("./dist/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('prefix', function(){
    return gulp.src('dist/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('css', function(){
    return gulp.src('src/sass/vendor/**/*.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html:watch', function(){
   gulp.watch('./src/**/*.html', ['html']);
});
gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});
gulp.task('js', function(){
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
});


gulp.task('htmlbeautify', function() {
    var options = {
        indentSize: 4,
        preserve_newlines: false
};
    gulp.src('./dist/*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', ['serve','sass:watch','html:watch','js','css','htmlbeautify']);