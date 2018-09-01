import Axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios'
import { from } from 'rxjs'
export interface rxiosConfig extends AxiosRequestConfig {
  localCache?: boolean
}
export default class HttpModule {
  private httpClient: AxiosInstance
  constructor(private options: rxiosConfig = {}) {
    this.httpClient = Axios.create(options)
    this.httpClient.interceptors.request.use(config => {
      if (localStorage.getItem('token')) {
        config.headers.Authorization = 'JWT ' + localStorage.getItem('token')
      }
      return config
    })
  }
  private makeRequest<T>(method: string, url: string, queryParams?: object, body?: object) {
    let request: AxiosPromise<T>;
    switch (method) {
      case 'GET':
        request = this.httpClient.get<T>(url, { params: queryParams })
        break;
      case 'POST':
        request = this.httpClient.post<T>(url, body, { params: queryParams })
        break;
      case 'PUT':
        request = this.httpClient.put<T>(url, body, { params: queryParams })
      case 'PATCH':
        request = this.httpClient.patch<T>(url, body, { params: queryParams })
        break;
      case 'DELETE':
        request = this.httpClient.delete(url, { params: queryParams })
        break;
      default:
        throw new Error('Method not supported');
    }
    return from(request)
  }
  public get<T>(url: string, queryParams?: object) {
    return this.makeRequest<T>('GET', url, queryParams);
  }

  public post<T>(url: string, body: object, queryParams?: object) {
    return this.makeRequest<T>('POST', url, queryParams, body);
  }

  public put<T>(url: string, body: object, queryParams?: object) {
    return this.makeRequest<T>('PUT', url, queryParams, body);
  }

  public patch<T>(url: string, body: object, queryParams?: object) {
    return this.makeRequest<T>('PATCH', url, queryParams, body);
  }

  public delete(url: string, queryParams?: object) {
    return this.makeRequest('DELETE', url, queryParams);
  }

}
