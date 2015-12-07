var gulp = require('gulp');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var Rx = require('rx');
var less = require('gulp-less');
var babelify = require("babelify");
var babel = require("gulp-babel");

var filesToWatch = [
  './server/**/*',
  './client/build/**/*'
];

var startServer = function (options) {
  server.listen(options, function () {
    livereload.listen({port: 35731});  // change the live reload port
  });

  if (options.development) {
    function restart(file) {
      server.changed(function (error) {
        if (!error) livereload.changed(file.path);
      });
    }

    gulp.watch(filesToWatch).on('change', restart);
  }
};

var browserifyTask = function (options) {
  var subject = new Rx.Subject();

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [babelify],
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  });

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        subject.onNext('APP bundle built in ' + (Date.now() - start) + 'ms');
        subject.onCompleted();
      }));
  };

  rebundle();

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  return subject;
};

var cssTask = function (options) {
  var subject = new Rx.Subject();

  var start = new Date();
  if (options.development) {
    var run = function () {
      console.log(arguments);
      console.log('Building CSS bundle src: ' + options.src);
      gulp.src(options.src)
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(options.dest))
        .pipe(notify(function () {
          subject.onNext('CSS bundle built in ' + (Date.now() - start) + 'ms');
          subject.onCompleted();
        }));
    };
    run();
    gulp.watch(options.src, run);
  } else {
    gulp.src(options.src)
      .pipe(concat('main.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        subject.onNext('CSS bundle built in ' + (Date.now() - start) + 'ms');
        subject.onCompleted();
      }));
  }
  return subject;
};

var buildServer = function (options) {
  var subject = new Rx.Subject();

  var build = function () {
    var start = new Date();
    return gulp.src("server/**/*.js") //get all js files under the src
      //.pipe(sourceMaps.init()) //initialize source mapping
      .pipe(babel()) //run babel
      //.pipe(sourceMaps.write(".")) //write source maps
      .pipe(gulp.dest("bundle/server"))
      .pipe(notify(function () {
        subject.onNext('Server build completed in ' + (Date.now() - start) + 'ms');
        subject.onCompleted();
      }));
  };

  if (options.development) {
    gulp.watch(['./server/**/*']).on('change', build);
  }

  build();

  return subject;
};

gulp.task('default', function () {
  var dev = true;
  var source1 = browserifyTask({
    development: dev,
    src: './client/app/main.js',
    dest: './client/build/js'
  });

  var source2 = cssTask({
    development: dev,
    src: './client/styles/*.less',
    dest: './client/build/css'
  });

  var source3 = buildServer({development: dev});

  Rx.Observable.combineLatest(source1, source2, source3)
    .subscribe(function (msg) {
      console.log(msg[0]);
      console.log(msg[1]);
      console.log(msg[2]);

      startServer({
        development: true,
        path: "./bundle/server/server.js"
      });
    })
});

gulp.task('bundle', function () {
  var dev = false;
  var source1 = browserifyTask({
    development: dev,
    src: './client/app/main.js',
    dest: './bundle/client/js'
  });

  var source2 = cssTask({
    development: dev,
    src: './client/styles/*.less',
    dest: './bundle/client/css'
  });

  var source3 = buildServer({development: dev});

  Rx.Observable.combineLatest(source1, source2, source3)
    .do(function (msg) {
      console.log(msg[0] + '\n' + msg[1] + '\n' + msg[2]);

      gulp.src(['./package.json']).pipe(gulp.dest('./bundle'));
      gulp.src(['./client/build/img/**/*']).pipe(gulp.dest('./bundle/client/img'));

    })
    .delay(3000)
    .subscribe(function () {
      gulp.src('**/*', {cwd: 'bundle'}).pipe(tar('bundle.tar')).pipe(gzip()).pipe(gulp.dest('.')).pipe(notify(function () {
        console.log('Creating the app bundle has completed...')
      }));
    })
});
