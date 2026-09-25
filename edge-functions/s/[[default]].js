/**
 * Xboard 订阅链接 /s/{token} 走同一个转发，订阅地址也能用当前域名
 * 后台改过「订阅路径」的话，把这个目录名和 middleware.js 里的 /s/ 改成一样的
 */
export { onRequest } from '../api/[[default]].js'
