// 针对单个 package 进行打包
const execa = require('execa')

const PACKAGE_PATH = 'packages/@vue' // 'packages/@vue'
const target = 'reactivity' // 'reactivity'

async function build (pkg) {
  await execa('rollup', [
    '-cw',
    '--environment',
    [
      `TARGET:${pkg}`,
      `PACKAGE_PATH:${PACKAGE_PATH}`
    ].join(',')
  ], {
    stdio: 'inherit' // 子进程信息共享给父进程
  })
}

build(target)
