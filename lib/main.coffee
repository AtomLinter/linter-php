{CompositeDisposable} = require 'atom'
helpers = require('atom-linter')
path = require('path')

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: 'php' # Let OS's $PATH handle the rest
    errorReporting:
      type: 'boolean'
      title: 'Error Reporting Level Override'
      description: 'Force overriding the `error_reporting` setting from php.ini ' +
        'to `E_ALL` if php.ini is setup to ignore most errors.'
      default: true

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
    require('atom-package-deps').install()
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-php.executablePath',
      (executablePath) =>
        @executablePath = executablePath
        @_testBin()
    @subscriptions.add atom.config.observe 'linter-php.errorReporting',
      (value) =>
        @errorReporting = value

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
        parameters.push('--define', 'display_errors=On')
        parameters.push('--define', 'log_errors=Off')
        parameters.push('--define', 'error_reporting=E_ALL') if @errorReporting
        text = textEditor.getText()
        [projectPath] = atom.project.relativizePath(filePath)
        cwd = if projectPath? then projectPath else path.dirname(filePath)
        return helpers.exec(command, parameters, {stdin: text, cwd, ignoreExitCode: true}).then (output) ->
          regex = /^(?:Parse|Fatal) error:\s+(.+) in .+?(?:on line |:)(\d+)/gm
          messages = []
          while((match = regex.exec(output)) isnt null)
            messages.push
              type: "Error"
              filePath: filePath
              range: helpers.rangeFromLineNumber(textEditor, match[2] - 1)
              text: match[1]
          messages
