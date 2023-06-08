var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cssMin = require('gulp-css');
const terser = require('gulp-terser');
var imagemin = require('gulp-imagemin');


gulp.task('css',function(){
    return gulp.src([
        // './frontend/css/*.css',
        './frontend/css/pages/*.css',
    ])
    // .pipe(concat('app.css'))
    .pipe(cssMin())
    .pipe(gulp.dest('./dist/css/pages'));
});

gulp.task('scripts',function(){
    return gulp.src([
        // './frontend/js/*.js',
        './frontend/js/pages/*.js'
    ])
    .pipe(terser())
    .pipe(gulp.dest('./dist/js/pages'));
})

gulp.task('images', function(){
    return gulp.src('./frontend/assets/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/assets'))
  });

gulp.task('default',gulp.series('css','scripts','images'));

// gulp.task('server', ['css'], function(){
//     browser.init({server: './_http://localhost', port: 8001});
//   });