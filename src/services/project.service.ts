import HttpModule from '@/api/http';
import { Project } from '@/models/project'

export default class ProjectService {
  private httpModule!: HttpModule
  private static instance: ProjectService
  static getInstance() {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService()
      ProjectService.instance.httpModule = new HttpModule()
    }
    return ProjectService.instance
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