// var watchify = require('watchify');
// var browserify = require('browserify');
var config = require("./pageConfig.js");
var path = require("path");
var gulp = require("gulp");
var useref = require("gulp-useref");
var less = require("gulp-less");
var series = require('stream-series');
var minifyCss = require('gulp-clean-css');
var htmlmin = require("gulp-htmlmin");
var revCollector = require("gulp-rev-collector");
var cssnano = require("gulp-cssnano");
const imagemin = require('gulp-imagemin');
var htmlmin = require("gulp-htmlmin");
// var runSequence = require("run-sequence");
var del = require("del");
var autoprefixer = require("gulp-autoprefixer");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync");
var inject = require("gulp-inject");
var sort = require("sort-stream2");
var babel = require("gulp-babel");
const changed = require("gulp-changed");
const rev = require("gulp-rev");
var uglify = require("gulp-uglify");
// var t = new Date().getTime();
// const reload = browserSync.reload;
var pageConfig = config.pageConfig;
var pageNames = Object.keys(pageConfig);
var utilLocation = config.utilLocation;
var scriptsSource = [].concat(utilLocation.js);//加载额外配置的脚步
var stylesSource = [].concat(utilLocation.css);//加载额外配置的css
var imgsSource = [];
var htmlTaskList = [];
var allPageFolder = [];
var devFolder = path.resolve(__dirname, "./dev");
var buildFolder = path.resolve(__dirname, "./dist");
var md5Build = path.resolve(__dirname, "./md5");
var libPath = path.resolve(__dirname, "./src/lib");
var copyImg = [];
var buildHtml = function ({ pageName }) {
  gulp.task(pageName, function (done) {
    var target = gulp.src(`./src/pages/${pageName}/${pageName}.html`);
    var sourcesJs = gulp.src([`./src/pages/${pageName}/js/*.js`]).pipe(
      sort(function (a, b) {
        return a.path > b.path;
      })
    );
    var sourcesCss = gulp.src([`./src/pages/${pageName}/css/*`], { read: false }).pipe(
      sort(function (a, b) {
        return a.path > b.path;
      })
    );
    var insertCssStream = sourcesCss;
    if (pageConfig[pageName].partialCss) {
      var cssVendorStream = gulp.src(pageConfig[pageName].partialCss, { read: false });
      insertCssStream = series(cssVendorStream, sourcesCss)
    }
    target = target
      .pipe(
        inject(insertCssStream, {
          relative: true,
          addPrefix: "./css",
          transform: function (filepath, file, index, length, targetFile) {
            var reg = /[a-zA-Z]*\.((less)|(css))/;
            var result = reg.exec(filepath);
            var fileName = result ? result[0] : "";
            fileName = fileName.replace(/\.((less)|(css))/, "");
            return `<link rel="stylesheet" href="./css/${fileName}.css">`
          }
        })
      )
    var insertJsStream = sourcesJs;
    if (pageConfig[pageName].partialJs) {
      var jsVendorStream = gulp.src(pageConfig[pageName].partialJs, { read: false });
      insertJsStream = series(jsVendorStream, sourcesJs)
    }
    target = target.pipe(
      inject(insertJsStream, {
        relative: true,
        addPrefix: "./js",
        transform: function (filepath, file, index, length, targetFile) {
          var reg = /[a-zA-Z]*[.0-9]*\.js/;
          var result = reg.exec(filepath);
          var fileName = result ? result[0] : "";
          return `<script src="./js/${fileName}"></script>`
        }
      })
    )
    target.pipe(
      inject(gulp.src(["./src/pages/common/*.html"]), {
        starttag: "<!-- inject:{{path}} -->",
        relative: true,
        transform: function (filepath, file, index, length, targetFile) {
          return file.contents.toString("utf8");
        }
      })
    )
      // .pipe(
      //   htmlmin({
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     collapseBooleanAttributes: true,
      //     removeAttributeQuotes: true,
      //     removeRedundantAttributes: true,
      //     removeEmptyAttributes: true,
      //     removeScriptTypeAttributes: true,
      //     removeStyleLinkTypeAttributes: true,
      //     removeOptionalTags: true
      //   })
      // )
      .pipe(gulp.dest(devFolder));
    done();
  });
}
/**
 * 自动页面配置的滴三方 js css 导入处理的数组
 */
var pageConfigKeys = Object.keys(pageConfig);
for (var pageConfigKey of pageConfigKeys) {
  var itemConfig = pageConfig[pageConfigKey];
  if (itemConfig.partialCss && itemConfig.partialCss.length > 0) {
    stylesSource = stylesSource.concat(itemConfig.partialCss);
  }
  if (itemConfig.partialJs && itemConfig.partialJs.length > 0) {
    scriptsSource = scriptsSource.concat(itemConfig.partialJs);
  }
}
for (let pageName of pageNames) {
  scriptsSource.push(`./src/pages/${pageName}/js/*.js`);
  stylesSource.push(`./src/pages/${pageName}/css/**`);
  imgsSource.push(`./src/pages/${pageName}/img/**`);
  allPageFolder.push(`./src/pages/${pageName}`);
}
for (let pageName of pageNames) {
  buildHtml({ pageName });
  htmlTaskList.push(pageName);
}
// done();
// });
// var pagesName = ["user", "home"]; //通过其他方式寻找变动过的目录 动态的生成数组传递

var scripts = function (done) {
  gulp
    .src(scriptsSource)
    .pipe(changed("./temp"))
    .pipe(gulp.dest("./temp"))
    .pipe(
      babel({
        presets: [
          [
            "@babel/env",
            {
              targets: {
                browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
              }
            }
          ]
        ]
        // plugins: ["@babel/runtime"]
      })
    )
    // .pipe(uglify())
    .pipe(gulp.dest(path.resolve(devFolder, './js')));
  done();
};
var styles = function (done) {
  const AUTOPREFIXER_BROWSERS = [
    "ie >= 10",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.4",
    "bb >= 10"
  ];
  gulp
    .src(stylesSource)
    .pipe(changed("./temp"))
    .pipe(gulp.dest("./temp"))
    .pipe(less())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    // .pipe(cssnano())
    .pipe(gulp.dest(path.resolve(devFolder, "./css")));
  done();
};
var imgs = function () {
  return gulp.src(imgsSource)
    .pipe(changed("./temp"))
    .pipe(gulp.dest("./temp"))
    .pipe(gulp.dest(path.resolve(devFolder, "./img")));
};

var htmlLinkChange = function (path) {
  for (let taskName of htmlTaskList) {
    if (path.indexOf(taskName) != -1) {
      gulp.series(taskName)();
      return;
    }
  }
}
var folderChange = function (path) {
  var reg = /[a-zA-Z]{1,}\.html/;
  var result = reg.exec(path);
  if (result) {
    var taskName = result[0].replace('.html', "");
    gulp.series(taskName)();
  }
}
var watcher = function (done) {
  gulp.watch(scriptsSource, scripts);
  gulp.watch(stylesSource, styles);
  gulp.watch(libPath, copyLib);
  var watcher = gulp.watch(allPageFolder);
  watcher.on("add", htmlLinkChange)
  watcher.on("unlink", htmlLinkChange);
  watcher.on("change", folderChange);
  gulp.watch(imgsSource, imgs);
  done();
};
var server = function (done) {
  browserSync({
    // notify: false,
    logPrefix: "WSK",
    // Allow scroll syncing across breakpoints
    // scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    watch: true,
    files: ["dev/css/*.css", "dev/js/*.js", "dev/*.html"],
    server: "dev",
    reloadDelay: 500,
    port: 3000
  });
  done();
};
gulp.task('server',server);
var copyLib = function () {
  return gulp.src(libPath+"/**")
    .pipe(changed("./temp"))
    .pipe(gulp.dest("./temp"))
    .pipe(gulp.dest(devFolder + "/lib"));
}
gulp.task("clean", () => del([devFolder, "./temp"]));
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("clean"),
    // gulp.series('home',"user")
    // function(done){
    //   console.log(htmlTaskList);
    //   done()
    // }
    gulp.parallel(copyLib, scripts, styles, htmlTaskList, imgs, watcher),
    server
  )
);
//扫描开发环境下面的 html 
var cleanBuild = function () {
  return del([buildFolder])
}
var combine = function () {
  return gulp.src(devFolder + '/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    // .pipe(cssnano())
    .pipe(gulpif('*.css', minifyCss({ compatibility: 'ie8' })))
    .pipe(gulp.dest(buildFolder));
}
gulp.task("combine", gulp.series(cleanBuild, combine));



gulp.task('md5', function () {
  return gulp.src(buildFolder + "/*/*")
    .pipe(rev())
    .pipe(gulp.dest(md5Build))
    .pipe(rev.manifest({ merge: true }))
    .pipe(gulp.dest(md5Build));
})
// gulp.task("miniimg",function(){
//   return gulp.src('dev/img/car/**')
// 		.pipe(imagemin({
//       verbose:true
//     }))
// 		.pipe(gulp.dest('./miniImg'))
//   // imagemin
// });
//md5命替换
gulp.task('rev', function () {
  //吧开发环境里面的 lib 拷贝过来
  gulp.src(devFolder+'/lib/**')
  .pipe(gulp.dest(md5Build +"/lib"));
  gulp.src(devFolder+'/img/**')
  .pipe(gulp.dest(md5Build +"/img"));
  return gulp.src([md5Build + '/*.json', buildFolder + "/*.html"])
    .pipe(revCollector({
      replaceReved: true,
    }))
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true
      })
    )
    .pipe(gulp.dest(md5Build));
})
// 使用说明 
  /**
   * 先是 gulp  default ==> gulp combine ==> gulp md5 ==> gulp rev
   */