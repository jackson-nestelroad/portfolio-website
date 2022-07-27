// Manage preprocessors and transpilers

const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const clean = require('gulp-clean');
const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
require('@babel/polyfill');

// Create a server to view changes
gulp.task('connect', () => {
	connect.server({
		root: './out',
		port: 8080,
		livereload: true
	});
});

// SASS/SCSS Preprocessor
gulp.task('sass', () => {
	return gulp.src('src/scss/**/*.+(scss|sass)')
		.pipe(sass())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('out/css'))
		.pipe(connect.reload())
});

// Watch HTML for changes to auto-reload change
gulp.task('html', () => {
	return gulp.src('./out/index.html')
		.pipe(connect.reload())
});

// Clean up the transpiled TypeScript files
gulp.task('clean', () => {
	return gulp.src('out/ts', { read: false }).pipe(clean());
});

// Transpile all TypeScript files into JavaScript
gulp.task('typescript', () => {
	return tsProject.src()
		.pipe(tsProject())
		.js
		.pipe(gulp.dest('out/ts'))
});

// Browserify and merge all JavaScript files together
gulp.task('browserify', () => {
	return browserify({
		entries: glob.sync('out/ts/**/*.js'),
		debug: true
	})
		.transform('babelify', {
			presets: [
				[
					'@babel/preset-env',
					{
						useBuiltIns: 'usage',
						corejs: '3'
					}
				],
			]
		})
		.bundle()
		.pipe(source('scripts.js'))
		.pipe(buffer())
		// .pipe(sourcemaps.init())
		.pipe(gulp.dest('out/js'))
		.pipe(connect.reload());
});

// Watch for changes to run tasks above
gulp.task('watch', () => {
	gulp.watch('src/scss/**/*.+(scss|sass)', gulp.parallel('sass'));
	gulp.watch('src/ts/**/*.+(ts|tsx)', gulp.parallel('compile'));
	gulp.watch('*.html', gulp.parallel('html'));
});

// Compile TypeScript to JavaScript
gulp.task('compile', gulp.series('typescript', 'browserify', 'clean'));

// Run everything
gulp.task('default', gulp.parallel('compile', 'sass', 'html', 'connect', 'watch'));