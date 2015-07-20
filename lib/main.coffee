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
        return helpers.exec(command, parameters, {stdin: text}).then (output) =>
          messages = helpers.parse(output, @regex, {filePath: filePath})
          messages.forEach (message) -> message.type = 'Error' unless message.type
          return messages
