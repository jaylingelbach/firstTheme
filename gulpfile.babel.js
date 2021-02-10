import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from 'browser-sync'; // automatic browers refreshing
import zip from 'gulp-zip'; // zip for production
import replace from 'gulp-replace'; // for boilerplate theme name
import info from './package.json'; // used in conjunction with gulp-replace

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;
const paths = {
	styles: {
		src: ['src/assets/scss/bundle.scss', 'src/assets/scss/admin.scss'],
		dest: 'dist/assets/css'
	},
	images: {
		src: 'src/assets/images/**/*.{jpg,jpeg,png,svg,gif}',
		dest: 'dist/assets/images'
	},
	scripts: {
		src: ['src/assets/js/bundle.js', 'src/assets/js/admin.js'],
		dest: 'dist/assets/js'
	},
	other: {
		src: ['src/assets/**/*', '!src/assets/{images, js, scss}',
		'!src/assets/{images, js, scss/**/*}'],
		dest: 'dist/assets'
	},
	package: {
		src: ['**/*', '!node_modules/**', '!.vscode', '!master/**', '!packaged/**', 
		'!src/**', '!.babelrc', '!.gitignore', '!gulpfile.babel.js',
		'!package.json', '!package-lock.json'],
		dest: 'packaged'
	}
}

// browserSync server initialization
export const serve = (done) => { 
	server.init({
		proxy: 'http://localhost:8888/wordpress/'
	});
	done();
}

// to refresh the browser via browserSync
export const reload = (done) => {
	server.reload();
	done();
}
export const clean = (done) => del(['dist']);


export const images = () => {
	return gulp.src(paths.images.src)
	.pipe(gulpif(PRODUCTION, imagemin()))
	.pipe(gulp.dest(paths.images.dest));
}

export const copy = () => {
	return gulp.src(paths.other.src)
	.pipe(gulp.dest(paths.other.dest));
}

export const styles = () => {
	return gulp.src(paths.styles.src)
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(server.stream());
}

export const scripts = () => {
    return gulp.src(paths.scripts.src)
		.pipe(named())
        .pipe(webpack({
			module: {
				rules: [
					{
						test: /\.js$/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			},
	    output: {
	        filename: '[name].js'
            },
	    devtool: !PRODUCTION ? 'inline-source-map' : false,
        mode: PRODUCTION ? 'production' : 'development'
	}))
	.pipe(gulp.dest(paths.scripts.dest));
}

export const watch = () => {
	gulp.watch('src/assets/scss/**/*.scss', styles);
	gulp.watch('src/assets/js/**/*.js', gulp.series(scripts, reload));
	gulp.watch('**/*.php', reload);
	gulp.watch(paths.images.src, gulp.series(images, reload));
	gulp.watch(paths.other.src, gulp.series(copy, reload));
}

export const compress = () => {
	return gulp.src(paths.package.src)
	.pipe(replace('_themeName', info.name))
	.pipe(zip(`${info.name}.zip`))
	.pipe(gulp.dest(paths.package.dest));
}
export const dev = gulp.series(clean, gulp.parallel(styles, scripts, images, copy), serve, watch);
export const build = gulp.series(clean, gulp.parallel(styles, scripts, images, copy));
export const bundle = gulp.series(build, compress);

export default dev;