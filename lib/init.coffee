module.exports =
  config:
    phpExecutablePath:
      type: 'string'
      default: null

  activate: ->
    console.log 'activate linter-php'
