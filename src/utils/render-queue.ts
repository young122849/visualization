window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 6000 / 60)
    }
})()
export function renderQueue(context: any, drawFn: any) {
  let queue: any[] = []
  let rate: number = 1
  let stopFn: any = function () { }
  let clearFn: any = function () { }
  let rq: any = function (data: any) {
    if (data != null)
      rq.data(data)
    rq.stop()
    rq.clear()
    rq.render()
  }
  rq.data = function (_data: any[]) {
    if (_data != null) {
      queue = [..._data]
    }
    rq.stop()
    return rq
  }
  rq.rate = function (val: number) {
    if (val !== 0 && val != null) {
      rate = val
      return rq
    } else {
      return rate
    }
  }
  rq.add = function (_data: any) {
    queue = [...queue, ..._data]
  }
  rq.render = function () {
    let valid = true
    rq.stop = function () {
      valid = false
    }
    function doFrame() {
      if (!valid || queue.length === 0) {
        return
      }
      let chunk = queue.splice(0, rate)
      drawFn.call(context, chunk)
      window.requestAnimationFrame(doFrame)
    }
    window.requestAnimationFrame(doFrame)
  }
  rq.remaining = function () {
    return queue.length
  }
  rq.clear = function (fn: any) {
    if (fn != null) {
      clearFn = fn
    } else {
      clearFn()
    }
    return rq
  }
  rq.stop = function (fn: any) {
    if (fn != null) {
      stopFn = fn
    } else {
      stopFn()
    }
  }
  return rq
}
