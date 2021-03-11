
const colors = {
  C01: '#909090',
  C02: '#111',
}
const groups = {
  GBK05A: ['C01', 'C02']
}

/**
 * postcss-nesting 和 postcss-nested 都是用来解开嵌套规则的
 */
module.exports = {
  //  要配合postcss一起使用的postcss插件
  plugins: [
    require('precss'),
    require('autoprefixer'),
    //  自定义PostCSS Plugin --- postcss-theme-colors
    require('./custom-plugin/postcss/postcss-theme-colors')({colors, groups}),
    require('postcss-nesting'),
    require('postcss-nested')
    
  ]
}