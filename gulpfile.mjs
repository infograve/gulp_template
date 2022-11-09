;
/* ########## モジュール読込 ########## */
import gulp             from 'gulp';
import cleancss         from 'gulp-clean-css';
import ejs              from 'gulp-ejs';
import htmlmin          from 'gulp-htmlmin';
import imagemin         from 'gulp-imagemin';
import imagemin_mozjpeg from 'imagemin-mozjpeg';
import phtmlsimplecomp  from 'gulp-phtml-simple-comp';
import plumber          from 'gulp-plumber';
import rename           from 'gulp-rename';
import sassdart         from 'sass';
import sassgulp         from 'gulp-sass';
import typescript       from 'gulp-typescript';
import uglify           from 'gulp-uglify';
import yaml             from 'gulp-yaml';

const sass          = sassgulp(sassdart);


/* ########## パス設定 ########## */
var array_path = {
/* ********** origin (ソースファイル) ********** */
  origin      :{
    path        :'src/',
    ejs         :[
                  'src/**/*.ejs',
                  '!src/_**/*',
                  '!src/**/_*'
                ],
    sass        :[
                  'src/**/*.scss',
                  '!src/_**/*',
                  '!src/**/_*'
                ],
    typescript  :[
                  'src/**/*.ts',
                  '!src/_**/*',
                  '!src/**/_*'
                ],
    yaml        :[
                  'src/**/*.yml',
                  '!src/_**/*',
                  '!src/**/_*'
                ],
    image       :[
                  'src/**/*.+(gif|jpg|png|svg)',
                  '!src/_**/*',
                  '!src/**/_*'
                ],
    copy        :[
                  'src/**/*',
                  '!src/**/*.+(ejs|scss|ts|yml|gif|jpg|png|svg)',
                  '!src/_**/*',
                  '!src/**/_*'
                ]
              },
/* ********** prototype (ローカルテスト) ********** */
  prototype   :{
    path        :'prototype/',
    html        :[
                  'prototype/**/*.html',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ],
    php         :[
                  'prototype/**/*.php',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ],
    css         :[
                  'prototype/**/*.css',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ],
    javascript  :[
                  'prototype/**/*.js',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ],
    copy        :[
                  'prototype/**/*',
                  '!prototype/**/*.+(html|php|css|js)',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ]
              },
/* ********** release (納品) ********** */
  release     :{
    path        :'release/'
              }
};


/* ########## prototype ローカルテスト版作成 ########## */
/* ========== execution_ejs EJSのコンパイル ========== */
function execution_ejs(arg_function_callback) {
  gulp.src(array_path.origin.ejs)
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({extname:''}))
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}
/* ========== execution_sass SASSのコンパイル ========== */
function execution_sass(arg_function_callback) {
  gulp.src(array_path.origin.sass)
    .pipe(plumber())
    .pipe(sass({outputStyle:'expanded'}))
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}
/* ========== execution_typescript TypeScriptのコンパイル ========== */
function execution_typescript(arg_function_callback) {
  gulp.src(array_path.origin.typescript)
    .pipe(plumber())
    .pipe(typescript())
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}
/* ========== execution_yaml YAMLのコンバート ========== */
function execution_yaml(arg_function_callback) {
  gulp.src(array_path.origin.yaml)
    .pipe(plumber())
    .pipe(yaml())
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}
/* ========== compless_image 画像の圧縮 ========== */
function compless_image(arg_function_callback) {
  gulp.src(array_path.origin.image)
    .pipe(plumber())
    .pipe(imagemin([
      imagemin_mozjpeg({progressive:true})
    ]))
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}
/* ========== copy_origin2prototype ファイルのコピー(origin to prototype) ========== */
function copy_origin2prototype(arg_function_callback) {
  gulp.src(array_path.origin.copy)
    .pipe(plumber())
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}


/* ########## release 納品ファイル作成 ########## */
function execution_release(arg_function_callback) {
  gulp.parallel(compress_html);
  arg_function_callback();
}
/* ========== compress_html HTMLの圧縮 ========== */
function compress_html(arg_function_callback) {
  gulp.src(array_path.prototype.html)
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(array_path.release.path));
  arg_function_callback();
}
/* ========== compress_php PHPの圧縮 ========== */
function compress_php(arg_function_callback) {
  gulp.src(array_path.prototype.php)
    .pipe(plumber())
    .pipe(phtmlsimplecomp())
    .pipe(gulp.dest(array_path.release.path));
  arg_function_callback();
}
/* ========== compress_css CSSの圧縮 ========== */
function compress_css(arg_function_callback) {
  gulp.src(array_path.prototype.css)
    .pipe(plumber())
    .pipe(cleancss())
    .pipe(gulp.dest(array_path.release.path));
  arg_function_callback();
}
/* ========== compress_javascript JSの圧縮 ========== */
function compress_javascript(arg_function_callback) {
  gulp.src(array_path.prototype.javascript)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(array_path.release.path));
  arg_function_callback();
}
/* ========== copy_prototype2release ファイルのコピー(prototype to release) ========== */
function copy_prototype2release(arg_function_callback) {
  gulp.src(array_path.origin.copy)
    .pipe(plumber())
    .pipe(gulp.dest(array_path.prototype.path));
  arg_function_callback();
}


/* ********** default ローカルテスト版作成 ********** */
export default gulp.parallel(execution_ejs,execution_sass,execution_typescript,execution_yaml,compless_image,copy_origin2prototype);

/* ********** release 納品ファイル作成 ********** */
export let release = gulp.parallel(compress_html,compress_php,compress_css,compress_javascript,copy_prototype2release);
