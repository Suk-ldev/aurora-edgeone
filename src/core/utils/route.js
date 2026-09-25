import { routeStaticContext } from '../collectors/router'

/**
 * 根据路由所属类型获取静态路由
 * @returns 静态路由
 */
export function getStaticRoutes() {
  const files = routeStaticContext.keys()
  const allRoutes = files.reduce((routes, file) => {
    return routes.concat(routeStaticContext(file).default)
  }, [])

  return allRoutes
}
