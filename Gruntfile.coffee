module.exports = (grunt) ->
  # TODO:
  # I should use bower for boostrap and angular, so I should need to use this:
  # grunt.loadNpmTasks('grunt-bower');
  # I may require copying to lib, in which case I'll need this:
  # grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-npm-install')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile_express: {
        files: {
          'src/authentication.js': 'src/lib/authentication.coffee',
          'src/logger.js': 'src/logger.coffee'
        }
      },
      compile_angular: {
        files: {
          'app/public/src/app.js': 'app/public/src/app.coffee'
        }
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n' 
      },
      dist: {
        files: { 'app/public/src/js/app.js': 'app/src/*.js' }
      }
    },
    watch: {
      files: ['<%= coffee.files %> '],
      tasks: ['coffee.compiledev']
    }
   })