{CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: 'php' # Let OS's $PATH handle the rest

  activate: ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-php.executablePath',
      (executablePath) =>
        @executablePath = executablePath

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: ['text.html.php', 'source.php']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) =>
        filePath = textEditor.getPath()
        command = @executablePath
        parameters = []
        parameters.push('--syntax-check')
        parameters.push('--no-php-ini')
        parameters.push('--define', 'display_errors=On')
        parameters.push('--define', 'log_errors=Off')
        text = textEditor.getText()
        return helpers.exec(command, parameters, {stdin: text}).then (output) ->
          regex = /error:\s+(.*?) on line (\d+)/g
          messages = []
          while((match = regex.exec(output)) isnt null)
            messages.push
              type: "Error"
              filePath: filePath
              range: helpers.rangeFromLineNumber(textEditor, match[2] - 1)
              text: match[1]
          return messages
