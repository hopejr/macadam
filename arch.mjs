import spawn from "cross-spawn"

if (process.platform === "linux") {
  spawn.sync("npm", ["run", process.env.npm_config_target_arch === "arm" ? "build:arm" : process.env.npm_config_target_arch === "x64" ? "build:linuxx86" : "build"], {
    input: "Native module build required.",
    stdio: "inherit"
  })
} else {
  spawn.sync("npm", ["run", "build"], {
    input: "Native module build required.",
    stdio: "inherit"
  })
}