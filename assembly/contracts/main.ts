import { Storage, Context, generateEvent } from '@massalabs/massa-as-sdk';
import {
  Args,
  bytesToSerializableObjectArray,
  serializableObjectsArrayToBytes,
  stringToBytes,
} from '@massalabs/as-types';
import { Project } from './project';

const NUMBER_PROJECTS_KEY = 'NUMBER_PROJECTS';
const PROJECT_KEY = 'PROJECT';

export function constructor(_: StaticArray<u8>): void {
  if (!Context.isDeployingContract()) {
    return;
  }

  Storage.set(NUMBER_PROJECTS_KEY, '0');
  Storage.set(stringToBytes(PROJECT_KEY), []);

  generateEvent('Token Pledge Contract Initialized');
}

export function addProject(_args: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(_args);

  const project = args
    .nextSerializable<Project>()
    .expect('Project argument is missing or invalid');

  let newIndex = u32(parseInt(Storage.get(NUMBER_PROJECTS_KEY)) + 1);

  const projects = bytesToSerializableObjectArray<Project>(
    Storage.get(stringToBytes(PROJECT_KEY)),
  ).unwrap();

  projects.push(project);

  Storage.set(
    stringToBytes(PROJECT_KEY),
    serializableObjectsArrayToBytes(projects),
  );
  Storage.set(NUMBER_PROJECTS_KEY, newIndex.toString());

  return serializableObjectsArrayToBytes(projects);
}

export function getProjects(_: StaticArray<u8>): StaticArray<u8> {
  return Storage.get(stringToBytes(PROJECT_KEY));
}

export function getProject(_args: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(_args);

  const index = args
    .nextString()
    .expect('Index argument is missing or invalid');

  const projects = bytesToSerializableObjectArray<Project>(
    Storage.get(stringToBytes(PROJECT_KEY)),
  ).unwrap();

  return projects[u32(parseInt(index))].serialize();
}

export function getNumberOfProjects(_: StaticArray<u8>): StaticArray<u8> {
  return stringToBytes(Storage.get(NUMBER_PROJECTS_KEY));
}
