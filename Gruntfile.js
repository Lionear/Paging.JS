modules.export = (grunt) => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: `/**\n
                 * paging.js <%= pkg.version %>\n
                 * <%= pkg.description %>\n
                 * <%= pkg.repository.url %>\n
                 * \n
                 * Copyright 2022, <%= pkg.author %>\n
                 * Released under the <%= pkg.license %> license.\n
                 */\n`
            },
            main: {
                files: [
                    {
                        src: ['src/paging.js'],
                        dest: 'dist/paging.min.js'
                    }
                ]
            }
        },

        copy: {
            main: {
                files: [
                    {
                        src: 'src/paging.js',
                        dest: 'dist/paging.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'uglify',
        'copy'
    ]);
};