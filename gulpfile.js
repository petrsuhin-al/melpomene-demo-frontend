const gulp = require('gulp'),
    watch = require('gulp-watch'),      // наблюдения за изменениями файлов          /////устаноывить еще надо все
    autoprefixer = require('gulp-autoprefixer'), // автоматически добавляет вендорные префиксы к css свойствам
    uglify = require('gulp-uglify-es').default, // для сжатия js
    sass = require('gulp-sass'),     // для компиляции scss кода
    sourceMaps = require('gulp-sourcemaps'),   // для генерации css sourcemaps
    rigger = require('gulp-rigger'),       // для импорта одного файла в другой
    cssmin = require('gulp-minify-css'), // для скажития css
    rimraf = require('rimraf'), //rm -rf для ноды
    browserSync = require('browser-sync'), // нужен чтобы развернуть локальный dev сервер
    imagemin = require('gulp-imagemin'), // для сжатия картинок
    pngquant = require('imagemin-pngquant'), // дополнение к предыдущему, только для png
    reload = browserSync.reload;

let path = {
    build: { // Сюда складываем готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {  // Пути откуда брать исходники
        html: 'src/*.html',  // Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/App.js', // В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*'  // Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    },
    watch: { // За изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*'
    },
    clean: './build'
};

let config = { // переменная с настройками нашего dev сервера
    server: {
        baseDir: "./build/"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "stuart"
};

gulp.task('html:build', () => { // таска для сборки html
    gulp.src(path.src.html) // Выберем файлы по нужному пути
        .pipe(rigger()) // Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) // Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', () => { // таска сборки js
    gulp.src(path.src.js) //Найдем наш App файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourceMaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js - тут ошибка, пока не разобрался с ней
        .pipe(sourceMaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', () => { //таска сборки scss
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourceMaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(autoprefixer({
            browsers: ['last 16 versions'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', () => { //таска на сборку пикч
    gulp.src(path.src.img) //Выберем наши пикчи
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build', [ //таска на билд всего
    'html:build',
    'js:build',
    'style:build',
    'image:build'
]);

gulp.task('watch', () => {  // трекаем изменения
    watch([path.watch.html], (event, cb) => gulp.start('html:build'));
    watch([path.watch.style], (event, cb) => gulp.start('style:build'));
    watch([path.watch.js], (event, cb) => gulp.start('js:build'));
    watch([path.watch.img], (event, cb) => gulp.start('image:build'));
});

gulp.task('server', () => browserSync(config)); //таск на создание сервера
gulp.task('clean', cb => rimraf(path.clean, cb)); //таска для периодической подчистки папки билд

gulp.task('default', ['build', 'server', 'watch']);