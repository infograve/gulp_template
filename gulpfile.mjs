;
/* ########## モジュール読込 ########## */
import gulp             from 'gulp';
import ejs              from 'gulp-ejs';
import imagemin         from 'gulp-imagemin';
import imagemin_mozjpeg from 'imagemin-mozjpeg';
import plumber          from 'gulp-plumber';
import rename           from 'gulp-rename';
import sassdart         from 'sass';
import sassgulp         from 'gulp-sass';
import typescript       from 'gulp-typescript';

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
    image       :[
                  'src/**/*.+(gif|jpg|png|svg)',
                  '!src/_**/*',
                  '!src/**/_*'
                ]
              },
/* ********** prototype (ローカルテスト) ********** */
  prototype   :{
    path        :'prototype/',
    ejs         :[
                  'prototype/**/*.ejs',
                  '!prototype/_**/*',
                  '!prototype/**/_*'
                ]
              }
}

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


export default gulp.parallel(execution_ejs,execution_sass,execution_typescript,compless_image);
