# v7 Migration

In v7 all the inputs of the `TippyDirective` are now prefixed with `tippy`.

You can use the following search-n-replace script to help you migrate to the latest version:

```js
const glob = require('glob');
const fs = require('node:fs');

function getFiles(ext) {
  return glob.sync(`**/*.${ext}`, {ignore: ['node_modules/**', 'dist/**', 'tmp/**', 'coverage/**']});
}

const files = getFiles('html').concat(getFiles('component.ts'));

const inputMappings = [
  [
    "appendTo",
    "tpAppendTo"
  ],
  [
    "delay",
    "tpDelay"
  ],
  [
    "duration",
    "tpDuration"
  ],
  [
    "hideOnClick",
    "tpHideOnClick"
  ],
  [
    "interactive",
    "tpInteractive"
  ],
  [
    "interactiveBorder",
    "tpInteractiveBorder"
  ],
  [
    "maxWidth",
    "tpMaxWidth"
  ],
  [
    "offset",
    "tpOffset"
  ],
  [
    "placement",
    "tpPlacement"
  ],
  [
    "popperOptions",
    "tpPopperOptions"
  ],
  [
    "showOnCreate",
    "tpShowOnCreate"
  ],
  [
    "trigger",
    "tpTrigger"
  ],
  [
    "triggerTarget",
    "tpTriggerTarget"
  ],
  [
    "zIndex",
    "tpZIndex"
  ],
  [
    "animation",
    "tpAnimation"
  ],
  [
    "useTextContent",
    "tpUseTextContent"
  ],
  [
    "lazy",
    "tpIsLazy"
  ],
  [
    "variation",
    "tpVariation"
  ],
  [
    "isEnabled",
    "tpIsEnabled"
  ],
  [
    "className",
    "tpClassName"
  ],
  [
    "onlyTextOverflow",
    "tpOnlyTextOverflow"
  ],
  [
    "useHostWidth",
    "tpUseHostWidth"
  ],
  [
    "hideOnEscape",
    "tpHideOnEscape"
  ],
  [
    "detectChangesComponent",
    "tpDetectChangesComponent"
  ],
  [
    "popperWidth",
    "tpPopperWidth"
  ],
  [
    "customHost",
    "tpHost"
  ],
  [
    "isVisible",
    "tpIsVisible"
  ],
  [
    "data",
    "tpData"
  ],
  [
    "tippy",
    "tp"
  ]
];
const outputMapping = [['visible', 'tpVisible']];
let updatedFiles = 0;

for (const file of files) {
  const content = fs.readFileSync(file, {encoding: "utf-8"});
  if (!content.includes('tippy')) {
    continue;
  }

  let updated = content;
  for (const [prev, current] of inputMappings) {
    const matcher = new RegExp(`(?<![\\w'"-\\.])${prev}(?![\\w'"-\\.])`, 'g');
    updated = updated.replace(matcher, current);
  }

  for (const [prev, current] of outputMapping) {
    const matcher = new RegExp(`\\(${prev}\\)`, 'g');
    updated = updated.replace(matcher, `(${current})`);
  }

  if(updated !== content) {
    updatedFiles++;
  }

  fs.writeFileSync(file, updated, {encoding: "utf-8"});
}

console.log(`Scanned a total of ${files.length} files and updated ${updatedFiles} of them.`);
```

Make sure you review which keywords are going to be matched since some previous tippy input 
names might be used in other components in your system. (e.g. `data`).

This script will help you with most of the replacements but please review the replaced files after running it.
