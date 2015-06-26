;(function () {
    'use strict';

    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt, {
            pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
        });
        require('time-grunt')(grunt);

        // Project configuration.
        grunt.initConfig({

            // Metadata.
            pkg: grunt.file.readJSON('package.json'),
            alvchng: grunt.file.readJSON('.alvchngrc'),
             // Task configurations.
            clean: {
                all: ['dist', 'build'],
                dist: ['dist'],
                build: ['build']
            },
            uglify: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                example: {
                  options: {
                    'mangle': false
                  },
                  files: {
                    'src/example/lib.min.js': [
                      'lib/jquery/dist/jquery.js',
                      'lib/bootstrap/dist/js/bootstrap.js',
                      'lib/angular/angular.js',
                      'lib/angular-cookies/angular-cookies.js',
                      'lib/angular-route/angular-route.js',
                      'lib/angular-sanitize/angular-sanitize.js',
                      'lib/angular-resource/angular-resource.js',
                      'lib/angular-scroll/angular-scroll.js',
                      'lib/ng-lodash/build/ng-lodash.js',
                      'lib/alv-ch-ng.core/dist/alv-ch-ng.core.js',
                      'lib/alv-ch-ng.core/dist/alv-ch-ng.core.templates.js'
                    ]
                  }
                }
            },
            less: {
                prod: {
                    options: {
                        paths: ['src/less'],
                        compress: false,
                        cleancss: true,
                        ieCompat: true
                    },
                    files: {
                        'dist/css/alv-ch-ng.bootstrap.css': ['src/less/style.less'],
                        'dist/css/frutiger.css': ['src/less/typo/frutiger.less'],
                        'dist/css/admin-symbols.css': ['src/less/typo/admin-symbols.less']
                    }
                }
            },
            copy: {
                prod: {
                    files: [
                        {
                            expand: true,
                            cwd: 'src/less/',
                            src: '**/*.less',
                            dest: 'dist/less'
                        },
                        {
                            expand: true,
                            cwd: 'lib/bootstrap/fonts',
                            src: '*',
                            dest: 'dist/fonts'
                        }
                    ]
                },
                example: {
                    files: [
                        {
                            expand: true,
                            cwd: 'lib/bootstrap/',
                            src: 'fonts/*',
                            dest: 'src/example/fonts'
                        },
                        {
                            expand: true,
                            cwd: 'lib/bootstrap/dist/css/',
                            src: ['bootstrap.css','bootstrap.css.map'],
                            dest: 'src/example'
                        }
                    ]
                }
            },
            cssbeautifier: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                prod: {
                    files: {
                        'dist/css/alv-ch-ng.bootstrap.css': ['dist/css/alv-ch-ng.bootstrap.css'],
                        'dist/css/frutiger.css': ['dist/css/frutiger.css'],
                        'dist/css/admin-symbols.css': ['dist/css/admin-symbols.css']
                    }
                }
            },
            cssmin: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                prod: {
                    files: {
                        'dist/css/alv-ch-ng.bootstrap.min.css': ['dist/css/alv-ch-ng.bootstrap.css'],
                        'dist/css/frutiger.min.css': ['dist/css/frutiger.css'],
                        'dist/css/admin-symbols.min.css': ['dist/css/admin-symbols.css']
                    }
                }
            },
            compress: {
                main: {
                    options: {
                        mode: 'gzip'
                    },
                    files: [
                        { src: ['dist/css/alv-ch-ng.bootstrap.min.css'], dest: 'dist/css/alv-ch-ng.bootstrap.min.css' },
                        { src: ['dist/css/frutiger.min.css'], dest: 'dist/css/frutiger.min.css' },
                        { src: ['dist/css/admin-symbols.min.css'], dest: 'dist/css/admin-symbols.min.css' }
                    ]
                }
            },
            push: {
                options: {
                    files: ['package.json'],
                    updateConfigs: [],
                    releaseBranch: 'master',
                    add: true,
                    addFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '.' for all files except ignored files in .gitignore
                    commit: true,
                    commitMessage: 'Release v%VERSION%',
                    commitFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '-a' for all files
                    createTag: true,
                    tagName: 'v%VERSION%',
                    tagMessage: 'Version %VERSION%',
                    push: false,
                    npm: false,
                    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
                }
            },
            lesslint: {
                options: {
                    csslint: {
                        csslintrc: '.csslintrc'
                    },
                    imports: ['src/less/**/*.less']
                },
                src: ['src/less/style.less']
            },
            watch: {
              less: {
                files: 'src/less/**/*.less',
                  tasks: ['less:prod']
              }
            },
            browserSync: {
              dev: {
                bsFiles: {
                  src : 'src/**/*'
                },
                options: {
                  server: {
                    baseDir: './src',
                    directory: false
                  },
                  watchTask: true
                }
              }
            }
        });

        // Tests
        grunt.registerTask('lesslint-test', ['lesslint']);
        
        grunt.registerTask('all-test', ['lesslint-test']);
        // CI
        grunt.registerTask('travis', ['clean:build']);

        // DEV
        grunt.registerTask('build', ['less:prod','all-test','copy:example','uglify:example']);
        grunt.registerTask('dev', ['build', 'browserSync:dev', 'watch']);

        // Default task.
        grunt.registerTask('default', ['clean:all','all-test','copy:prod','less:prod','cssbeautifier','cssmin']);
    };


})();
