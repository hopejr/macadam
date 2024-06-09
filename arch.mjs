import spawn from "cross-spawn"
import os from 'os'

let buildParam = 'build'

if (process.platform === 'linux') {
  if (os.arch() !== 'arm' && ['armv7l', 'arm'].includes(process.env.npm_config_target_arch)) {
    buildParam = 'build:linux-arm'
  } else if (os.arch() !== 'arm64' && process.env.npm_config_target_arch === 'arm64') {
    buildParam = 'build:linux-arm64'
  } else if (os.arch() !== 'x64' && process.env.npm_config_target_arch === 'x64') {
    buildParam = 'build:linux-x64'
  }
}

spawn.sync('npm', ['run', buildParam], {
  input: 'Native module build required.',
  stdio: 'inherit'
})
