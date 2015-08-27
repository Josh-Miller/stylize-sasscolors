# Stylize SASS Colors

Auto create a pattern based on the color variables in your sass files.

## Getting started

To add this to your Stylize project:

```
$ npm i stylize-sasscolors --save
```

## Settings

*file* (string)
*keyColors* (array)

In your config.yml:

```
plugins:
  stylize-sasscolors:
    file: '../../../lulz/lulz.dev/public_html/sites/all/themes/lulzbot/src/scss/settings/_color.scss'
    keyColors:
      - green
      - blue
```
