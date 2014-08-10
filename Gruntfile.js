/*
 * lab-kit-js build file.
 *
 * Copyright (c) 2014 George Norman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *   http://www.apache.org/licenses/LICENSE-2.0
 */
module.exports = function(grunt) {
  'use strict';

  var bannerTemplate = '/*!\n' +
        '  ~ labKit-<%= pkg.version %>.${EXT}\n' +
        '  ~ Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
        '  ~ Licensed under the <%= pkg.license.type %>: <%= pkg.license.url %>\n' +
        '*/\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // https://github.com/gruntjs/grunt-contrib-clean
    clean: ["target", 'releases/<%= pkg.version %>'],

    // https://github.com/gruntjs/grunt-contrib-concat/blob/master/docs/concat-examples.md
    concat: {
      tzCommons: {
        files: {
          'target/js/tzCommons-fragment.js': '<%= pkg.labKitFiles.tzCommonsJs %>',
          'target/css/tzCommons-fragment.css': '<%= pkg.labKitFiles.tzCommonsCss %>'
        }
      },
      baseKit: {
        files: {
          'target/js/baseKit-fragment.js': '<%= pkg.labKitFiles.baseKitJs %>',
          'target/css/baseKit-fragment.css': '<%= pkg.labKitFiles.baseKitCss %>'
        }
      },
      labKitTags: {
        files: {
          'target/js/labKitTags-fragment.js': '<%= pkg.labKitFiles.labKitTagsJs %>',
          'target/css/labKitTags-fragment.css': '<%= pkg.labKitFiles.labKitTagsCss %>'
        }
      },
      labKitCssFinal: {
        files: {
          'target/css/labKit-<%= pkg.version %>.css': ['target/css/tzCommons-fragment.css', 'target/css/baseKit-fragment.css', 'target/css/labKitTags-fragment.css']
        },
        options:{
          banner: bannerTemplate.replace(/\${EXT}/g, "css")
        }
      },
      labKitJsFinal: {
        files: {
          'target/js/labKit-<%= pkg.version %>.js': ['target/js/tzCommons-fragment.js', 'target/js/baseKit-fragment.js', 'target/js/labKitTags-fragment.js']
        },
        options:{
          banner: bannerTemplate.replace(/\${EXT}/g, "js")
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      labKit: {
        files: {
          'target/js/labKit-<%= pkg.version %>-min.js': ['target/js/labKit-<%= pkg.version %>.js']
        }
      },
      options: {
        preserveComments: 'some',
        sourceMap: true
      }
    },

    // https://github.com/nDmitry/grunt-autoprefixer
    autoprefixer: {
      labKit: {
        src: 'target/css/labKit-<%= pkg.version %>.css',
        dest: 'target/css/labKit-<%= pkg.version %>.css'
      }
    },

    // https://github.com/gruntjs/grunt-contrib-cssmin
    cssmin: {
      labKit: {
        files: {
          'target/css/labKit-<%= pkg.version %>-min.css': ['target/css/labKit-<%= pkg.version %>.css']
        }
      }
    },

    // https://www.npmjs.org/package/grunt-contrib-copy
    copy: {
      // NOTE: release file names are all lowercase
      release: {
        files: [
          {expand: true, flatten: true, src: ['target/js/labkit-<%= pkg.version %>.js', 'target/js/labkit-<%= pkg.version %>-min.js'], dest: 'releases/<%= pkg.version %>/js/'},
          {expand: true, flatten: true, src: ['target/css/labkit-<%= pkg.version %>.css', 'target/css/labkit-<%= pkg.version %>-min.css'], dest: 'releases/<%= pkg.version %>/css/'}
        ]
      }
    },

    jsdoc : {
      dist : {
        src: ['src/js/*.js', 'src/js/*/*.js', 'test/*.js', 'src/js/README.md'],
        options: {
          destination: 'releases/<%= pkg.version %>/jsdoc'
        }
      }
    }
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-jsdoc');

  // register custom sub-tasks
  grunt.registerTask('assemble-fragments', ['concat:tzCommons', 'concat:baseKit', 'concat:labKitTags']);
  grunt.registerTask('assemble-final', ['concat:labKitCssFinal', 'concat:labKitJsFinal']);

  // register main custom task(s)
  grunt.registerTask('build', ['assemble-fragments', 'assemble-final', 'uglify:labKit', 'autoprefixer:labKit', 'cssmin:labKit', 'copy:release']);
  grunt.registerTask('docs', ['jsdoc']);

  grunt.registerTask('release', ['clean', 'build', 'docs']);

  // register default task
  grunt.registerTask('default', ['release']);
};
