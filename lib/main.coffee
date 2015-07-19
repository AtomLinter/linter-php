{BufferedProcess, CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: 'php' # Let OS's $PATH handle the rest

  activate: ->
    @parameters = []
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
          data = []
          filePath = textEditor.getPath()
          command = @executablePath
          parameters = @parameters.filter (item) -> item
          parameters.push('--syntax-check')
          parameters.push('--no-php-ini')
          parameters.push('--define display_errors=On')
          parameters.push('--define log_errors=Off')
          parameters.push('--file "' + filePath + '"')
          command += ' ' + parameters.join(' ')
          process = child_process.exec(command)
          process.stdout.on 'data', (d) -> data.push d.toString()
          process.on 'close', =>
            messages = helpers.parse(data.join(''), @regex,
                                     {filePath: filePath})
            resolve messages