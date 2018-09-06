import { ProtoConfig, config } from '@/charts';
import { renderQueue } from '@/utils/render-queue'
import { throttle } from '@/utils/optimization'
import store from '@/store';
declare var d3: any

// interface Data {
//   sepalLength: number
//   sepalWidth: number
//   petalLength: number
//   petalWidth: number
//   species: string
// }

export default class Scatterplot {
  private xScale: any = null
  private yScale: any = null
  private svg: any = null
  private canvas: any = null
  private container: any = null
  private width: number = 0
  private height: number = 0
  private node: any = null
  private context: any = null
  private data: any = null
  private color: any = null
  private processed: any[] = []
  private rq: any = null
  private quadtree: any = null
  private highlight: any = null

  constructor(private cfg: ProtoConfig) {
    this.cfg = Object.assign(config, cfg)
    this.xScale = d3.scaleLinear()
    this.yScale = d3.scaleLinear()
    this.node = d3.select(this.cfg.target)
    this.canvas = this.node.append('canvas').attr('width', this.cfg.width)
      .attr('height', this.cfg.height)
      .style('margin-left', this.cfg.margin.left + 'px')
      .style('margin-top', this.cfg.margin.top + 'px')
    this.context = this.canvas.node().getContext('2d')
    this.svg = this.node.append('svg')
    this.container = this.svg.append('g')
      .attr('transform', `translate(${this.cfg.margin.left}, ${this.cfg.margin.top})`)

    this.color = d3.scaleOrdinal(d3.schemeCategory10).domain(['setosa', 'versicolor', 'virginica'])
    this.rq = renderQueue(this, this.draw)
    this.container.append('g').attr('class', 'axis x-axis')
    this.container.append('g').attr('class', 'axis y-axis')
    this.quadtree = d3.quadtree()
    this.highlight = this.container.append('circle').attr('class', 'highlight')
  }
  update(_data: any[]) {
    let devicePixelRatio = window.devicePixelRatio || 1;
    this.data = this.data || _data
    this.width = this.node.node().clientWidth - this.cfg.margin.left - this.cfg.margin.right
    this.height = this.node.node().clientHeight - this.cfg.margin.top - this.cfg.margin.bottom
    this.canvas.attr('width', this.width * devicePixelRatio)
      .attr('height', this.height * devicePixelRatio)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    this.svg.attr('width', this.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr('height', this.height + this.cfg.margin.top + this.cfg.margin.bottom)
    this.xScale.range([0, this.width])
    this.yScale.range([this.height, 0])
    this.container.append('g').attr('class', 'brush')
    this.context.scale(devicePixelRatio, devicePixelRatio)
    this.container.select('.x-axis').attr('transform', `translate(0,${this.height})`)
    this.process()
    this.renderAxis()
    this.renderBrush()
    this.quadtree.extent([[-1, -1], [this.width + 1, this.height + 1]])
    this.quadtree.addAll(this.processed)
    this.rq.clear(() => {
      this.context.clearRect(0, 0, this.width, this.height)
    })(this.processed)
    let self = this
    // this.container.on('mousemove', throttle(function () {
    //   let [x, y] = d3.mouse(this)
    //   let cloest = self.quadtree.find(x, y)
    //   self.highlight.attr('cx', cloest[0])
    //     .attr('cy', cloest[1])
    //     .attr('r', 6)
    //     .attr('fill', cloest[2])
    // }, 300, true))
  }
  process() {
    if (this.data == null) {
      return
    }
    store.commit('charts/loadSelected', this.data)
    this.xScale.domain(d3.extent(this.data, (d: any) => +d['sepal width']))
    this.yScale.domain(d3.extent(this.data, (d: any) => +d['sepal length']))
    this.processed = this.data.map((d: any) => {
      let temp: any = [this.xScale(+d['sepal width']), this.yScale(+d['sepal length']), this.color(d.species)]
      temp.raw = d
      return temp
    })
  }
  renderBrush() {
    let self: any = this
    this.container.select('.brush').call(d3.brush().extent([[-1, -1], [this.width, this.height]]).on('end', function () {
      let extent = d3.brushSelection(this)
      if (extent == null) {
        store.commit('charts/loadSelected', self.data)
        return

      }

      let selected: any[] = []

      function search(quadtree: any, x0: number, y0: number, x3: number, y3: number) {
        quadtree.visit(function (node: any, x1: number, y1: number, x2: number, y2: number) {
          if (!node.length) {
            // 访问到了叶子节点,只有叶子节点上存在数据
            do {
              let d = node.data
              if ((d[0] >= x0) && (d[0] < x3) && (d[1] >= y0) && (d[1] < y3)) {
                selected.push(d)
              }
            } while (node = node.next)
          }
          return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
        })
      }
      search(self.quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1])
      store.commit('charts/loadSelected', selected.map((d: any) => d.raw))
    }))
  }
  renderAxis() {
    // Render X axis
    this.container.select('.x-axis').call(d3.axisBottom().scale(this.xScale))
    this.container.select('.y-axis').call(d3.axisLeft().scale(this.yScale))
  }
  draw(_data: any[]) {
    this.context.strokeStyle = '#000'
    this.context.strokeWidth = 1.5
    for (let d of _data) {
      this.context.beginPath()
      this.context.fillStyle = d[2]
      this.context.arc(d[0], d[1], 5.5, 0, 2 * Math.PI)
      this.context.fill()
      this.context.stroke()
      this.context.closePath()
    }
  }
}