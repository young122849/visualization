import { DirectiveOptions } from 'vue'
const Drag: DirectiveOptions = {
  bind(el, binding) {
    el.getElementsByTagName('img')[0].addEventListener('mousedown', function (ev) {
      ev.preventDefault()
    })
    el.addEventListener('dragstart', function (ev: MouseEvent) {
      if (ev.target !== null) {
        const self: any = ev.target
        self.parentNode.dragElement = ev.target
        self.style.opacity = '0.2'
      }
    })
    el.addEventListener('dragend', function (ev) {
      if (ev.target !== null) {
        const self: any = ev.target
        self.parentNode.dragElement = null
        self.style.opacity = '1'
      }
    })
    el.addEventListener('dragenter', function (ev) {
      console.log('drag enter')
      const self: any = ev.currentTarget
      const dragElement = self.parentNode.dragElement
      if (dragElement !== self) {
        self.parentNode.insertBefore(self, dragElement)
      }
    })
    el.addEventListener('dragover', function (ev) {
      ev.preventDefault()
    })
    el.addEventListener('dragleave', function (ev) {
    })
    el.addEventListener('drop', function (ev) {
      const self: any = ev.currentTarget
      const dragElement = self.parentNode.dragElement
      if (dragElement != self) {
        self.parentNode.insertBefore(self, dragElement)
      }
    })
    // el.addEventListener('mousedown', function (e) {
    //   let distX = e.clientX - el.offsetLeft
    //   let distY = e.clientY - el.offsetTop
    //   el.style.position = 'absolute'
    //   function move(e: any) {
    //     let left = e.clientX - distX
    //     let top = e.clientY - distY
    //     el.style.left = `${left}px`
    //     el.style.top = `${top}px`
    //   }
    //   function cancel() {
    //     document.removeEventListener('mousemove', move)
    //     document.removeEventListener('mouseup', cancel)
    //   }
    //   document.addEventListener('mousemove', move)
    //   document.addEventListener('mouseup', cancel)
    // })
  }
}

export default Drag