[![Build Status](https://travis-ci.org/Josh-Miller/stylize-sasscolors.svg)](https://travis-ci.org/Josh-Miller/stylize-sasscolors)

# Stylize SASS Colors

Auto create a pattern for [Stylize](https://github.com/Josh-Miller/stylize) based on the color variables in your sass files.

## Getting started

To add this to your Stylize project:

```
$ npm i stylize-sasscolors --save
```

## Settings

- __file__ (string)
- __keyColors__ (array)

In your config.yml:

```
plugins:
  stylize-sasscolors:
    file: '../your_theme/_color.scss'
    keyColors:
      - green
      - blue
```
