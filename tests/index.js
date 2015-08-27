'use strict';

var sassColors = require('../index'),
    chai = require('chai');

var colors = require('./assets/colors');
var keyColors = ['green', 'blue'];
var file = __dirname + '/assets/colors.scss';

chai.should();

describe('Sass Colors', function() {

  describe('Extend', function() {
    it('should extend _getPatterns', function() {
      sassColors.extend.should.equal('_getPatterns');
    });
  });

  describe('AST', function() {
    it('ast should return colors array', function() {
      sassColors.ast(file, keyColors, function(colors) {
        colors.should.be.a('array');
      });
    })
  });

  describe('addValueReferences', function() {
    it('addValueReferences should return colors array', function() {
      sassColors.addValueReferences(colors, function(colors) {
        colors.should.be.a('array');
      });
    });
  });

});
