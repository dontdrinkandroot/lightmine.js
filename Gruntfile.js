module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'js/*.js'
      ],
      options: {
        globals: {
          angular: true
        },
        regexp: true
      }
    },
    server: {
      port: 8000,
      base: '.'
    }
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
};
