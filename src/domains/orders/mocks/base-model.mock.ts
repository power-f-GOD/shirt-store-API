import { Order } from '../schemas';

export class BaseModelMock<ModelSchema extends { _id?: string } = Order> {
  documentMock: ModelSchema;

  constructor(documentMock: ModelSchema) {
    this.documentMock = documentMock;
  }

  find() {
    return {
      sort() {
        return this;
      },
      skip() {
        return this;
      },
      populate() {
        return this;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      select(_selection: string) {
        return this;
      },
      limit() {
        return this;
      },
      exec: jest.fn().mockResolvedValue(this.documentMock)
    };
  }

  findById(id: string) {
    return {
      ...this.find(),
      exec: jest.fn(() =>
        [this.documentMock].find((document) => document._id === id)
      )
    };
  }

  findOne(id: string) {
    return {
      ...this.find(),
      exec: jest.fn(() =>
        [this.documentMock].find((document) => document._id === id)
      )
    };
  }
}
