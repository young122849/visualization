declare var d3: any
interface Data {

}
import { config, ProtoConfig } from './index'
import store from '@/store';

export default class Barchart {
  private svg: any
  private container: any
  private data: any
  private processed: any
  private stack: any
  private color: any
  private x: any
  private y: any
  private width: number = 0
  private height: number = 0
  private node!: HTMLElement
  constructor(private cfg: ProtoConfig) {
    this.cfg = Object.assign(config, cfg)
    this.stack = d3.stack()
    this.x = d3.scaleBand().paddingInner(0.5)
    this.y = d3.scaleLinear()
    this.color = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    this.node = d3.select(this.cfg.target).node()
    this.svg = d3.select(this.node).append('svg')
    this.container = this.svg.append('g').attr('class', 'container')
      .attr('transform', `translate(${this.cfg.margin.left}, ${this.cfg.margin.top})`)
    this.container.append('g').attr('class', 'bars')
  }
  update(data: any = null) {
    this.data = this.data || data
    if (!this.data)
      return
    this.svg.attr('width', this.node.clientWidth)
      .attr('height', this.node.clientHeight)
    this.width = this.node.clientWidth - this.cfg.margin.left - this.cfg.margin.right
    this.height = this.node.clientHeight - this.cfg.margin.top - this.cfg.margin.bottom

    this.x.rangeRound([0, this.width]).paddingInner(0.2)
    this.y.rangeRound([this.height, 0])
    this.process()
    this.render(this.processed)
    // this.renderGroup()
  }
  process() {
    store.commit('charts/loadSelected', this.data)
    // 按照大到小排序
    // this.data.sort(function (a: any, b: any) {
    //   return a.total - b.total
    // })
    this.data.forEach((d: any) => {
      let total: number = 0
      for (let key of Object.keys(d)) {
        if (key !== 'State') {
          total += d[key] = +d[key]
        }
      }
      d.total = total
    })
    this.stack.keys(Object.keys(this.data[0]).filter(item => item !== 'State' && item !== 'total'))
    this.x.domain(this.data.map((d: any) => d.State))
    this.y.domain([0, d3.max(this.data, (d: any) => d.total)]).nice()
    this.processed = this.stack(this.data)
  }
  render(data: any) {
    let updates = this.container.select('.bars').selectAll('.bar').data(data, (d: any) => d.key)
    updates.exit().remove()
    let enters = updates.enter().append('g').attr('class', 'bar')
    enters.merge(updates).attr('fill', (d: any) => this.color(d.key))
    let updateRects = this.container.selectAll('.bars .bar').selectAll('rect').data((d: any) => d)
    updateRects.exit().remove()
    let enterRects = updateRects.enter().append('rect')
    updateRects.merge(enterRects).attr('x', (d: any) => this.x(d.data.State))
      .attr('width', this.x.bandwidth())
      .attr('height', 0)
      .attr('y', this.height)
      .transition()
      .delay((d: any, i: number) => i * 10)
      .attr('y', (d: any) => this.y(d[1]))
      .attr('height', (d: any) => this.y(d[0]) - this.y(d[1]))
  }
  renderStacked() {
    this.y.domain([0, d3.max(this.data, (d: any) => d.total)]).nice()

    let rects = this.container.select('.bars').selectAll('.bar').selectAll('rect')
    rects.transition().duration(500)
      .delay(function (d: any, i: number) {
        return i * 10
      }).attr('y', (d: any) => this.y(d[1]))
      .attr('height', (d: any) => this.y(d[0]) - this.y(d[1]))
      .transition()
      .attr('x', (d: any, i: number) => this.x(d.data.State))
      .attr('width', this.x.bandwidth())
  }
  renderGroup() {
    this.y.domain([0, d3.max(this.data, (d: any) => {
      return d3.max(Object.keys(d), (key: string) => {
        if (key !== 'total' && key !== 'State') {
          return d[key]
        } else {
          return 0
        }
      })
    })])
    let self = this
    let rects = this.container.select('.bars').selectAll('.bar').selectAll('rect')
    rects.transition().duration(500)
      .delay((d: any, i: number) => i * 10)
      .attr('width', this.x.bandwidth() / self.data.columns.slice(1).length)
      .attr('x', function (d: any, i: number) {
        return self.x(d.data.State) + self.x.bandwidth() / self.data.columns.slice(1).length * this.parentNode.__data__.index
      }).transition()
      .attr('y', (d: any) => this.y(d[1] - d[0]))
      .attr('height', (d: any) => this.y(0) - (this.y(d[1] - d[0])))
  }
}