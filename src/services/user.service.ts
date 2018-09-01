export interface User {
  username: string,
  password: string
}
import HttpModule from '@/api/http';
import { pluck, filter } from 'rxjs/operators'
import store from '@/store';
import { of } from 'rxjs';

export default class UserService {
  public redirectUrl: string = ""
  private httpModule: HttpModule
  constructor() {
    this.httpModule = new HttpModule()
  }
  login(url: string, user: User) {
    return this.httpModule.post(url, user)
  }
  register(url: string, user: User) {
    this.httpModule.post(url, user).pipe(pluck('data', 'success'))
      .subscribe(val => console.log(val))
  }
  checkLogin(url: string) {
    return this.httpModule.post(url, {})
  }
}