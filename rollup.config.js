import { resolve } from 'path'

import json from '@rollup/plugin-json'
import rnr from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import ts from 'rollup-plugin-typescript2'

// 根据环境变量中的 target 属性，获取对应模块中的 package.json
const name = process.env.TARGET
const packagePath = process.env.PACKAGE_PATH
const pkgDir = resolve(__dirname, packagePath, name)
const pkgJSON = require(resolve(pkgDir, 'package.json'))

const hasTSChecked = false

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

  const isProductionBuild = process.env.__DEV__ === 'false'
  const isBundlerESMBuild = /esm-bundler/.test(format)

  return {
    input: resolve(pkgDir, 'src/index.ts'),
    output,
    plugins: [
      json({
        namedExports: false
      }),
      ts({
        check: process.env.NODE_ENV === 'production' && !hasTSChecked,
        tsconfig: resolve(__dirname, 'tsconfig.json')
      }),
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild
      ),
      rnr()
    ],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    },
    external: [
      '@vue/reactivity',
      '@vue/shared'
    ]
  }
}

function createReplacePlugin (
  isProduction,
  isBundlerESMBuild
) {
  const replacements = {
    __DEV__: isBundlerESMBuild
      ? '(process.env.NODE_ENV !== \'production\')'
      : !isProduction
  }

  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })

  return replace({
    values: replacements,
    preventAssignment: true
  })
}

export default options.formats.map(format => createConfig(format, outputConfig[format]))
