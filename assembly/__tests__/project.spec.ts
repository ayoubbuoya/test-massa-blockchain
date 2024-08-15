import {
  bytesToString,
  bytesToSerializableObjectArray,
} from '@massalabs/as-types';
import { mockAdminContext } from '@massalabs/massa-as-sdk';
import { Project } from '../contracts/project';
import {
  addProject,
  constructor,
  getNumberOfProjects,
  getProjects,
} from '../contracts/main';

const project1 = new Project('My Project', 'My description');

const project2 = new Project('My Project 2', 'My description 2');

const project3 = new Project('My Project 3', 'My description 3');

describe('constructor tests', () => {
  test('Storage correctly initialized', () => {
    mockAdminContext(true);
    constructor([]);
    const numberProjects = bytesToString(getNumberOfProjects([]));
    expect(numberProjects).toStrictEqual('0');
    const projects = bytesToSerializableObjectArray<Project>(
      getProjects([]),
    ).unwrap();
    expect(projects).toStrictEqual([]);
  });

  describe('Projects', () => {
    it('addProject', () => {
      addProject(project1.serialize());
      const numberProjects = bytesToString(getNumberOfProjects([]));
      expect(numberProjects).toStrictEqual('1');
      const projects = bytesToSerializableObjectArray<Project>(
        getProjects([]),
      ).unwrap();
      expect(projects).toStrictEqual([project1]);
    });

    it('getProjects', () => {
      addProject(project2.serialize());
      const numberProjects = bytesToString(getNumberOfProjects([]));
      expect(numberProjects).toStrictEqual('2');
      const projects = bytesToSerializableObjectArray<Project>(
        getProjects([]),
      ).unwrap();
      expect(projects).toStrictEqual([project1, project2]);
    });
  });
});
