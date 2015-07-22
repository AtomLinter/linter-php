# linter-php
=========================

This package will lint your `.php` opened filed in Atom through [php -l](http://www.php.net/manual/en/features.commandline.options.php).

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

* Install [php](http://php.net).
* `$ apm install linter-php`

## Settings
You can configure linter-php by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```cson
'linter-php':
  # php path. run 'which php' to find the path
  'executablePath': null
```

## Other linters
For a full listing of other available linters please check [here](http://atomlinter.github.io/).
