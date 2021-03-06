var path = require("path");
var gulp = require("gulp");
var ts = require("gulp-typescript");
var jsonEditor = require("gulp-json-editor");
var localPackageDir = "node_modules/tns-core-modules"

var tsSrc = [
    "bin/**/*.ts",
    "lib/**/*.ts",
    "tests/**/*.ts",
    "typings/**/*.ts",
    "customtypings/**/*.ts",
    "!tests/resources/**/*.*"
];
var outDir = "./dist";

gulp.task("compile", function() {
    var tsResult = gulp.src(tsSrc).pipe(
            ts({
                noEmitOnError: true,
                noImplicitAny: true,
                outDir: outDir,
                removeComments: true,
                noLib: false,
                target: "ES5",
                module: "commonjs",
                typescript: require("typescript"),
                outDir: outDir
            }));
    return tsResult.js.pipe(gulp.dest(outDir));
});

gulp.task("copy-package-json", function() {
    gulp.src(path.join(localPackageDir, "package.json"))
    // Perform minification tasks, etc here
    .pipe(gulp.dest(outDir + "/lib/"))
    .pipe(gulp.dest(outDir + "/tests/"));
});

gulp.task("update-target-package-json", function() {
    var sourcePackageJson = require("./" + path.join(localPackageDir, "package.json"));

    targetPackageJsonPath = path.join("NpmPackage", "package.json");
    gulp.src(targetPackageJsonPath)
        .pipe(jsonEditor(function(json) {
            json.version = sourcePackageJson.version;
            json.dependencies["tns-core-modules"] = sourcePackageJson.version;
            return json;
        }))
    .pipe(gulp.dest("./NpmPackage"))
});

gulp.task("run-regression-tests", function() {
    var exec = require("gulp-exec");

    var options = {
        continueOnError: false,
        pipeStdout: false
    };
    return gulp.src("regression-xmls/**/*.xml")
        .pipe(exec("xmllint --schema tns.xsd <%= file.path %>", options));
});

gulp.task("default", ["compile", "copy-package-json"]);
