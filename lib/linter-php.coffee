linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterPhp extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['text.html.php', 'source.php']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'php -l -n -d display_errors=On -d log_errors=Off'

  executablePath: null

  linterName: 'php'

  # A regex pattern used to extract information from the executable's output.
  regex: '(Parse|Fatal) (?<error>error):(\\s*(?<type>parse|syntax) error,?)?\\s*' +
         '(?<message>(unexpected \'(?<near>[^\']+)\')?.*) ' +
         'in .*? on line (?<line>\\d+)'

  constructor: (editor) ->
    super(editor)

    atom.config.observe 'linter-php.phpExecutablePath', =>
      @executablePath = atom.config.get 'linter-php.phpExecutablePath'

  destroy: ->
    atom.config.unobserve 'linter-php.phpExecutablePath'

  createMessage: (match) ->
    # message might be empty, we have to supply a value
    if match and match.type == 'parse' and not match.message
      message = 'parse error'
    super(match)

module.exports = LinterPhp
