{BufferedProcess, CompositeDisposable} = require 'atom'
module.exports =
  config:
    executablePath:
      type: 'string'
      title: 'PHP Executable Path'
      default: ''
  activate: ->
    @parameters = new Array(4)
    @parameters[0] = "-l"
    @parameters[1] = "-n"
    @parameters[2] = "-d display_errors=On"
    @parameters[3] = "-d log_errors=Off"

    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe('linter-php.executablePath', (value) =>
      unless value
        value = "php" # Let os's $PATH handle the rest
      @command = value
    )

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    path = require 'path'
    provider =
      grammarScopes: ['source.php']
      scope: 'file'
      lintOnFly: false
      lint: (textEditor) =>
        return new Promise (resolve, reject) =>
          filePath = textEditor.getPath()
          parameters = @parameters.filter (item) -> item
          parameters.push(filePath)
          result = ""
          process = new BufferedProcess
            command: @command
            args: parameters
            stdout: (data) ->
              result += data
            exit: (code) ->
              return resolve [] unless code isnt 0
              resultLines = result.toLowerCase().split('\n')
              errorLineNumber = 0
              for line in resultLines
                if line.indexOf('parse error') >=0 and line.indexOf('on line') >= 0
                  words = line.split(' ')
                  errorLineNumber = words[words.length-1] - 1
              startPoint = [errorLineNumber, 0]
              endPoint = [errorLineNumber, 999]
              message = {type: 'Error', text: "Parsing error on line #{errorLineNumber}", range:[startPoint, endPoint]}
              resolve [message]

          process.onWillThrowError ({error,handle}) ->
            atom.notifications.addError "Failed to run #{@executablePath}",
              detail: "#{error.message}"
              dismissable: true
            handle()
            resolve []
