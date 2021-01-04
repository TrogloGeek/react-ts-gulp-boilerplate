const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const tsify = require('tsify');
const vinylSourceStream = require('vinyl-source-stream');
const babelify = require('babelify');
const historyApiFallbackMiddleware = require('connect-history-api-fallback');

const tsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json'), {encoding: 'utf-8'}));

const sources = {
	html: 'src/html/**',
	sass: 'src/sass/**',
	typescriptEntryPoint: 'index.tsx',
	typescript: tsConfig.include
};

function copyHtml() {
    return gulp.src(sources.html).pipe(gulp.dest('dist'));
};

function compileSass() {
    return gulp.src(sources.sass)
        .pipe(gulpSass({
            includePaths: ["node_modules/"]
        }).on('error',gulpSass.logError))
        .pipe(gulp.dest('dist/css'))
    ;
}

function compileJs() { 
    return browserify({
        basedir: 'src/typescript',
        debug: true,
        entries: sources.typescriptEntryPoint,
        cache: {},
		packageCache: {},
	})
		.plugin(tsify)
		.transform(babelify)
		.bundle()
		.pipe(vinylSourceStream('application.js'))
		.pipe(gulp.dest('dist/js'))
	;
}


function startDevServer(cb) {
	browserSync.init({
		server: {
			baseDir: './dist',
			middleware: [historyApiFallbackMiddleware()]
		}
	});
	gulp.watch(sources.html, () => copyHtml().on('finish', browserSync.reload));
	gulp.watch(sources.sass, () => compileSass().pipe(browserSync.stream()));
	gulp.watch(sources.typescript, () => compileJs().on('finish', browserSync.reload));
}

const build = gulp.parallel(copyHtml, compileSass, compileJs);

module.exports = {
	'copy-html': copyHtml,
	'compile-sass': compileSass,
	'compile-js': compileJs,
	'start-dev-server': startDevServer,
	default: gulp.series(build, startDevServer),
	build
};
