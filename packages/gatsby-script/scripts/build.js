const { bundleClientModule } = require(`../../../scripts/bundle-client-module`)

let watch = false

for (const arg of process.argv.slice(2)) {
  const [key, value] = arg.split(`=`)
  switch (key) {
    case `--watch`:
      watch = value
      break
  }
}

const modules = [
  {
    input: `src/index.ts`,
    output: `dist/index.js`,
    format: `cjs`,
    watch
  },
  {
    input: `src/index.ts`,
    output: `dist/index.modern.js`,
    format: `es`,
    watch
  }
]

for (const module of modules) {
  bundleClientModule(module)
}