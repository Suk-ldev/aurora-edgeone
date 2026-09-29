/**
 * 校验界面文案的完整性。
 * 用法：node scripts/check-i18n.mjs
 *
 * 源码里的 i18n key 必须是 ASCII（中文只能作为字典的值出现，否则会被编进构建产物），
 * 且每个 key 在三份字典里都要有。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DICTS = { zhCN: 'b3f07a', zhTW: '5c91e4', enUS: 'a82d6f' }
const GATE = 'src/i18n/gate.js'
const CJK = /[一-鿿]/
const TCALL = /(?:this\.\$t|\$t|i18n\.t)\(\s*(['"`])((?:[^'"`\\]|\\.)*?)\1/g
const META = /\b(?:title|menuTitle|groupTitle):\s*(['"])((?:[^'"\\]|\\.)*?)\1/g

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const errors = []
const used = new Map()

for (const file of walk('src').filter((f) => /\.(js|vue)$/.test(f))) {
  if (file.replace(/\\/g, '/') === GATE) continue
  const text = readFileSync(file, 'utf8')
  for (const rx of [TCALL, META]) {
    rx.lastIndex = 0
    let m
    while ((m = rx.exec(text))) {
      const key = m[2]
      if (CJK.test(key)) {
        errors.push(`${file} 使用了中文 key「${key}」—— 中文会被编进构建产物，请改成 ASCII key`)
      } else if (key) {
        if (!used.has(key)) used.set(key, file)
      }
    }
  }
}

const dicts = Object.fromEntries(
  Object.entries(DICTS).map(([loc, f]) => [loc, JSON.parse(readFileSync(`public/static/data/${f}.json`, 'utf8'))])
)
// 侧边栏额外菜单的标题由 site.config.js 提供，找不到时原样显示，不算缺失
const dynamic = new Set(['m_people'])

for (const [key, file] of used) {
  if (dynamic.has(key)) continue
  const missing = Object.entries(dicts)
    .filter(([, d]) => !(key in d))
    .map(([loc]) => loc)
  if (missing.length === Object.keys(dicts).length) {
    errors.push(`${file} 用到的 key「${key}」三份字典里都没有`)
  } else if (missing.length) {
    errors.push(`key「${key}」缺少 ${missing.join(' / ')} 的译文（${file}）`)
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} 个问题：`)
  errors.forEach((e) => console.error('  ' + e))
  process.exit(1)
}
console.log(`✓ ${used.size} 个 key 全部是 ASCII，且三份字典（各 ${Object.values(dicts)[0] && Object.keys(dicts.zhCN).length} 条）均已覆盖`)
