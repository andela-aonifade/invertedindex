
const gulp = require('gulp'),
  connect = require('gulp-connect'),
  eslint = require('gulp-eslint'),
  coveralls = require('gulp-coveralls'),
  browserSync = require('browser-sync').create();


gulp.task('watch', () => {
  gulp.watch('src/*.js', ['reload']);
  gulp.watch('css/*.css', ['reload']);
  gulp.watch('*.html', ['reload']);
});

gulp.task('test', ['pre-test'], () => (
  gulp.src('test/spec/*.js')
    .on('end', () => {
      gulp.src('coverage/lcov.info')
        .pipe(coveralls());
    })
));

gulp.task('serve', ['watch'], () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  gulp.src(['src/invertedindex.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('test-watch', () => {
  gulp.watch('jasmine/spec/*.js', ['test-reload']);
});

gulp.task('test-reload', () => {
  gulp.src(['jasmine/spec/*.js']).pipe(connect.reload());
});

gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true,
    port: process.env.PORT || 3000
  });
});

gulp.task('reload', () => {
  gulp.src(
    ['*.html',
      'src/*.js',
      'css/*.css'
    ]).pipe(connect.reload());
});

gulp.task('default',
  [
    'reload',
    'test-watch',
    'test-reload',
    'connect',
    'watch'
  ]);
