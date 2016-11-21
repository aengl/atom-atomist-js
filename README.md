# atom-atomist-js

A proof-of-concept plugin for Atom that applies JS/React Atomist editors. For more details, refer to the atomist-js package (https://github.com/triforkse/atomist-js).

## Usage:

* Open the command palette
* Enter the editor to apply (all editors are prefixed by `Atomist:`)
* The editor will be applied to the currently opened file. Some editors may also modify related files (e.g. a CSS file with the same name).

## Restrictions:

You can not currently pass arguments to the editors, so some of them will not work at all.
