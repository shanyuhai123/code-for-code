// 对所有 @vue packages 进行打包
const { readdirSync, statSync } = require('fs')
const execa = require('execa')

const VUE_NEXT_PATH = 'packages/@vue'

const dirs = readdirSync(VUE_NEXT_PATH).filter(dir => statSync(`${VUE_NEXT_PATH}/${dir}`).isDirectory())

async function build (pkg) {
  await execa('rollup', [
    '-c',
    '--environment',
    [
      `TARGET:${pkg}`,
      `PACKAGE_PATH:${VUE_NEXT_PATH}`
    ].join(',')
  ], {
    stdio: 'inherit' // 子进程信息共享给父进程
  })
}

function runParallel (dirs, iteratorFn) {
  const ret = []
  for (const dir of dirs) {
    const p = iteratorFn(dir)
    ret.push(p)
  }

  return Promise.all(ret)
}

runParallel(dirs, build)
