'use strict';

var React  = require('react-native');
var {
  PixelRatio
} = React;

module.exports = {
  gray90: '#323A3B',
  gray50: '#828A8B',
  gray30: '#B4B9B9',
  gray20: '#CFD2D3',
  gray10: '#EBECEC',
  gray5:  '#F5F6F6',


  heartActive: '#df1f1f',

  blue50: '#270f36',

  thm1: '#270F36',
  thm2: '#642B6B',
  thm3: '#C86B89',
  thm4: '#F47Fc7',
  thm5: '#E8E9F3',


  // http://iosfonts.com/
  fontRegular: "HelveticaNeue",
  fontIcon: "HelveticaNeue",
  fontLogo: "Avenir-Book", // TODO: get an icon font and include

  listLine: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(), // thinnest possible line
    marginLeft: 10,
  },
  listFullLine: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(), // thinnest possible line
    marginLeft: 0,
  }
};
