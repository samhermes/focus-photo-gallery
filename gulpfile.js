'use strict'

let gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    eslint = require('gulp-eslint')

gulp.task('sass', function () {
  var styleSass = gulp.src('./src/sass/focus.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulp.dest('./demo/dist/css'))
  return styleSass
})

gulp.task('js', function () {
  var js = gulp.src('./src/js/**/*.js')
    .pipe(concat('focus.js'))
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true,
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('./demo/dist/js'))
  return js
})

gulp.task('svg', function() {
  return gulp.src('./src/svg/*.svg')
    .pipe(gulp.dest('./dist/svg'))
    .pipe(gulp.dest('./demo/dist/svg'))
})

gulp.task('lint', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('watch', function () {
  gulp.watch('./src/svg/**/*.svg', gulp.series('svg'))
  gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/js/**/*.js', gulp.series('lint', 'js'))
})

gulp.task('default', gulp.parallel('sass', 'lint', 'js', 'svg', 'watch'))