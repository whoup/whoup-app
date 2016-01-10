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

  blue50: '#642B6B',

  thm1: '#eded00',
  thm2: '#000000',
  thm3: '#FFFFFF',
  thm4: '#E7E7E7',
  thm5: '#E7E7E7',


  // http://iosfonts.com/
  fontRegular: "SofiaProBlack",
  fontIcon: "HelveticaNeue",
  fontLogo: "SofiaProBlack",

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
