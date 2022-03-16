const gulp = require('gulp');

// Add CSS vendor prefixes
const autoprefixer = require('gulp-autoprefixer');

// Used to spin up a dev server
const connect = require('gulp-connect');

// Minify CSS
const cssnano = require('gulp-cssnano');

// Compress images
const imagemin = require('gulp-imagemin');

// Rename files and their extensions
const rename = require('gulp-rename');

// Compile SASS into regular CSS
const sass = require('gulp-sass')(require('sass'));

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

const paths = {
    root: 'public',
    css: {
        src: 'assets/src/sass/*.scss',
        dest: 'public/css',
    },
    fonts: {
        src: 'assets/fonts/*',
        dest: 'public/css/fonts',
    },
    html: {
        src: 'assets/src/index.html',
        dest: 'public',
    },
    img: {
        src: 'assets/img/*',
        dest: 'public/img',
    },
    js: {
        // src = the "entry point" of the app, for browserify
        src: 'assets/src/js/index.js',
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

function cleanCss() {
    return del([paths.css.dest + '/*.css', paths.css.dest + '/*.map']);
}

function cleanJs() {
    return del([paths.js.dest]);
}

function css() {
    return gulp.src(paths.css.src, { sourcemaps: true })
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.css.dest, { sourcemaps: '.' }))
        .pipe(connect.reload());
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(connect.reload());
}

function img() {
    return gulp.src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest));
}

function js() {
    const options = {
        entries: paths.js.src,  // Entry point of the app (must be a single file, AFAIK)
        debug: true,  // Debug == make sourcemaps
    };

    /*
     * The srcVinyl arg 'bundle.js' doesn't actually exist, .bundle() prints to stdout,
     * bundle.js is just a 'pretend' filename other streams in the pipeline may use.
     */
    return browserify(options)
        .bundle()
        .pipe(srcVinyl('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(rename({ basename: 'index', suffix: '.min' }))
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
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.js.src, js);
}

const buildTask = gulp.series(clean, gulp.parallel([fonts, nodeFonts, img, videos, html, css, js]));
const serveTask = gulp.series(buildTask, serve);
const watchTask = gulp.series(serveTask, watch);
const watchNoBuildTask = gulp.series(serve, watch);
const cleanTask = gulp.series(clean);
const cssTask = gulp.series(cleanCss, css, serve, watch);
const jsTask = gulp.series(cleanJs, js, serve, watch);

exports.build = buildTask;
exports.serve = serveTask;
exports.watch = watchTask;
exports.watchnob = watchNoBuildTask;
exports.css = cssTask;
exports.js = jsTask;
exports.clean = cleanTask;
exports.default = watchTask;
