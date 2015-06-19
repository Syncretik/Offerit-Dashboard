var gulp 		= require('gulp');
var sass		= require('gulp-ruby-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('sass', function() {
	return sass('./app/scss/css_builder.scss')
				.pipe(gulp.dest('app/css'))
				.pipe(reload({ stream:true }));
});

// Static server + watching scss/html files
gulp.task('serve', ['sass'], function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		ghostMode: { scroll: false }
	});

	gulp.watch('app/scss/*.scss', ['sass']);
	gulp.watch(['*.html', 'css/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});

gulp.task('ghostMode');


gulp.task('default', ['serve']);
