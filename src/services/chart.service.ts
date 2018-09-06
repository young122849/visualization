import HttpModule from '@/api/http';
export default class ChartService {
  private httpModule!: HttpModule
  private static instance: ChartService
  static getInstance() {
    if (!ChartService.instance) {
      ChartService.instance = new ChartService()
      ChartService.instance.httpModule = new HttpModule()
    }
    return ChartService.instance
  }

  loadData(url: string, type: string) {
    return this.httpModule.get(url, { type: type })
  }
}