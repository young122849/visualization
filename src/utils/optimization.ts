export function debounce(fn: any, time: number, immediate: boolean = true, ...args: any[]) {
  let timeout: any = null
  return function () {
    const context: any = this
    if (timeout)
      clearTimeout(timeout)
    if (immediate) {
      // 需要立即执行
      let callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, time)
      if (callNow) {
        fn.call(context, ...args)
      }
    } else {
      timeout = setTimeout(function () {
        fn.call(context, ...args)
      })
    }
  }
}

export function throttle(fn: any, time: number, immediate: boolean = true, ...args: any[]) {
  let start: number = 0
  let timeout: any = null
  return function () {
    const context: any = this
    if (immediate) {
      let now = Date.now()
      if (now - start >= time) {
        fn.call(context, ...args)
        start = Date.now()
      }
    } else {
      if (!timeout) {
        timeout = setTimeout(function () {
          timeout = null
          fn.call(context, ...args)
        }, time)
      }
    }
  }
}