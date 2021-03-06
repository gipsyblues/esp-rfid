var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var flatmap = require('gulp-flatmap');
var path = require('path');
var htmlmin = require('gulp-htmlmin');

gulp.task("indexgz", ["indexprep"], function() {

    var source = "../../src/websrc/gzipped/" + "index.html.gz";
    var destination = "../../src/" + "index.html.gz.h";
 
    var wstream = fs.createWriteStream(destination);
    wstream.on('error', function (err) {
        console.log(err);
    });
 
    var data = fs.readFileSync(source);
 
    wstream.write('#define index_html_gz_len ' + data.length + '\n');
    wstream.write('const uint8_t index_html_gz[] PROGMEM = {')
 
    for (i=0; i<data.length; i++) {
        if (i % 1000 == 0) wstream.write("\n");
        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
        if (i<data.length-1) wstream.write(',');
    }
 
    wstream.write('\n};')
    wstream.end();
	
});

gulp.task('indexprep', function() {
    return gulp.src('../../src/websrc/index.html')
	    .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('../../src/websrc/gzipped/'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('../../src/websrc/gzipped/'));
});

gulp.task("scripts", ["scripts-concat"], function() {

    var source = "../../src/websrc/gzipped/js/" + "required.js.gz";
    var destination = "../../src/" + "required.js.gz.h";
 
    var wstream = fs.createWriteStream(destination);
    wstream.on('error', function (err) {
        console.log(err);
    });
 
    var data = fs.readFileSync(source);
 
    wstream.write('#define required_js_gz_len ' + data.length + '\n');
    wstream.write('const uint8_t required_js_gz[] PROGMEM = {')
 
    for (i=0; i<data.length; i++) {
        if (i % 1000 == 0) wstream.write("\n");
        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
        if (i<data.length-1) wstream.write(',');
    }
 
    wstream.write('\n};')
    wstream.end();
	
});

gulp.task('scripts-concat', function() {
    return gulp.src(['../../src/websrc/js/jquery-1.12.4.min.js', '../../src/websrc/js/bootstrap-3.3.7.min.js', '../../src/websrc/js/footable-3.1.6.min.js', '../../src/websrc/js/nprogress-0.2.0.js', '../../src/websrc/js/sidebar.min.js'])
        .pipe(concat({
            path: 'required.js',
            stat: {
                mode: 0666
            }
        }))
        .pipe(gulp.dest('../../src/websrc/js/'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('../../src/websrc/gzipped/js/'));
});

gulp.task('styles-concat', function() {
    return gulp.src(['../../src/websrc/css/bootstrap-3.3.7.min.css', '../../src/websrc/css/footable.bootstrap-3.1.6.min.css', '../../src/websrc/css/nprogress-0.2.0.css', '../../src/websrc/css/sidebar.css', '../../src/websrc/css/sidebarcollapse.css'])
        .pipe(concat({
            path: 'required.css',
            stat: {
                mode: 0666
            }
        }))
        .pipe(gulp.dest('../../src/websrc/css/'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('../../src/websrc/gzipped/css/'));
});



gulp.task("styles", ["styles-concat"], function() {

    var source = "../../src/websrc/gzipped/css/" + "required.css.gz";
    var destination = "../../src/" + "required.css.gz.h";
 
    var wstream = fs.createWriteStream(destination);
    wstream.on('error', function (err) {
        console.log(err);
    });
 
    var data = fs.readFileSync(source);
 
    wstream.write('#define required_css_gz_len ' + data.length + '\n');
    wstream.write('const uint8_t required_css_gz[] PROGMEM = {')
 
    for (i=0; i<data.length; i++) {
        if (i % 1000 == 0) wstream.write("\n");
        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
        if (i<data.length-1) wstream.write(',');
    }
 
    wstream.write('\n};')
    wstream.end();
	
});


gulp.task("fontgz", function() {
	return gulp.src("../../src/websrc/fonts/*.*")
        .pipe(gzip({
            append: true
        }))
    .pipe(gulp.dest('../../src/websrc/gzipped/fonts/'));
});

gulp.task("fonts", ["fontgz"], function() {
    return gulp.src("../../src/websrc/gzipped/fonts/*.*")
        .pipe(flatmap(function(stream, file) {
			var filename = path.basename(file.path);
            var wstream = fs.createWriteStream("../../src/" + filename + ".h");
            wstream.on("error", function(err) {
                gutil.log(err);
            });
			var data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }

            wstream.write("\n};")
            wstream.end();

            return stream;
        }));
});

gulp.task('default', ['scripts', 'styles', "fonts", "indexgz"]);