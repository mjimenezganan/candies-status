/*
 * candies-status
 * https://github.com/mjimenezganan/candies-status
 *
 * Copyright (c) 2016 Universidad Politecnica de Madrid
 * Licensed under the GPL license.
 */

var ConfigParser = require('wirecloud-config-parser');
var parser = new ConfigParser('src/config.xml');

module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        isDev: grunt.option('dev') ? '-dev' : '',
        metadata: parser.getData(),

        bower: {
            install: {
                options: {
                    layout: function (type, component, source) {
                        return type;
                    },
                    targetDir: './build/lib/lib'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                files: {
                    src: ['src/js/**/*.js']
                }
            },
            grunt: {
                options: {
                    jshintrc: '.jshintrc-node'
                },
                files: {
                    src: ['Gruntfile.js']
                }
            },
            test: {
                options: {
                    jshintrc: '.jshintrc-jasmine'
                },
                files: {
                    src: ['src/test/**/*.js', '!src/test/fixtures/']
                }
            }
        },

        jscs: {
            widget: {
                src: 'src/js/**/*.js',
                options: {
                    config: ".jscsrc"
                }
            },
            grunt: {
                src: 'Gruntfile.js',
                options: {
                    config: ".jscsrc"
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/js', src: '*', dest: 'build/src/js'}
                ]
            }
        },

        strip_code: {
            multiple_files: {
                src: ['build/src/js/**/*.js']
            }
        },

        compress: {
            widget: {
                options: {
                    mode: 'zip',
                    archive: 'dist/<%= metadata.vendor %>_<%= metadata.name %>_<%= metadata.version %><%= isDev %>.wgt'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'DESCRIPTION.md',
                            'css/**/*',
                            'doc/**/*',
                            'images/**/*',
                            'index.html',
                            'config.xml'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/lib',
                        src: [
                            'lib/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/src',
                        src: [
                            'js/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'LICENSE'
                        ]
                    }
                ]
            }
        },

        clean: {
            build: {
                src: ['build', 'bower_components']
            },
            temp: {
                src: ['build/src']
            }
        },

        jasmine: {
            test: {
                src: ['src/js/*.js', '!src/js/main.js'],
                options: {
                    specs: 'src/test/js/*Spec.js',
                    helpers: ['src/test/helpers/*.js'],
                    vendor: [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
                        'node_modules/mock-applicationmashup/lib/vendor/mockMashupPlatform.js',
                        'src/test/vendor/*.js'
                    ]
                }
            },
            coverage: {
                src: '<%= jasmine.test.src %>',
                options: {
                    helpers: '<%= jasmine.test.options.helpers %>',
                    specs: '<%= jasmine.test.options.specs %>',
                    vendor: '<%= jasmine.test.options.vendor %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'build/coverage/json/coverage.json',
                        report: [
                            {type: 'html', options: {dir: 'build/coverage/html'}},
                            {type: 'cobertura', options: {dir: 'build/coverage/xml'}},
                            {type: 'text-summary'}
                        ]
                    }
                }
            }
        },

        wirecloud: {
            options: {
                overwrite: false
            },
            publish: {
                file: 'dist/<%= metadata.vendor %>_<%= metadata.name %>_<%= metadata.version %><%= isDev %>.wgt'
            }
        }
    });

    grunt.loadNpmTasks('grunt-wirecloud');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine'); // when test?
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('test', [
        'bower:install',
        'jshint',
        'jshint:grunt',
        'jscs',
        'jasmine:coverage'
    ]);

    grunt.registerTask('build', [
        'clean:temp',
        'copy:main',
        'strip_code',
        'compress:widget'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    grunt.registerTask('publish', [
        'default',
        'wirecloud'
    ]);

};
