import { Args, Result, Serializable } from '@massalabs/as-types';

export class Project implements Serializable {
  constructor(public name: string = '', public description: string = '') {}

  serialize(): StaticArray<u8> {
    return new Args().add(this.name).add(this.description).serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);
    const name = args.nextString();
    const description = args.nextString();

    if (name.isErr()) {
      return new Result(0, "Can't deserialize Name.");
    }
    if (description.isErr()) {
      return new Result(0, "Can't deserialize Description.");
    }

    this.name = name.unwrap();
    this.description = description.unwrap();

    return new Result(args.offset);
  }
}
