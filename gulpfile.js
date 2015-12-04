var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    concatCss = require('gulp-concat-css'),  //针对css做文件合并，可以根据import的顺序来合并
    miniCss = require('gulp-minify-css'), //压缩css
    rename = require('gulp-rename'), //对文件重命名
    htmlreplace = require('gulp-html-replace'),//替换html
    tap = require('gulp-tap'), //获取文件路径
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    jst = require('gulp-amd-jst'),
    jade = require('gulp-jade'),
    rjs = require('gulp-requirejs');
   
var time = setTime(),
    viewFileNames = [],
    bowerFileNames = [];


/*
*  task默认写法为
*  gulp.task('任务名'，['依赖任务一','依赖任务二']，callback)
*/



/*
* webserver用来起服务
*/
gulp.task('webserver',function(){
	gulp.src('./build')
		.pipe(webserver({
		    livereload: true,                                   //监听改变 自我刷新
      		directoryListing: false,							//不显示文件树状清单
      		open:true,                                          //是否自动在浏览器中打开，默认不打开
    		  host:'localhost',                                   //默认为localhost
      		port:9000,
          path:'/',	                                        //默认端口号为8000
      		fallback:'index.html'                                        //默认路径
    }))
})


/*
* 合并 压缩css文件
* newLine  文件之间的分隔符
*/
gulp.task('minify-css',function(){
    return gulp.src('./app/css/app.css')
               .pipe(concatCss('all.css'))
               .pipe(miniCss({keepBreaks:false}))
               .pipe(rename(function(path){
                    path.basename += ".min";
                    path.extname = '.css';
                }))
               .pipe(gulp.dest('./build/asset/'+time+'/css/'))
})



// 获取view目录下一级目录的名称
gulp.task('getViewFileName',function(){ 
    return gulp.src('./app/view/*/*.js')
                .pipe(tap(function(file,t){
                   getViewFileName(file.path)
                }))
})


// 获取components目录下一级目录的名称
gulp.task('getBowerFileName',function(){
    return gulp.src('./app/components/*/*')
              .pipe(tap(function(file,t){
                    getBowerFileName(file.path)
              }))
})


gulp.task('clean',function(cb){
   return gulp.src('./build/')
              .pipe(clean({read:false,force:true}))
})



/*
* 压缩合并 rrequire加载的模块
*/

//[require]
gulp.task('minifyCommonScripts', ['getBowerFileName'],function(){
    bowerFileNames = bowerFileNames.concat(['main','router/index']);
    rjs({
      baseUrl: './app',
      mainConfigFile: 'app/config.js',
      include : bowerFileNames,
      out : 'main.js',
    })
    .pipe(uglify())
    .pipe(gulp.dest('./build/asset/'+time+'/js/'));
})


gulp.task('minifyViewScripts',['getViewFileName'],function(){
    rjs({
      baseUrl: './app',
      mainConfigFile: 'app/config.js',
      include:viewFileNames,
      out : 'view.js',
    })
    .pipe(uglify())
    .pipe(gulp.dest('./build/asset/'+time+'/js/'));
})


/*
*   编译模板
*/

gulp.task('jst',function(){
    gulp.src('./app/page/**/*.html')
        .pipe(jst({
          amd:true,
          prettify :true,
          namespace:true
        }))
        .pipe(gulp.dest('./app/templates'))
})



/*
*   替换html
*/

// 'js':'./build/'+time+'app.min.js',
gulp.task('html-replace',function(){
    var opts = {comments:false,spare:false,quotes:true};
    return gulp.src('./index.html')
               .pipe(htmlreplace({
                    'css':'asset/'+time+'/css/all.min.css',
                    'mainjs':'asset/'+time+'/js/main.js',
                    'viewjs':'asset/'+time+'/js/view.js',
               }))
               .pipe(gulp.dest('./build/'))
})




//生成时间戳
function setTime(){
    var time = new Date();
        m = time.getMonth(),
        month = m>10?m:m+1,
        str = ''+time.getFullYear()+
              ''+handelDate(month)+
              ''+handelDate(time.getDate())+
              ''+handelDate(time.getHours())+
              ''+handelDate(time.getMinutes());
    return str
}

function handelDate(time){
  time = time < 10 ? '0'+time:time
  return time
}

function getViewFileName(srcpath){
   var viewPath = srcpath.split('view\\')[1].replace('.js','');
   var arr = viewPath.split('\\').join('/');
   viewFileNames.push('view/'+arr);
}



//用r.js打包时一定要将require写成requirejs
function getBowerFileName(srcpath){
   var viewPath = srcpath.split('components\\')[1].split('\\')[1].replace('.js','');
   if(viewPath == 'require'){
       viewPath = 'requirejs'
   }
   bowerFileNames.push(viewPath)
}


gulp.task('server',['webserver']);
gulp.task('minifyjs',['minifyCommonScripts','minifyViewScripts']);
gulp.task('release',['clean'],function(){
    gulp.start('minifyjs','minify-css','html-replace');
})


 