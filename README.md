# linter-php
[![Build Status](https://travis-ci.org/AtomLinter/linter-php.svg)](https://travis-ci.org/AtomLinter/linter-php)
[![Dependency Status](https://david-dm.org/AtomLinter/linter-php.svg)](https://david-dm.org/AtomLinter/linter-php)
[![apm](https://img.shields.io/apm/v/linter-php.svg)](https://atom.io/packages/linter-php)
[![apm](https://img.shields.io/apm/dm/linter-php.svg)](https://atom.io/packages/linter-php)

This package will lint PHP files and embedded PHP within HTML files in Atom through
[php -l](http://www.php.net/manual/en/features.commandline.options.php).

## Installation
You will need to have [php](http://php.net) installed on your system before trying
to use this package, please follow the instructions on their site to accomplish this.

After installing `php` on your system you can install this package by either searching
for it within Atom's package installation section of the settings or by running the
following command in a terminal:
```ShellSession
apm install linter-php
```

_As this package only provides a service, you will need something to run it. As
such, the [Linter](https://atom.io/packages/linter) package will be installed
automatically for you if it isn't already installed. This will provide the user interface and run the linter for you._

### Setup
Once the package is installed you may need to specify the path to the `php`
executable if Atom is not able to find it automatically. You can do this from
Atom's settings menu or by editing your `~/.atom/config.cson` file (choose Open Your Config in Atom's menu). If editing the file by hand you should modify/create a
section like the following:
```cson
'linter-php':
  # php path. run 'which php' to find the path
  'executablePath': /usr/bin/php
```

## Maintainers

The following people have stepped up to take responsibility for this repository and should be consulted on any releases or major changes.

* [steelbrain](http://github.com/steelbrain) - Release Maintainer
* [Arcanemagus](http://github.com/Arcanemagus)
