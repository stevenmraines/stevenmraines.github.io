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

const paths = {
    root: 'public',
    css: {
        src: 'src/css/*.css',
        dest: 'public/css',
    },
    colors: {
        src: 'src/css/colors.css',
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
        src: 'src/html/**/*.html',
        dest: 'public',
    },
    images: {
        src: 'assets/images/**/*',
        dest: 'public/images',
    },
    js: {
        bundles: {
            common: 'src/js/bundles/common.js',
            modelViewer: 'src/js/bundles/3d-viewer.js',
            pixelArt: 'src/js/bundles/pixel-art.js',
        },
        watch: 'src/js/**/*.js',
        dest: 'public/js',
    },
    models: {
        src: 'assets/models/**/*',
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
        .pipe(postcss((file) => ({
            plugins: [require('@tailwindcss/postcss')()],
        })))
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

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

async function js() {
    await esbuild.build({
        entryPoints: paths.js.bundles,
        outdir: paths.js.dest,
        entryNames: '[name].min',
        chunkNames: 'chunks/[name]-[hash]',
        bundle: true,
        splitting: true,
        format: 'esm', // required for splitting; matches type="module"
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
    gulp.watch(paths.images.src, images);
}

const buildTask = gulp.series(clean, gulp.parallel([files, fonts, models, nodeFonts, images, videos, html, css, js]));
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
