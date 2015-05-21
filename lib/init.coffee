module.exports =
  config:
    phpExecutablePath:
      type: 'string'
      default: ''
      title: 'PHP Executable Path'

  activate: ->
    console.log 'activate linter-php'
