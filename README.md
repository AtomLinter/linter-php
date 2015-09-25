# linter-php
=========================

This package will lint PHP files and embedded PHP within HTML files in Atom through
[php -l](http://www.php.net/manual/en/features.commandline.options.php).

## Installation
As this package only provides a service, you will need something to run it. As
such, the Linter package will be installed for you if it isn't already installed.
This provides the interface and runs the linter for you.

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

## Maintainers

The following people have stepped up to take responsibility for this repository and should be consulted on any releases or major changes.

* [steelbrain](http://github.com/steelbrain) - Release Maintainer
* [Arcanemagus](http://github.com/Arcanemagus)
