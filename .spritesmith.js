'use strict';

var util = require('util');

module.exports = [
    {
        src: './src/assets/images/character-icon/gacha6/*.png',
        destImage: './src/assets/character-icon-gacha6.png',
        destCSS: './src/assets/character-icon-gacha6.css',
        imgPath: './character-icon-gacha6.png',
        padding: 0,
        algorithm: 'binary-tree',
        cssTemplate: 'css-sprite.template',
    },
    {
        src: './src/assets/images/character-icon/gacha5/*.png',
        destImage: './src/assets/character-icon-gacha5.png',
        destCSS: './src/assets/character-icon-gacha5.css',
        imgPath: './character-icon-gacha5.png',
        padding: 0,
        algorithm: 'binary-tree',
        cssTemplate: 'css-sprite.template',
    },
];