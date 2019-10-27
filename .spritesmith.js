'use strict';

var util = require('util');

module.exports = {
    src: './src/assets/images/character-icon/*.png',
//    destImage: './public/images/character-icon.png',
    destImage: './src/assets/character-icon.png',
    destCSS: './src/assets/character-icon.css',
    imgPath: './character-icon.png',
    padding: 0,
    algorithm: 'binary-tree',
    cssTemplate: 'css-sprite.template',
};