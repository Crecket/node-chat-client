'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');

var bundle = require('./bundle');
var generateSpecImportsFile = require('./generate_spec_imports');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    copyFromAppDir: [
        // react stuff
        './node_modules/socket.io-client/socket.io.js',
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/socket.io-client/socket.io.js',
        './bower_components/sjcl/sjcl.js',
        './bower_components/cryptojslib/components/core.js',
        './bower_components/cryptojslib/components/hmac.js',
        './bower_components/cryptojslib/components/md5.js',
        './bower_components/cryptojslib/components/sha1.js',
        './bower_components/cryptojslib/components/sha256.js',
        './bower_components/cryptojslib/rollups/aes.js',
        './bower_components/cryptojslib/rollups/sha512.js',
        './bower_components/cryptojslib/components/enc-base64.js',
        './bower_components/cryptojslib/components/enc-base64.js',
        './bower_components/react/react-with-addons.js',
        './bower_components/react/react-dom.js',
        './bower_components/marked/marked.min.js',
        './bower_components/flexboxgrid/css/flexboxgrid.css',
        './bower_components/font-awesome/css/font-awesome.min.css',
        
        './react/js/node-bundle.js',
        './react/js/Utils.js',
        './react/js/ConnectionHelper.js',
        './react/js/CryptoHelper.js',
        './react/js/Client.js',

        // default
        // './node_modules/**',
        './helpers/**',
        './**/*.html',
        './**/*.+(jpg|png|svg)'
    ],
};

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return destDir.dirAsync('.', {empty: true});
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);


var bundleApplication = function () {
    return Q.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
};

var bundleSpecs = function () {
    return generateSpecImportsFile().then(function (specEntryPointPath) {
        return bundle(specEntryPointPath, destDir.path('spec.js'));
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('environment', ['clean'], function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'));
});


gulp.task('package-json', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" suffix to name, so Electron will write all data like cookies
    // and localStorage in separate places for production and development.
    if (utils.getEnvName() === 'development') {
        manifest.name += '-dev';
        manifest.productName += ' Dev';
    }

    destDir.write('package.json', manifest);
});


gulp.task('watch', function () {
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch(paths.copyFromAppDir, {cwd: 'app'}, batch(function (events, done) {
        gulp.start('copy-watch', done);
    }));
    watch('app/**/*.less', batch(function (events, done) {
        gulp.start('less-watch', done);
    }));
});


gulp.task('build', ['bundle', 'less', 'copy', 'environment', 'package-json']);
