module.exports =
  config:
    phpExecutablePath:
      type: 'string'
      default: ''

  activate: ->
    console.log 'activate linter-php'
