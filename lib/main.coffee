{CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: 'php' # Let OS's $PATH handle the rest

  activate: ->
    @regex = '(Parse|Fatal) ' +
            '(?<error>error):(\\s*(?<type>parse|syntax) error,?)?\\s*' +
            '(?<message>(unexpected \'(?<near>[^\']+)\')?.*) ' +
            'in .*? on line (?<line>\\d+)'
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-php.executablePath',
      (executablePath) =>
        @executablePath = executablePath

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    path = require 'path'
    helpers = require('atom-linter')
    child_process = require 'child_process'
    provider =
      grammarScopes: ['text.html.php', 'source.php']
      scope: 'file'
      lintOnFly: false
      lint: (textEditor) =>
        return new Promise (resolve, reject) =>
          filePath = textEditor.getPath()
          command = @executablePath
          parameters = []
          parameters.push('--syntax-check')
          parameters.push('--no-php-ini')
          parameters.push('--define', 'display_errors=On')
          parameters.push('--define', 'log_errors=Off')
          parameters.push('--file', filePath)
          helpers.exec(command, parameters).then (output) =>
            messages = helpers.parse(output, @regex, {filePath: filePath})
            console.log(messages)
            resolve messages