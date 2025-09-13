import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js", // 项目入口
  output: {
    file: "dist/bundle.cjs.js", // 输出文件
    format: "cjs",              // 输出格式 CommonJS
    exports: "auto"             // 自动导出
  },
  plugins: [
    resolve(),   // 让 Rollup 支持第三方模块
    commonjs()   // 把 CommonJS 模块转成 ES6 供 Rollup 处理
  ],
  external: [
    "fs",
    "path",
    "os"
  ]
};