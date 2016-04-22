var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync').create();
var watch       = require('gulp-watch');
var cp       = require('child_process');
// 静态服务器

var option = {
    src:'app'
}
// 静态服务器
gulp.task('server',['sass'],function() {
    browserSync.init({
        server: {
            baseDir: option.src + "/",
        },
        ui: {
            port: 8080
        },
        open: "external"
        });
    gulp.watch( option.src + "/scss/*.scss",['sass',browserSync.reload]);
   gulp.watch([option.src + "/js/**",
                 option.src + "/img/**",
                 option.src + "/*.html",
                 option.src + "/data/**"
         ]).on('change',browserSync.reload);
});
gulp.task('sass', function() {
    return gulp.src(option.src + "/scss/*.scss")
        .pipe(sass())
        .on('error', function(err) {
         console.log('Less Error!', err.message);
         this.emit('end');
        })
        .pipe(gulp.dest(option.src + "/css"))
        // .pipe(browserSync.reload({stream: true}));
});

var p;
gulp.task('serve',function(){
    function restart(e){
        if(p){
            console.log("PID: "+p.pid);
            console.log("gulpfile.js has change , restart server");
            var result = p.kill("SIGTERM");
            console.log(result);
        }
        p = cp.exec('gulp server',{stdio:'inherit'});
    }
    restart();
    gulp.watch('gulpfile.js',restart).on('error',function(e){
        console.log("error")
    });
});


