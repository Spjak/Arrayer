# Arrayer

Convert lines of text or numbers into an array

## Features

Convert a selection of lines to an array.

Use with `Ctrl+Shift+P` and `Arrayer` keyword.

As default, will convert into a JavaScript style array like `["item","item2","item3"]` or `[123,234,345]`

Other quotation marks, bracket styles and separators can be defined in settings.

The converter will trim leading and trailing spaces.
### Predictive lookahead

The converter will evaluate the first (default 5) lines to determine the style of data and assume the remaining lines follow the same pattern.
* If the lines start and/or end with delimiters (`,;:`) those will be trimmed
* If the lines are already quoted, no additional quotation marks will be applied
* If the lines contain only numbers (integer or decimal), no quotation marks will be applied
