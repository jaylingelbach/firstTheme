import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';

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
		src: ['src/assets/**/*', '!src/assets/{images, js, scss}', '!src/assets/{images, js, scss/**/*}'],
		dest: 'dist/assets'
	}
}
export const styles = () => {
	return gulp.src(paths.styles.src)
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(gulp.dest(paths.styles.dest));
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

export const watch = () => {
	gulp.watch('src/assests/scss/**/*.scss', styles)
	gulp.watch('src/assests/js/**/*.js', scripts)
	gulp.watch(paths.images.src, images)
	gulp.watch(paths.other.src, copy)
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

export const dev = gulp.series(clean, gulp.parallel(styles, scripts, images, copy), watch);
export const build = gulp.series(clean, gulp.parallel(styles, scripts, images, copy));

export default dev;