import HttpModule from '@/api/http';
export default class ChartService {
  private httpModule: HttpModule
  constructor() {
    this.httpModule = new HttpModule()
  }

  loadData(url: string, type: string) {
    return this.httpModule.get(url, { type: type })
  }
}