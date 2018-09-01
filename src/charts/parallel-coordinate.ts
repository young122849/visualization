import { ProtoConfig, config } from '@/charts';
import { renderQueue } from '@/utils/render-queue'
import store from '../store'
declare var d3: any
export default class ParallelCoordinate {
  private node: any = null
  private canvas: any = null
  private container: any = null
  private svg: any = null
  private data: any[] | null = null
  private processed: any[] = []
  private yScales: any = {}
  private xScale: any = []
  private height: number = 0
  private width: number = 0
  private line: any = null
  private context: any = null
  private color: any = null
  private rq: any = null
  private selected: any = null
  private actives: any = null

  constructor(private cfg: ProtoConfig) {
    this.cfg = Object.assign(config, cfg)
    this.xScale = d3.scalePoint()
    this.line = d3.line()
    this.color = d3.scaleOrdinal()
      .range(["#5DA5B3", "#D58323", "#DD6CA7", "#54AF52", "#8C92E8", "#E15E5A", "#725D82", "#776327", "#50AB84", "#954D56", "#AB9C27", "#517C3F", "#9D5130", "#357468", "#5E9ACF", "#C47DCB", "#7D9E33", "#DB7F85", "#BA89AD", "#4C6C86", "#B59248", "#D8597D", "#944F7E", "#D67D4B", "#8F86C2"]);
    this.node = d3.select(this.cfg.target)
    this.canvas = this.node.append('canvas')
      .style('margin-left', this.cfg.margin.left + 'px')
      .style('margin-top', this.cfg.margin.top + 'px')
    this.svg = this.node.append('svg')
    this.container = this.svg.append('g').attr('transform', `translate(${this.cfg.margin.left}, ${this.cfg.margin.top})`)
    this.context = this.canvas.node().getContext('2d')
    this.line.context(this.context)
    this.rq = renderQueue(this, this.draw).rate(100)
    this.container.append('g').attr('class', 'dimentions')
  }
  update(_data: any[] | null) {
    let devicePixelRatio = window.devicePixelRatio || 1
    // devicePixelRatio = 2
    this.data = this.data || _data
    if (this.data == null)
      return
    this.height = this.node.node().clientHeight - this.cfg.margin.top - this.cfg.margin.bottom
    this.width = this.node.node().clientWidth - this.cfg.margin.left - this.cfg.margin.right
    this.xScale.rangeRound([0, this.width])
    this.svg.attr('width', this.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr('height', this.height + this.cfg.margin.top + this.cfg.margin.bottom)
    this.canvas.attr('width', devicePixelRatio * this.width)
      .attr('height', devicePixelRatio * this.height)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
    this.context.scale(devicePixelRatio, devicePixelRatio)
    this.rq.clear(() => {
      this.context.clearRect(0, 0, this.width, this.height)
    })
    this.process()
    this.renderAxisAndBrush()
    this.renderAxis()
    this.renderBrush()
    this.rq(this.processed)
  }
  draw(_data: any[]) {
    for (let d of _data) {
      this.context.beginPath()
      this.line(d)
      this.context.lineWidth = 0.5
      this.context.strokeStyle = "steelblue"
      this.context.stroke()
    }
  }
  process() {
    if (this.data == null)
      return
    if (this.xScale.domain().length === 0)
      this.xScale.domain(Object.keys(this.data[0]).filter((d: string) => d !== 'name'))
    this.xScale.domain().forEach((d: string) => {
      this.yScales[d] = d3.scaleLinear().domain(d3.extent(this.data, function (item: any) {
        return +item[d]
      })).range([this.height, 0])
    })
    let result = []
    if (this.actives != null && this.actives.length != 0) {
      result = this.data.filter((d: any) => {
        if (this.actives.every((active: any) => {
          let dim = active.dimention
          return this.yScales[dim](+d[dim]) <= active.extent[1] &&
            this.yScales[dim](+d[dim]) >= active.extent[0]
        }))
          return true
      })

    } else {
      result = this.data
    }
    store.commit('charts/loadSelected', result)
    this.processed = result.map((d: any) => {
      return this.xScale.domain().map((key: string) => {
        return [this.xScale(key), this.yScales[key](d[key])]
      })
    })
    this.rq(this.processed)
  }
  renderAxisAndBrush() {
    let dimentions: string[] = this.xScale.domain()
    let updates = this.container.select('.dimentions')
      .selectAll('.dimention').data(dimentions, (d: string) => d)
    updates.exit().remove()
    let enters = updates.enter().append('g').attr('class', 'dimention')
    enters.merge(updates).attr('transform', (d: string) => `translate(${this.xScale(d)}, 0)`)
  }
  renderAxis() {
    let self = this
    let selectedAxis: string = ""
    let newPos: number = 0
    let dimentions: string[] = this.xScale.domain()
    let updates = this.container.select('.dimentions')
      .selectAll('.dimention')
      .append('g')
      .attr('class', (d: string) => `axis ${d}`)
      .each(function (d: string) {
        d3.select(this).call(d3.axisLeft().scale(self.yScales[d])).append('text')
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function (d: any) { return d; })
        let drag = d3.drag().on('start', function () {
          self.rq.stop()
          self.rq.clear()
        }).on('drag', function (d: any) {
          self.rq.clear()
          selectedAxis = d
          newPos = Math.min(self.width, Math.max(0, d3.event.x))
          d3.select(this).attr('transform', `translate(${newPos}, 0)`)
        }).on('end', function () {
          let newDimentions = dimentions.filter(function (p: string) {
            return p !== selectedAxis
          }).map(function (dimention: string) {
            return { dimention, pos: self.xScale(dimention) }
          }).concat({ dimention: selectedAxis, pos: newPos })
            .sort(function (a: any, b: any) {
              return a.pos - b.pos
            }).map(function (item: any) {
              return item.dimention
            })
          self.xScale.domain(newDimentions)
          self.renderAxisAndBrush()
          self.process()
          self.rq(this.processed)
        })
        d3.select(this.parentNode).call(drag)
      })
  }
  renderBrush() {
    let self = this
    let updates = this.container.select('.dimentions')
      .selectAll('.dimention')
      .append('g')
      .attr('class', 'brush')
      .each(function (d: string) {
        let brush = d3.brushY().extent([[-10, 0], [10, self.height]])
          .on('start', function () {
            d3.event.sourceEvent.stopPropagation()
            self.rq.stop()
            self.rq.clear()
          })
          .on('end', function () {
            let actives: any = []
            self.container.selectAll('.dimentions .brush')
              .filter(function (d: any) {
                return d3.brushSelection(this)
              }).each(function (d: any) {
                actives.push({ dimention: d, extent: d3.brushSelection(this) })
              })
            self.actives = actives
            self.process()
          })
        d3.select(this).call(brush)
      })
  }
}