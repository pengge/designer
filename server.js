var fs = require('fs');
var path = require('path');
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var koaBody = require('koa-body');
var gzip = require('koa-gzip');
var gulp = require('gulp');
var zip = require('gulp-zip');
var app = koa();

app.use(gzip());

app.use(koaBody({
  formidable: {uploadDir: __dirname},
  textLimit: '50mb',
  formLimit: '50mb'
}));


router.post('/download', function (next) {
  // this.request.body;
  //console.log(this.request.body.html_code);
  //var styles = this.request.body.css_code;
  //var htmls = this.request.body.html_code;
  //var scripts = this.request.body.script_code;
  var htmls = this.request.body.files;
  //console.log(htmls);

  var tpl = [
    '<!DOCTYPE html>\n',
    '<html lang="en">\n',
    '<head>\n',
    '<meta charset="UTF-8">\n',
    '<title></title>\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/bootstrap/css/bootstrap.css">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/fonts/designfont/iconfont.css">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/uui/assets/fonts/font-awesome/css/font-awesome.css">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u.css">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u-extend.css">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/templates/website/tenxcloud/css/console/main.526.css?rev=0.1.0">\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/templates/website/talentHome/css/index.css"/>\n',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/scrollbar/jquery.mCustomScrollbar.css">\n',
    '<link rel="stylesheet" type="text/css" href="http://design.yyuap.com/designer/main.css">\n',
    '</head>\n',
    '<body class="designer-preview">\n',
    htmls,
    '<script src="http://design.yyuap.com/designer/trd/jquery/jquery-1.11.2.min.js"></script>\n',
    '<script src="http://design.yyuap.com/designer/trd/knockout/knockout-3.2.0.debug.js"></script>\n',
    '<script src="http://design.yyuap.com/designer/trd/bootstrap/js/bootstrap.min.js"></script>\n',
    '<script src="http://design.yyuap.com/static/uui/latest/js/u.js"></script>\n',
    '<script src="http://design.yyuap.com/static/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>\n',
    '<script src="http://design.yyuap.com/templates/website/talentHome/js/index.js"></script>\n',
    '<script src="http://design.yyuap.com/designer/bundle.js"></script>\n',
    '</body>\n',
    '</html>\n'
  ]

  var self = this;

  var templateName = 'build/template.html';

  fs.writeFileSync(templateName, tpl.join(""),{},function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });


  var data = fs.createReadStream(templateName);

  gulp.task('zip',function(){
    return gulp.src(templateName).pipe(zip('template.zip')).pipe(gulp.dest('build'));
  });

  gulp.run('zip');


  this.redirect('template.zip');
  //this.body = fs.createReadStream('./export/template.zip');

});

router.post('/preview', function (next) {
  // this.request.body;
  //console.log(this.request.body.html_code);
  //var styles = this.request.body.css_code;
  //var htmls = this.request.body.html_code;
  //var scripts = this.request.body.script_code;
  var htmls = this.request.body.files;
  //console.log(htmls);

  var tpl = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<title></title>',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/bootstrap/css/bootstrap.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/fonts/designfont/iconfont.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/uui/assets/fonts/font-awesome/css/font-awesome.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u-extend.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/templates/website/tenxcloud/css/console/main.526.css?rev=0.1.0">',
    '<link rel="stylesheet" href="http://design.yyuap.com/templates/website/talentHome/css/index.css"/>',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/scrollbar/jquery.mCustomScrollbar.css">',
    '<link rel="stylesheet" type="text/css" href="http://design.yyuap.com/designer/main.css">',
    '</head>',
    '<body class="designer-preview">',
    htmls,
    '<script src="http://design.yyuap.com/designer/trd/jquery/jquery-1.11.2.min.js"></script>',
    '<script src="http://design.yyuap.com/designer/trd/knockout/knockout-3.2.0.debug.js"></script>',
    '<script src="http://design.yyuap.com/designer/trd/bootstrap/js/bootstrap.min.js"></script>',
    '<script src="http://design.yyuap.com/static/uui/latest/js/u.js"></script>',
    '<script src="http://design.yyuap.com/static/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>',
    '<script src="http://design.yyuap.com/templates/website/talentHome/js/index.js"></script>',
    '<script src="http://design.yyuap.com/designer/bundle.js"></script>',
    '</body>',
    '</html>'
  ]

  //var self = this;
  //fs.writeFileSync('files.html', tpl.join(""), function (err) {
  //  if (err) throw err;
  //  console.log('It\'s saved!');
  //});
  //
  //var data = fs.createReadStream('files.html');

  this.body = tpl.join("");

});

app.use(router.routes())
  .use(router.allowedMethods());

// response
app.use(function *(next){
  // (3) 进入 response 中间件，没有捕获到下一个符合条件的中间件，传递到 upstream
  if (this.request.url === '/') {
    this.body = fs.readFileSync(path.resolve(__dirname, './build/index.html')).toString();
  } else {
    return yield* next;
  }
});

app.use(serve(path.join(__dirname, './build'),{maxAge:3600000000}));

app.listen( 9000 );
