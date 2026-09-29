/**
 * 校验接口映射表的一致性，以及前端没有漏改的真实后端路径。
 * 用法：node scripts/check-api-map.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { PATHS, API_MAP } from '../edge-functions/_shared/api-map.js'

const errors = []

const mapped = new Set(Object.keys(API_MAP))
for (const [name, path] of Object.entries(PATHS)) {
  if (!mapped.has(path)) {
    errors.push(`PATHS.${name} = ${path} 不在 API_MAP 里`)
  }
}
const declared = new Set(Object.values(PATHS))
for (const path of mapped) {
  if (!declared.has(path)) {
    errors.push(`API_MAP 有 ${path}，但 PATHS 里没有对应常量`)
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}
const REAL = /\/api\/v1\/(?:passport|guest|user|client)\//
for (const file of walk('src').filter((f) => /\.(js|vue)$/.test(f))) {
  const text = readFileSync(file, 'utf8')
  text.split('\n').forEach((line, i) => {
    if (REAL.test(line)) {
      errors.push(`${file}:${i + 1} 仍在直接使用真实后端路径 —— ${line.trim()}`)
    }
  })
}

if (errors.length) {
  console.error(`✗ ${errors.length} 个问题：`)
  errors.forEach((e) => console.error('  ' + e))
  process.exit(1)
}
console.log(`✓ ${Object.keys(API_MAP).length} 条映射一致，前端无残留真实路径`)
