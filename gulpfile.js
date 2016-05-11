var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    watch       = require('gulp-watch'),
    cp          = require('child_process'),
    gutil       = require('gulp-util'),
    git         = require('gulp-git'),
    prompt      = require('gulp-prompt'),
    runSequence = require('run-sequence');
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

gulp.task('gulp:commit', function(){
  // just source anything here - we just wan't to call the prompt for now
  return gulp.src('./*')
  .pipe(prompt.prompt({
    type: 'input',
    name: 'commit',
    message: 'Please enter commit message:'
  }, function(res){
    // now add all files that should be committed
    // but make sure to exclude the .gitignored ones, since gulp-git tries to commit them, too
    return gulp.src([ '!node_modules/', './*' ], {buffer:false})
    .pipe(git.commit(res.commit));
   }));
});

// Run git push, remote is the remote repo, branch is the remote branch to push to
gulp.task('gulp:push', ['gulp:commit'], function(cb){
    return git.push('', '', cb, function(err){
        if (err) throw err;
    });
});

// # task completed notification with green color!
gulp.task('gulp:done', ['gulp:push'], function(){
  console.log('');
  gutil.log(gutil.colors.green('************** Git push is done! **************'));
  console.log('');
  done();
});

// gulp task to commit and push data on git
gulp.task('github', function(){
   return runSequence(['gulp:commit', 'gulp:push', 'gulp:done'])
});


