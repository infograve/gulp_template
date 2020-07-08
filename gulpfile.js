;
/* ########## モージュール読込 ########## */
const deepmerge           = require('deepmerge');
const del                 = require('del');
const gracefulFs          = require('graceful-fs');
const gulp                = require('gulp');
const gulpChanged         = require('gulp-changed');
const gulpCleanCss        = require('gulp-clean-css');
const gulpEjs             = require('gulp-ejs');
const gulpHtmlmin         = require('gulp-htmlmin');
const gulpIf              = require('gulp-if');
const gulpImagemin        = require('gulp-imagemin');
const gulpPhtmlSimpleComp = require('gulp-phtml-simple-comp');
const gulpPlumber         = require('gulp-plumber');
const gulpRename          = require('gulp-rename');
const gulpReplace         = require('gulp-replace');
const gulpSass            = require('gulp-sass');
const gulpUglify          = require('gulp-uglify');



/* ########## パス設定 ########## */
var arrayFilePaths = {
  jsonPageList          :'./pagelist.json',

/* ********** origin (ソースファイル) ********** */
  origin                :{
    path                  :'src/',
    sass                  :[
                            'src/**/*.scss',
                            '!src/_**/*',
                            '!src/**/_*'
                          ],
    image                 :[
                            'src/**/*.+(jpg|gif|png)',
                            '!src/_**/*',
                            '!src/**/_*'
                          ],
    copy                  :[
                            'src/**/*',
                            '!src/**/*.+(ejs|scss|jpg|gif|png)',
                            '!src/_**/*',
                            '!src/**/_*'
                          ]
                        },

/* ********** prototype (ローカルテスト) ********** */
  prototype             :{
    path                  :'prototype/',
    html                  :[
                            'prototype/**/*.html',
                            '!prototype/_**/*',
                            '!prototype/**/_*'
                          ],
    php                   :[
                            'prototype/**/*.php',
                            '!prototype/_**/*',
                            '!prototype/**/_*'
                          ],
    css                   :[
                            'prototype/**/*.css',
                            '!prototype/_**/*',
                            '!prototype/**/_*'
                          ],
    js                    :[
                            'prototype/**/*.js',
                            '!prototype/_**/*',
                            '!prototype/**/_*'
                          ],
    copy                  :[
                            'prototype/**/*',
                            '!prototype/**/*.+(html|php|css|js)',
                            '!prototype/_**/*',
                            '!prototype/**/_*'
                          ]
                        },

/* ********** develop (開発サーバ) ********** */
  develop               :{
    path                  :'develop/',
    replace               :{
      oldphrase             :'',
      newphrase             :''
                          }
                        },

/* ********** staging (ステージング) ********** */
  staging               :{
    path                  :'staging/',
    replace               :{
      oldphrase             :'',
      newphrase             :''
                          }
                        },

/* ********** release (本番) ********** */
  release               :{
    path                  :'release/',
    replace               :{
      oldphrase             :'',
      newphrase             :''
                          }
                        }
};



/* ########## prototype ローカルテスト版作成 ########## */
/* ========== compileEjs EJSのコンパイル ========== */
gulp.task('compileEjs', function(argCallBack) {
  var tmpProperties =JSON.parse(gracefulFs.readFileSync(arrayFilePaths.jsonPageList));
  compileEjs(tmpProperties);
  argCallBack();
});
/* ++++++++++ compileEjs EJSコンパイル再帰函数 ++++++++++ */
function compileEjs(argProperties, argInheritanceProperties = {}){
  var tmpProperties = deepmerge({},argProperties);
  var tmpInheritanceProperties = deepmerge({},argInheritanceProperties);
  var tmpPureProperties = deepmerge({}, tmpProperties);
  delete tmpPureProperties.pages;
  delete tmpPureProperties.directories;
  tmpInheritanceProperties = deepmerge(tmpInheritanceProperties, tmpPureProperties);

  if('pages' in tmpProperties){
    tmpProperties.pages.forEach(function(argValue){
      compileEjs(argValue, tmpInheritanceProperties);
    });
  }

  if('directories' in tmpProperties){
    tmpProperties.directories.forEach(function(argValue){
      compileEjs(argValue, tmpInheritanceProperties);
    });
  }

  if('destination' in tmpProperties){
    gulp.src(arrayFilePaths.origin.path+tmpInheritanceProperties.source)
      .pipe(gulpPlumber())
      .pipe(gulpEjs({propaties:tmpInheritanceProperties}))
      .on('error', function(argError){ console.log(argError.message); this.emit('end'); })
      .pipe(gulpRename('./'+tmpInheritanceProperties.destination))
      .pipe(gulp.dest(arrayFilePaths.prototype.path));
  }
}

/* ========== compileSass Sassコンパイル ========== */
gulp.task('compileSass', function(){
  return gulp.src(arrayFilePaths.origin.sass)
    .pipe(gulpPlumber())
    .pipe(gulpSass({outputStyle: 'expanded'}))
    .on('error', function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.prototype.path));
});

/* ========== compressImage 画像圧縮 ========== */
gulp.task('compressImage', function(){
  return gulp.src(arrayFilePaths.origin.image)
    .pipe(gulpPlumber())
    .pipe(gulpChanged(arrayFilePaths.prototype.path))
    .pipe(gulpImagemin())
    .on('error', function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.prototype.path));
});

/* ========== copy2Prototype prototypeへファイルをコピー ========== */
gulp.task('copy2Prototype', function(){
  return gulp.src(arrayFilePaths.origin.copy)
    .pipe(gulpPlumber())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.prototype.path));
});

/* ********** コマンド ********** */
gulp.task('prototype', gulp.parallel(gulp.series('compileSass','compileEjs'),'compressImage','copy2Prototype'));
gulp.task('prot', gulp.task('prototype'));
gulp.task('default', gulp.task('prototype'));



/* ########## develop 開発サーバ版作成 ########## */
/* ========== devHtml HTMLの置換 ========== */
gulp.task('devHtml', function(){
  return gulp.src(arrayFilePaths.prototype.html)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.develop.replace.oldphrase +')', 'g'),arrayFilePaths.develop.replace.newphrase))
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.develop.path));
});

/* ========== devPHP PHPの置換 ========== */
gulp.task('devPHP', function(){
  return gulp.src(arrayFilePaths.prototype.php)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.develop.replace.oldphrase +')', 'g'),arrayFilePaths.develop.replace.newphrase))
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.develop.path));
});

/* ========== devCSS CSSの置換 ========== */
gulp.task('devCSS', function(){
  return gulp.src(arrayFilePaths.prototype.css)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.develop.replace.oldphrase +')', 'g'),arrayFilePaths.develop.replace.newphrase))
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.develop.path));
});

/* ========== devJS JSの置換 ========== */
gulp.task('devJS', function(){
  return gulp.src(arrayFilePaths.prototype.js)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.develop.replace.oldphrase +')', 'g'),arrayFilePaths.develop.replace.newphrase))
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.develop.path));
});

/* ========== copy2Develop developへファイルをコピー ========== */
gulp.task('copy2Develop', function(){
  return gulp.src(arrayFilePaths.prototype.copy,{ base:arrayFilePaths.prototype.path })
    .pipe(gulpPlumber())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.develop.path));
});

/* ********** コマンド ********** */
gulp.task('develop', gulp.parallel('devHtml','devPHP','devCSS','devJS','copy2Develop'));
gulp.task('dev', gulp.task('develop'));



/* ########## staging ステージング版作成 ########## */
/* ========== stagingHtml HTMLの置換と圧縮 ========== */
gulp.task('stagingHtml', function(){
  return gulp.src(arrayFilePaths.prototype.html)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.staging.replace.oldphrase +')', 'g'),arrayFilePaths.staging.replace.newphrase))
/*  .pipe(gulpHtmlmin({collapseWhitespace:true})) */
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.staging.path));
});

/* ========== stagingPHP PHPの置換と圧縮 ========== */
gulp.task('stagingPHP', function(){
  return gulp.src(arrayFilePaths.prototype.php)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.staging.replace.oldphrase +')', 'g'),arrayFilePaths.staging.replace.newphrase))
    .pipe(gulpPhtmlSimpleComp())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.staging.path));
});

/* ========== stagingCSS CSSの置換と圧縮 ========== */
gulp.task('stagingCSS', function(){
  return gulp.src(arrayFilePaths.prototype.css)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.staging.replace.oldphrase +')', 'g'),arrayFilePaths.staging.replace.newphrase))
    .pipe(gulpCleanCss())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.staging.path));
});

/* ========== stagingJS JSの置換と圧縮 ========== */
gulp.task('stagingJS', function(){
  return gulp.src(arrayFilePaths.prototype.js)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.staging.replace.oldphrase +')', 'g'),arrayFilePaths.staging.replace.newphrase))
    .pipe(gulpUglify())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.staging.path));
});

/* ========== copy2Staging stagingへファイルをコピー ========== */
gulp.task('copy2Staging', function(){
  return gulp.src(arrayFilePaths.prototype.copy,{ base:arrayFilePaths.prototype.path })
    .pipe(gulpPlumber())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.staging.path));
});

/* ********** コマンド ********** */
gulp.task('staging', gulp.parallel('stagingHtml','stagingPHP','stagingCSS','stagingJS','copy2Staging'));
gulp.task('stg', gulp.task('staging'));



/* ########## release リリース版作成 ########## */
/* ========== releaseHtml HTMLの置換と圧縮 ========== */
gulp.task('releaseHtml', function(){
  return gulp.src(arrayFilePaths.prototype.html)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.release.replace.oldphrase +')', 'g'),arrayFilePaths.release.replace.newphrase))
    .pipe(gulpHtmlmin({collapseWhitespace:true, removeComments:true}))
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.release.path));
});

/* ========== releasePHP PHPの置換と圧縮 ========== */
gulp.task('releasePHP', function(){
  return gulp.src(arrayFilePaths.prototype.php)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.release.replace.oldphrase +')', 'g'),arrayFilePaths.release.replace.newphrase))
    .pipe(gulpPhtmlSimpleComp())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.release.path));
});

/* ========== releaseCSS CSS圧縮と置換 ========== */
gulp.task('releaseCSS', function(){
  return gulp.src(arrayFilePaths.prototype.css)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.release.replace.oldphrase +')', 'g'),arrayFilePaths.release.replace.newphrase))
    .pipe(gulpCleanCss())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.release.path));
});

/* ========== releaseJS JS圧縮と置換 ========== */
gulp.task('releaseJS', function(){
  return gulp.src(arrayFilePaths.prototype.js)
    .pipe(gulpPlumber())
    .pipe(gulpReplace(new RegExp('('+ arrayFilePaths.release.replace.oldphrase +')', 'g'),arrayFilePaths.release.replace.newphrase))
    .pipe(gulpUglify())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.release.path));
});

/* ========== copy2Release releaseへファイルをコピー ========== */
gulp.task('copy2Release', function(){
  return gulp.src(arrayFilePaths.prototype.copy,{ base:arrayFilePaths.prototype.path })
    .pipe(gulpPlumber())
    .on('error',function(argError){ console.log(argError.message); this.emit('end'); })
    .pipe(gulp.dest(arrayFilePaths.release.path));
  argCallBack();
});

/* ********** コマンド ********** */
gulp.task('release', gulp.parallel('releaseHtml','releasePHP','releaseCSS','releaseJS','copy2Release'));
