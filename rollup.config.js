import { resolve } from 'path'

import json from '@rollup/plugin-json'
import rnr from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'

// 根据环境变量中的 target 属性，获取对应模块中的 package.json
const name = process.env.TARGET
const packagePath = process.env.PACKAGE_PATH
const pkgDir = resolve(__dirname, packagePath, name)
const pkgJSON = require(resolve(pkgDir, 'package.json'))

// 打包类型映射表
const outputConfig = {
  'esm-bundler': {
    file: resolve(pkgDir, `dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  'esm-browser': {
    file: resolve(pkgDir, `dist/${name}.esm-browser.js`),
    format: 'es'
  },
  cjs: {
    file: resolve(pkgDir, `dist/${name}.cjs.js`),
    format: 'cjs'
  },
  global: {
    file: resolve(pkgDir, `dist/${name}.global.js`),
    format: 'iife'
  }
}

// 根据 package.json 的 formats 来确认打包格式
const options = pkgJSON.buildOptions

const createConfig = (format, output) => {
  output.name = options.name
  output.sourcemap = true

  return {
    input: resolve(pkgDir, 'src/index.ts'),
    output,
    plugins: [
      json({
        namedExports: false
      }),
      ts({
        tsconfig: resolve(__dirname, 'tsconfig.json')
      }),
      rnr()
    ],
    treeshake: {
      moduleSideEffects: false
    }
  }
}

export default options.formats.map(format => createConfig(format, outputConfig[format]))
