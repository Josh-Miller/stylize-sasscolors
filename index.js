'use strict';

var sassThematic = require('sass-thematic'),
    fs = require('fs'),
    _ = require('lodash'),
    Pattern = require('./lib/pattern'),
    path = require('path');

var cmdPath = process.cwd();

var ColorDefinition = function() {
  return {
    variable: '',
    type: '',
    value: '',
    reference: '',
    keyColor: false,
  }
};

var SassColors = function() {

  this.extend = '_getPatterns';
  this.colors = [];

  this.init = function(patterns, settings, cb) {
    var filePath = path.join(cmdPath, settings.file);
    var keyColors = settings.keyColors;
    var _sassColors = this;

    this.ast(filePath, keyColors, function(colors) {
      _sassColors.createPattern(colors, patterns, function(patterns) {
        cb(patterns);
      });
    });
  };

  this.ast = function(file, keyColors, cb) {
    var _sassColors = this;
    sassThematic.parseAST({
      file: file,
      includePaths: ['']
    }, function(err, ast) {
      if (err) {
        return err;
      }

      _sassColors.filter(ast, keyColors, function(colors){
        cb(colors);
      });
    });
  };

  this.createPattern = function(colors, patterns, cb) {
    var pattern = new Pattern;

    pattern.name = 'SASS Colors';
    pattern.fileName = 'colors.html';
    pattern.data = {colors: colors, cssPath: path.join(__dirname, './template/assets/colors.css')};
    pattern.category = 'styleguide';
    pattern.uri = '/public/styleguide/colors.html';
    pattern.id = 'colors';
    pattern.parents = ['styleguide'];

    var headerPath = path.join(__dirname, 'template/head.html'),
      footerPath = path.join(cmdPath, 'src/partials/footer.hbs');
    var headerTemplate = fs.readFileSync(headerPath, 'utf8');
    var footerTemplate = fs.readFileSync(footerPath, 'utf8');
    var template = fs.readFileSync(path.join(cmdPath, 'node_modules/stylize-sasscolors/template/colors.html'), 'utf8');

    pattern.header = headerTemplate;
    pattern.footer = footerTemplate;
    pattern.template = template;

    patterns.push(pattern);

    cb(patterns);

  };

  this.filter = function(ast, keyColors, cb) {
    var _sassColors = this;

    if (ast.content) {

      var declarations = ast.content.filter(function(e, i) {
        return e.type === 'declaration';
      });

      _.forEach(declarations, function(declaration, declarationIndex) {
        var properties = declaration.content.filter(function(e, i) {
          return e.type === 'property';
        });

        var values = declaration.content.filter(function(e, i) {
          return e.type === 'value';
        });

        var colorItem = new ColorDefinition;

        values.forEach(function(value) {
          value.content.forEach(function(item) {
            if (item.type === 'color') {
              colorItem.type = item.type;
              colorItem.value = item.content;
            }
            if (item.type === 'variable') {
              colorItem.type = item.type;
              colorItem.reference = item.content[0].content;
            };
          });

        });

        properties.forEach(function(property, i) {
          property.content.forEach(function(item) {
            item.content.forEach(function(item) {
              if (item.type === 'ident') {
                colorItem.variable = item.content;

                var result = _.some(keyColors, function(colorVar) {
                  return colorVar === item.content;
                });

                if (result) {
                  colorItem.keyColor = true;
                }
              }
            });
          });
        });

        _sassColors.colors.push(colorItem);

        if (declarations.length - 1 === declarationIndex) {
          _sassColors.addValueReferences(_sassColors.colors, function(colors) {
            cb(_sassColors.colors);
          });
        }

      });

    }
  };

  this.addValueReferences = function(colors, cb) {
    colors.forEach(function(color, i) {
      if (color.reference !== '') {
        var matchingColor = _.find(colors, {'variable': color.reference});
        color.value = matchingColor.value;
      }
    });

    cb(colors);
  };
};

module.exports = new SassColors;
