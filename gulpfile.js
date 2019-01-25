// Adiciona os modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');

// Deletar cache
function cleanCacheCss() {
	del('./dist/css/style.css')
}

function cleanCacheJs() {
	del('./dist/js/app.js')
}


//Minificar Html 
function buildHtml() {
	return gulp.src('./src/index.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./dist'))
	.pipe(browserSync.stream());
}
gulp.task('html', buildHtml)


//Função para compilar o SASS e adicionar os prefixos
function buildScss() {
  return gulp
  .src('./src/scss/style.scss').pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', notify.onError({title: "erro scss", message: "<%= error.message %>"}))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(browserSync.stream());
}
gulp.task('sass', function(done){
	cleanCacheCss();
	buildScss();
  done();
});

// Pega os plugins necessarios de scss para o projeto e cria dentro da pasta src para utilização
function buildFrameworksCSS() {
  return gulp.src(['node_modules/bootstrap/scss/**',])
  .pipe(gulp.dest('./src/scss/bootstrap/'))
  .pipe(browserSync.stream());
}
gulp.task('buildFrameworksCSS', buildFrameworksCSS)


// Builda o Javascript exclusivo da aplicação
function buildJs() {
  return gulp.src('./src/js/app.js')
  .pipe(babel({presets: ['@babel/env'] }))
  .pipe(uglify())
  .on('error', notify.onError({title: "erro scss", message: "<%= error.message %>"}))
  .pipe(gulp.dest('./dist/js/'))
  .pipe(browserSync.stream());
}
gulp.task('appjs', function(done){
	cleanCacheJs();
	buildJs();
  done();
});


// Pega os plugins necessarios de JavaScript para o projeto e concatena em um unico arquivo.
function buildFrameworksJS() {
  return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
		'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'))
  .pipe(browserSync.stream());
}
gulp.task('buildFrameworksJS', buildFrameworksJS)


//Move o conteudo de webfonts para dist/fonts 
function buildFonts() {
  return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**',])
  .pipe(gulp.dest('./dist/fonts/'))
}
gulp.task('buildFonts', buildFonts)


// Função para buildar os frameworks necessarios para iniciar a aplicação
function buildFrameworks(buildFonts) {
	buildFrameworksCSS();
  buildFrameworksJS();
  buildFonts();
}
gulp.task('buildFrameworks', buildFrameworks)


// Função para iniciar o browser
function browser() {
  browserSync.init({
    // proxy: 'seilaoqvemaqui/'
    server: {
      baseDir: './dist/' // diretorio da raiz ./dist/
    }
  })
}
// Tarefa para iniciar o browser-sync
gulp.task('browser-sync', browser);


// Função de watch do Gulp
function watch() {
  gulp.watch('./src/scss/**/*.scss', buildScss);
  gulp.watch('./src/js/**/*.js', buildJs);
  gulp.watch('./src/index.html', buildHtml);
  gulp.watch(['./src/*.html','/src/*.php', './src/**/*.php']).on('change', browserSync.reload);
  //['*.html']
}
// Inicia a tarefa de Watch
gulp.task('watch', watch);

//Tarefa padrão do Gulp, que inicia o Watch e o Browser-sync // Aqui são os nomes que ficam nas tarefas
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'appjs' , 'html')); 


/* Como utilizar 
1 - $ npm install
2 - $ gulp buildFrameworksCSS
3 - $ gulp buildFrameworksJS
4 - $ gulp

*/