import HttpModule from '@/api/http';
import { Project } from '@/models/project'

export default class ProjectService {
  private httpModule: HttpModule
  constructor() {
    this.httpModule = new HttpModule()
  }
  loadProjects(url: string) {
    return this.httpModule.get(url)
  }
  addProject(url: string, project: Project) {
    return this.httpModule.post(url, project)
  }
  delProject(url: string, id: string) {
    return this.httpModule.delete(url, { _id: id })
  }
  updateProject(url: string, project: Project) {
    return this.httpModule.patch(url, project)
  }
}