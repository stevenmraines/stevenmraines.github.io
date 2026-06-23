const gulp = require('gulp');

const postcss = require('gulp-postcss');

// Used to spin up a dev server
const connect = require('gulp-connect');

// Rename files and their extensions
const rename = require('gulp-rename');

// Needed to make sourcemap file with Browserify
const sourcemaps = require('gulp-sourcemaps');

// Minify JS
const uglify = require('gulp-uglify');

// Bundle NPM packages with my JS files
const browserify = require('browserify');

// Delete files and directories
const del = require('del');

// Browserify.bundle() returns a text stream, but Gulp uses a streaming vinyl object, this is needed to translate
const srcVinyl = require('vinyl-source-stream');

// Some gulp plugins don't support streaming vinyl objects, so a buffered vinyl object is needed
const buffer = require('vinyl-buffer');

// Allow including partials in HTML files
const fileInclude = require('gulp-file-include');

const paths = {
    root: 'public',
    css: {
        src: 'assets/src/css/*.css',
        dest: 'public/css',
    },
    colors: {
        src: 'assets/src/css/colors.css',
    },
    files: {
        src: 'assets/files/*',
        dest: 'public/files',
    },
    fonts: {
        src: 'assets/fonts/*',
        dest: 'public/css/fonts',
    },
    html: {
        src: 'assets/src/**/*.html',
        dest: 'public',
    },
    img: {
        src: 'assets/img/*',
        dest: 'public/img',
    },
    js: {
        src: [
            'assets/src/js/index.js',
            'assets/src/js/background.js'
        ],
        dest: 'public/js',
    },
    nodeFonts: {
        src: 'node_modules/devicon/fonts/*',
        dest: 'public/css/fonts',
    },
    videos: {
        src: 'assets/videos/*.mp4',
        dest: 'public/videos',
    },
};

function clean() {
    return del([paths.root]);
}

function css() {
    return gulp.src(paths.css.src, { sourcemaps: true })
        .pipe(postcss([
            require('@tailwindcss/postcss')(),
        ]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.css.dest, { sourcemaps: '.' }))
        .pipe(connect.reload());
}

function cleanJs() {
    return del([paths.js.dest]);
}

function files() {
    return gulp.src(paths.files.src)
        .pipe(gulp.dest(paths.files.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(connect.reload());
}

function img() {
    return gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.dest));
}

function js() {
    const options = {
        debug: true,  // Debug == make sourcemaps
    };

    /*
     * The srcVinyl arg 'bundle.js' doesn't actually exist, .bundle() prints to stdout,
     * bundle.js is just a 'pretend' filename other streams in the pipeline may use.
     */
    return browserify(paths.js.src, options)
        .bundle()
        .pipe(srcVinyl('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(rename({ basename: 'main', suffix: '.min' }))  // Bundle everything into js/main.min.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(connect.reload());
}

function nodeFonts() {
    return gulp.src(paths.nodeFonts.src)
        .pipe(gulp.dest(paths.nodeFonts.dest));
}

function serve(callback) {
    connect.server({
        name: 'Dev App',
        port: 8080,
        root: paths.root,
        livereload: true,
    });

    callback();
}

function videos() {
    return gulp.src(paths.videos.src)
        .pipe(gulp.dest(paths.videos.dest));
}

function watch() {
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.colors.src, css);
    gulp.watch(paths.html.src, gulp.parallel(html, css));
    gulp.watch(paths.js.src, js);
}

const buildTask = gulp.series(clean, gulp.parallel([files, fonts, nodeFonts, img, videos, html, css, js]));
const serveTask = gulp.series(buildTask, serve);
const watchTask = gulp.series(serveTask, watch);
const watchNoBuildTask = gulp.series(serve, watch);
const cleanTask = gulp.series(clean);
const jsTask = gulp.series(cleanJs, js, serve, watch);

exports.build = buildTask;
exports.serve = serveTask;
exports.watch = watchTask;
exports.watchnob = watchNoBuildTask;
exports.js = jsTask;
exports.clean = cleanTask;
exports.default = watchTask;
