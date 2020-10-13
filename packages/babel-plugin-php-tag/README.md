# babel-plugin-php-babel



## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-php-babel
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["php-babel"]
}
```

### Via CLI

```sh
$ babel --plugins php-babel script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["php-babel"]
});
```
