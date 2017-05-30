module.exports = function(grunt) {

    //require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: { // Target options 
                style: 'nested',
                sourcemap: 'none'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '_production/sass/',
                    src: ['*.scss'],
                    dest: '_production/temp/css/',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                processors: [
                    //require('autoprefixer-core')({browsers: ['last 20 versions', 'ie 8', 'ie 9', 'ie 10']}),
                    require('autoprefixer')({ browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10'] }),
                ]
            },
            dist: {
                expand: true,
                cwd: '_production/temp/css/',
                src: ['*.css'],
                dest: '_production/temp/css/build/',
                ext: '.min.css'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'static/_files/css/style.css': ['_production/vendor/css/normalize.css', '_production/temp/css/build/*.css'] // can merge multiple css files. ex: ['foo.css', 'bar.css']
                }
            }
        },
        concat: {
            plugins: {
                options: {
                    separator: "\n", //add a new line after each file
                },
                src: [
                    //'_production/vendor/js/plugins/jquery.fileupload-validate.js', 
                    //'!js/lib/main.js' // this is how you'd exclude a file / files
                ],
                dest: '_production/build/plugins.js',
            },
            scripts: {
                options: {
                    separator: "\n", //add a new line after each file
                    //banner: "(function($){", //added before everything
                    //footer: "})(jQuery);" //added after everything
                },
                src: [
                    '_production/js/*.js', // then grab all other js files (will be concatanated at end of file, below plugins)
                    //'_production/js/modals/*.js',
                ],
                dest: '_production/build/scripts.js',
            },
            mergeall: {
                src: [
                    '_production/build/plugins.js',
                    '_production/build/scripts.js',
                ],
                dest: 'static/_files/js/scripts.js',
            }
        },
        uglify: {
            build: {
                src: 'static/_files/js/scripts.js', // now take concatanated javascript file...
                dest: 'static/_files/js/scripts.min.js' // ...and minify it
            },
        },
        modernizr: {
            dist: {
                devFile: '_production/vendor/js/modernizr-custom.js',
                //outputFile: 'js/build/custom-modernizr.js',
                dest: 'static/_files/js/vendor/custom-modernizr.js',
                files: {
                    src: [
                        'static/_files/js/scripts.min.js',
                        'static/_files/css/style.css',
                        //'_production/vendor/css/flexboxgrid.min.css'
                    ]
                },
                "crawl": true,
                "tests": [
                    "touchevents",
                    "cssanimations",
                    "flexbox",
                    "flexboxlegacy",
                    "cssremunit",
                    "csstransforms",
                    "csstransforms3d",
                    "preserve3d",
                    "cssvhunit",
                    "cssvwunit",
                    "sizes",
                    "srcset",
                    "svgclippaths",
                    "svgfilters",
                    "inlinesvg"
                ],
                classPrefix: "has-",
                "options": [
                    "html5shiv",
                    "setClasses"
                ],
                "uglify": true
            }
        },

        responsive_images: {
            cb: {
                options: {
                    newFilesOnly: true,
                    sizes: [{
                        name: 'thumb',
                        width: 250
                    }, {
                        name: '320',
                        width: 320
                    }, {
                        name: '480',
                        width: 480
                    }, {
                        name: '768',
                        width: 768
                    }, {
                        name: '1024',
                        width: 1024
                    }, {
                        name: '1280',
                        width: 1280
                    }, {
                        name: '1400',
                        width: 1400
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '_production/comics/',
                    src: ['**/*.{jpg,gif,png}'],
                    custom_dest: '_production/build/comics/{%= path %}/{%= name %}/'
                }]
            }
        },
        pngquant: { // Task 
            png: {
                options: {
                    quality: 60
                },
                files: [{
                    expand: true,
                    cwd: '_production/build/comics/',
                    src: ['**/*.png'],
                    //src: ['**.png'],
                    dest: 'static/_files/comics/',
                }]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    { removeXMLProcInst: false },
                    { removeViewBox: false },
                    { removeUselessStrokeAndFill: false }
                ]
            },
            dist: {
                expand: true,
                cwd: '_production/svgs',
                src: ['*.svg'],
                dest: '_production/svgs/compressed',
                ext: '.svg'
            }
        },
        
        svgstore: {
            options: {
                prefix: 'icon-', // This will prefix each <g> ID
            },
            default: {
                files: {
                    'static/_files/img/all.svg': ['_production/svgs/compressed/*.svg'],
                }
            }
            /*
            Need to manually update the following svgs in all.svg to add the 'preserveAspectRatio="none" declaration:
                - icon-bg__header
                - icon-button
                - icon-bg__comic
                - icon-tag

             */
        },
        grunticon: {
            svgicons: {
                files: [{
                    expand: true,
                    cwd: "_production/svgs/compressed",
                    src: ["*.svg"],
                    dest: "static/_files/img/"
                }],
                /*
                options: {
                    enhanceSVG: true
                }
                */
            }
        },
        shell: {
            server: {
                command: '.\\hugo server'
            },
            dev: {
                command: '.\\hugo --baseUrl=http://localhost:8080/master_chipmunkbay/dev --destination=dev' //--source=site --destination=../dev
            },
            build: {
                command: '.\\hugo -d public/'
            }
            /*
            deploy: {
                command: 'rsync -az --force --progress -e "ssh" build/ user@mysite.com:/path/to/webroot/'
            }
            */

        },

        open: {
            devserver: {
                path: 'http://localhost:8080/master_chipmunkbay/dev'
            },
            live: {
                path: 'http://kaigon.github.io/'
            }
        },
        copy: { // Task
            styles: {
                cwd: 'static/_files/css',
                src: ['**/*'],
                dest: 'dev/_files/css/',
                expand: true,
            },
            jquery: {
                cwd: 'static/_files/js',
                src: ['**/*'],
                dest: 'dev/_files/js/',
                expand: true,
            },
            imgs: {
                cwd: 'static/_files/img',
                src: ['**/*'],
                dest: 'dev/_files/img/',
                expand: true,
            }
        },

        /*
         shell: {
             hugo: {
                 command: function(target) {
                     if (target === 'dev') {
                         return '.\\hugo --baseUrl=localhost --source=site --destination=../dev'; // 
                     } else {
                         return '.\\hugo --source=site';
                     }
                 }
             }
         },

         connect: {
             dev: {
                 options: {
                     hostname: 'localhost',
                     port: '1212',
                     protocol: 'http',
                     base: 'site',
                     livereload: true
                 }
             }
         },
         */
        watch: {
            options: {
                livereload: true,
                debounceDelay: 250,
            },
            sasswatch: {
                files: ['_production/sass/*.scss'],
                tasks: ['cssStuff'],
            },
            grunticon: {
                files: ['_production/svgs/*.svg'],
                tasks: ['icons'],
                options: {
                    spawn: false,
                    livereload: true,
                },
            },
            site: {
                files: ['content/**/*', 'layouts/**/*', 'archetypes/**/*', 'config.toml', 'data/**/*'],
                tasks: ['shell:dev']
            },
            scripts: {
                files: ['_production/js/*.js'],
                tasks: ['jsStuff'],
            },
            html: {
                files: ['*.html'],
                options: {
                    livereload: true,
                }
            },
            sprite: {
                files: ['static/_files/img/all.svg'],
                tasks: ['shell:dev']
            }
        },
        clean: {
            build: {
                src: ['_production/temp/css/', '_production/svgs/compressed'] //
            },
            css: {
                src: ['_production/temp/css/']
            },
            svgs: {
                src: ['_production/svgs/compressed']
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            target: ['_production/js/*.js']
        }
    });

    // Load the plugins
    //require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-pngquant');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-dr-svg-sprites');
    grunt.loadNpmTasks('grunt-svg-sprite');


    // Default task(s).
    grunt.registerTask('default', ['sass', 'postcss', 'cssmin', 'concat', 'uglify', 'clean:build', 'jshint']); // order matters here!
    grunt.registerTask('icons', ['svgmin', 'svgstore', 'grunticon', 'clean:svgs', 'copy:imgs']);
    //grunt.registerTask('icons', ['svgmin', "dr-svg-sprites", 'grunticon', 'clean:svgs', 'copy:imgs']);
    //grunt.registerTask('icons', ['svgmin', 'svg_sprite', 'grunticon', 'clean:svgs', 'copy:imgs']);


    //grunt.registerTask('icons', ['grunticon']);
    grunt.registerTask('dist', ['modernizr']); // order matters here!
    grunt.registerTask('scss', ['sass', 'shell:dev']);
    //grunt.registerTask('hugo', ['connect:dev', 'shell:hugo:dev', 'watch']);
    grunt.registerTask('hugo', ['open:devserver', 'shell:dev', 'watch']);
    grunt.registerTask('build', ['shell:build']);
    grunt.registerTask('responsive', ['responsive_images', 'newer:pngquant:png']);
    //grunt.registerTask('responsive', ['responsive_images', 'pngquant:png']);
    grunt.registerTask('cssStuff', ['sass', 'postcss', 'cssmin', 'clean:build', 'copy:styles']);
    grunt.registerTask('jsStuff', ['concat', 'uglify', 'jshint', 'copy:jquery']);

    grunt.registerTask('resp', ['responsive_images']);
    grunt.registerTask('png', ['newer:pngquant:png']);

    /*
    grunt.registerTask 'hugo', (target) ->
    done = @async()
    args = ['--source=site', "--destination=../build/#{target}"]
    if target == 'dev'
        args.push '--baseUrl=http://127.0.0.1:8080'
        args.push '--buildDrafts=true'
        args.push '--buildFuture=true'
    hugo = require('child_process').spawn 'hugo', args, stdio: 'inherit'
    (hugo.on e, -> done(true)) for e in ['exit', 'error']
    */


};
