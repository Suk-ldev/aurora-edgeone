// 判断手机上是否安装了app，如果安装直接打开url，如果没安装，执行callback
export default function (url, callback) {
  console.log(url)
  window.location.href = url

  var t = setTimeout(() => {
    callback && callback()
  }, 2000)

  window.onblur = function () {
    clearTimeout(t)
  }
}
