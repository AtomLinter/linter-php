'use babel';

import * as path from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const linterPhp = require('../lib/main.js');

const badPath = path.join(__dirname, 'files', 'bad.php');
const goodPath = path.join(__dirname, 'files', 'good.php');
const emptyPath = path.join(__dirname, 'files', 'empty.php');
const fatalPath = path.join(__dirname, 'files', 'fatal.php');
const deprecatedPath = path.join(__dirname, 'files', 'deprecated.php');

const { lint } = linterPhp.provideLinter();

describe('The php -l provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();

    const activationPromise = atom.packages.activatePackage('linter-php');

    await atom.packages.activatePackage('language-php');
    await atom.workspace.open(goodPath);

    atom.packages.triggerDeferredActivationHooks();
    await activationPromise;
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-php')).toBe(true));

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-php')).toBe(true));

  describe('checks bad.php and', () => {
    it('verifies that message', async () => {
      const editor = await atom.workspace.open(badPath);
      const messages = await lint(editor);

      expect(messages.length).toBe(1);
      expect(messages[0].type).toBe('Error');
      expect(messages[0].html).not.toBeDefined();
      expect(messages[0].text).toBe('syntax error, unexpected \'{\'');
      expect(messages[0].filePath).toBe(badPath);
      expect(messages[0].range).toEqual([[1, 0], [1, 6]]);
    });
  });

  it('finds nothing wrong with an empty file', async () => {
    const editor = await atom.workspace.open(emptyPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  it('handles fatal errors', async () => {
    const editor = await atom.workspace.open(fatalPath);
    const messages = await lint(editor);

    expect(messages[0].type).toBe('Error');
    expect(messages[0].text).toBe('Cannot redeclare Test\\A::foo()');
    expect(messages[0].filePath).toBe(fatalPath);
    expect(messages[0].range).toEqual([[10, 4], [10, 25]]);
  });

  it('handles deprecated errors', async () => {
    const editor = await atom.workspace.open(deprecatedPath);
    const messages = await lint(editor);
    const phpVersionInfo = await linterPhp.getPhpVersionInfo();

    expect(phpVersionInfo.major).not.toBeLessThan(5);

    if (phpVersionInfo.major >= 7) {
      expect(messages[0].type).toBe('Warning');
      expect(messages[0].filePath).toBe(deprecatedPath);
      expect(messages[0].text).toBe('Methods with the same name as their class will not be constructors in a future version of PHP; Foo has a deprecated constructor');
      expect(messages[0].range).toEqual([[3, 0], [3, 9]]);
    } else if (phpVersionInfo.major === 5) {
      // No E_DEPRECATED errors are reported by the linter for 5.x
    }
  });
});
