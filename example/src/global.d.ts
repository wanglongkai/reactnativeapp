/// <reference types="expo/types" />

// 声明 CSS 模块，以解决 TypeScript 导入 CSS 文件时的类型报错问题
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
