const gulp = require('gulp');

const postcss = require('gulp-postcss');

// Used to spin up a dev server
const connect = require('gulp-connect');

// Rename files and their extensions
const rename = require('gulp-rename');

// Bundles ES modules, splits shared code into chunks, minifies, sourcemaps
const esbuild = require('esbuild');

// Delete files and directories
const del = require('del');

// Allow including partials in HTML files
const fileInclude = require('gulp-file-include');

// TODO All these paths are gonna be screwed up now because I restructured everything
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
        entryPoints: {
            common: 'assets/src/js/entries/common.js',
            viewer: 'assets/src/js/entries/viewer.js',
        },
        watch: 'assets/src/js/**/*.js',
        dest: 'public/js',
    },
    models: {
        src: 'assets/models/*',
        dest: 'public/models',
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

// TODO This is gonna be broken
async function js() {
    await esbuild.build({
        entryPoints: paths.js.entryPoints,
        outdir: paths.js.dest,
        entryNames: '[name].min',
        chunkNames: 'chunks/[name]-[hash]',
        bundle: true,
        splitting: true,
        format: 'esm', // Required for splitting; matches type="module"
        minify: true,
        sourcemap: true,
        target: ['es2020'],
    });
    connect.reload();
}

function models() {
    return gulp.src(paths.models.src)
        .pipe(gulp.dest(paths.models.dest));
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
    gulp.watch(paths.js.watch, js);
    gulp.watch(paths.models.src, models);
    gulp.watch(paths.img.src, img);
}

const buildTask = gulp.series(clean, gulp.parallel([files, fonts, models, nodeFonts, img, videos, html, css, js]));
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
