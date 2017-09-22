# Changelog

## v1.5.1

*   Guard against invalid `TextEditor`s ([#271][])

[#271]: https://github.com/AtomLinter/linter-php/pull/271

## v1.5.0

*   Update dependencies ([#266][])
*   Detect php deprecated language syntax ([#268][])

[#266]: https://github.com/AtomLinter/linter-php/pull/266
[#268]: https://github.com/AtomLinter/linter-php/pull/268

## v1.4.0

*   Update dependencies ([#245][], [#255][])
*   Defer loading of dependencies ([#263][])
*   Asyncify specs and utilize activationHooks ([#264][])
*   Add setting to ignore php.ini ([#265][])

[#245]: https://github.com/AtomLinter/linter-php/pull/245
[#255]: https://github.com/AtomLinter/linter-php/pull/255
[#263]: https://github.com/AtomLinter/linter-php/pull/263
[#264]: https://github.com/AtomLinter/linter-php/pull/264
[#265]: https://github.com/AtomLinter/linter-php/pull/265

## v1.3.2

*   Handle unsaved files ([#242][])
*   Remove PHP version check ([#243][])
*   Clarify settings page scopes ([#229][])
*   Update dependencies ([#226][], [#236][])
*   Update and fix CI ([#230][], [#241][])

[#226]: https://github.com/AtomLinter/linter-php/pull/226
[#229]: https://github.com/AtomLinter/linter-php/pull/229
[#230]: https://github.com/AtomLinter/linter-php/pull/230
[#236]: https://github.com/AtomLinter/linter-php/pull/236
[#241]: https://github.com/AtomLinter/linter-php/pull/241
[#242]: https://github.com/AtomLinter/linter-php/pull/242
[#243]: https://github.com/AtomLinter/linter-php/pull/243

## v1.3.1

*   Fix executablePath reference in testBin ([#215](https://github.com/AtomLinter/linter-php/pull/215))

## v1.3.0

*   Run from the directory of the file ([#172](https://github.com/AtomLinter/linter-php/pull/172))
*   Allow overriding `error_reporting` from `php.ini` ([#181](https://github.com/AtomLinter/linter-php/pull/181))
*   Add exception handling ([#197](https://github.com/AtomLinter/linter-php/pull/197))
*   Rewrite in ES2017 ([#214](https://github.com/AtomLinter/linter-php/pull/214))
*   Many dependency updates

## 1.2.0

*   Handle fatal errors ([#141](https://github.com/AtomLinter/linter-php/pull/141))

## v1.1.8

*   Update dependencies

## v1.1.7

*   Remove usage of `activationHooks`
*   Fix the regex to not include the filename in the message

## v1.1.6

*   Bump to include a fix in `atom-linter`

## v1.1.5

*   Bump to include a fix in `atom-linter`

## v1.1.4

*   Bump to include latest `package-deps`

## v1.1.3

*   Stop ignoring `php.ini`

## v1.1.2

*   Update package dependencies to clear an Atom deprecation issue

## v1.1.1

*   Only activate the package when a PHP file has been opened

## v1.1.0

*   Verify the configured `php` works properly on activate

## v1.0.4 - v1.0.5

*   Automatically install the `linter` package
*   Specify a name to display in messages

## v1.0.3

*   Use a more permissive regex to fix a bug

## v1.0.2

*   Default to `error` message type if not specified

## v1.0.1

*   Enable linting on the fly

## v1.0.0

*   Update to the new Linter API

## v0.0.15

*   Call `super` from `destroy`

## v0.0.14

*   Revert: Use options to observe `phpExecutablePath` config

## v0.0.13

*   Fix deprecation error
*   Use options to observe `phpExecutablePath` config

## v0.0.6 - v0.0.12

*   Update readme

## v0.0.4 - v0.0.5

*   Add settings

## v0.0.3

*   Implement Linter

## v0.0.2

*   Fix description

## v0.0.1

*   Initial version
