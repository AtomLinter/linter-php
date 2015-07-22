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

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. Welcome to the club!

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass [CoffeeLint](http://www.coffeelint.org/) with the provided `coffeelint.json`
- Vertical whitespace helps readability, don’t be afraid to use it.

**Thank you for helping out!**
