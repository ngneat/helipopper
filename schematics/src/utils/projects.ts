import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json', '/workspace.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  return path;
}

export function getWorkspace(host: Tree) {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}

export function getProject(host: Tree, projectName?: string) {
  const workspace = getWorkspace(host);
  projectName = projectName || workspace.defaultProject;
  const project = workspace.projects[projectName];

  if (!project) {
    throw new SchematicsException(`Invalid project name: ${projectName}`);
  }

  return project;
}
