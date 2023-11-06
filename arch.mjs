import spawn from "cross-spawn"

spawn.sync("npm", ["run", process.platform === "linux" && process.env.npm_config_target_arch === "arm" ? "build:arm" : "build"], {
  input: "Native module build required.",
  stdio: "inherit"
})