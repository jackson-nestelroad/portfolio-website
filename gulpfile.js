// Manage preprocessors and transpilers

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const browserify = require('browserify');
const babelify = require('babelify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Create a server to view changes
gulp.task('connect', () => {
	connect.server({
		root: '.',
		port: 8080,
		livereload: true
	});
});

// SASS/SCSS Preprocessor
gulp.task('sass', () => {
	return gulp.src('src/scss/*.+(scss|sass)')
		.pipe(sass())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('out/css'))
		.pipe(connect.reload())
});

// Transpile ES6 with Babel and then Browsify the result
gulp.task('browserify', () => {
    return browserify({
        entries: glob.sync('src/js/**/*.js'),
        debug: true
    })
        .transform('babelify', { presets: ['@babel/preset-env'] })
        .bundle()
        .pipe(source('scripts.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('out/js'))
        .pipe(connect.reload())
});

// Watch HTML for changes to auto-reload change
gulp.task('html', () => {
	return gulp.src('./*.html')
	.pipe(connect.reload())
});

// Watch for changes to run tasks above
gulp.task('watch', () => {
	gulp.watch('src/scss/*.+(scss|sass)', gulp.parallel('sass'));
	gulp.watch('src/js/**/*.js', gulp.parallel('browserify'));
	gulp.watch('*.html', gulp.parallel('html'));
});

// Run everything
gulp.task('default', gulp.parallel('browserify', 'sass', 'html', 'connect', 'watch'));