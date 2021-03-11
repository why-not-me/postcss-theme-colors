/**
 * 自定义PostCSS插件：postcss-theme-colos
 */
 const postcss = require('postcss');
 const defaults = {
   function: 'cc',
   groups: {},
   colors: {},
   useCustomProperties: false,
   darkThemeSelector: 'html[data-theme="dark"]',
   nestingPlugin: null
 };
 const resolveColor = (options, theme, group, defaultValue) => {
   const [lightColor, darkColor] = options.groups[group] || [];
   const color = theme === 'dark' ? darkColor : lightColor;
   if (!color) {
     return defaultValue;
   }
   if (options.useCustomProperties) {
     return color.startsWith('--') ? `var(${color})` : `var(--${color})`;
   }
   return options.colors[color] || defaultValue;
 };
 module.exports = postcss.plugin('postcss-theme-colors', (options) => {
   options = Object.assign({}, defaults, options);
   // 获取色值函数（默认为 cc()）
   const reGroup = new RegExp(`\\b${options.function}\\(([^)]+)\\)`, 'g');
   return (style, result) => {
     // 判断 PostCSS 工作流程中，是否使用了某些 plugins
     const hasPlugin = (name) =>
       name.replace(/^postcss-/, '') === options.nestingPlugin ||
       result.processor.plugins.some((p) => p.postcssPlugin === name);
     // 获取最终 CSS 值
     const getValue = (value, theme) => {
       /**
        * 'clolor: cc(GBK05A)'.replace(reGroup, (match, group) => {
        *   console.log('match是什么--', match) // cc(GBK05A)
        *   console.log('group是什么--', group) // GBK05A
          })
        */
       return value.replace(reGroup, (match, group) => {
         return resolveColor(options, theme, group, match);
       });
     };
     // 遍历 CSS 声明
     style.walkDecls((decl) => {
       const value = decl.value;
       console.log('decl是什么--', decl);
       // 如果不含有色值函数调用，则提前退出
       if (!value || !reGroup.test(value)) {
         return;
       }
       console.log('含有色值函数的value--', value);
       //  light主题颜色
       const lightValue = getValue(value, 'light');
       //   dark主题颜色
       const darkValue = getValue(value, 'dark');
       //   dark theme 的css声明
       const darkDecl = decl.clone({ value: darkValue });
       console.log('dark theme 的css声明', darkDecl);
       let darkRule;
       // 使用插件，生成 dark 样式
       /**
        * dark样式长这样
        * html[data-theme='dark'] a {
        *   color: darkColor
        * }
        */
       if (hasPlugin('postcss-nesting')) {
         darkRule = postcss.atRule({
           name: 'nest',
           params: `${options.darkThemeSelector} &`
         });
         console.log('经过postcss-nesting处理的darkRule--', darkRule)
       } else if (hasPlugin('postcss-nested')) {
         darkRule = postcss.rule({
           selector: `${options.darkThemeSelector} &`
         });
         console.log('经过postcss-nested处理过的darkRules', darkRule)
       } else {
         decl.warn(
           result,
           `Plugin(postcss-nesting or postcss-nested) not found`
         );
       }
       console.log('处理过的darkRule--', darkRule)
       // 添加 dark 样式到目标 HTML 节点中
       if (darkRule) {
         darkRule.append(darkDecl);
         decl.after(darkRule);
       }
       const lightDecl = decl.clone({ value: lightValue });
       decl.replaceWith(lightDecl);
     });
   };
 });