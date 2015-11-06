{CompositeDisposable} = require 'atom'
helpers = require('atom-linter')

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: 'php' # Let OS's $PATH handle the rest

  _testBin: ->
    title = 'linter-php: Unable to determine PHP version'
    message = 'Unable to determine the version of "' + @executablePath +
      '", please verify that this is the right path to PHP.'
    try
      helpers.exec(@executablePath, ['-v']).then (output) =>
        regex = /PHP (\d+)\.(\d+)\.(\d+)/g
        if not regex.exec(output)
          atom.notifications.addError(title, {detail: message})
          @executablePath = ''
      .catch (e) ->
        console.log e
        atom.notifications.addError(title, {detail: message})

  activate: ->
    require('atom-package-deps').install('linter-php')
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-php.executablePath',
      (executablePath) =>
        @executablePath = executablePath
        @_testBin()

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    provider =
      name: 'PHP'
      grammarScopes: ['text.html.php', 'source.php']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) =>
        filePath = textEditor.getPath()
        command = @executablePath
        return Promise.resolve([]) unless command?
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
          messages
