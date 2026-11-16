import { copyFileSync, mkdirSync } from 'node:fs'

const target = new URL('../public/model/', import.meta.url)
const source = new URL('../node_modules/@spotify/basic-pitch/model/', import.meta.url)
mkdirSync(target, { recursive: true })
for (const file of ['model.json', 'group1-shard1of1.bin']) {
  copyFileSync(new URL(file, source), new URL(file, target))
}
