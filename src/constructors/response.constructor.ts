export class ResponseConstructor<T> {
  private success: boolean;
  private message: string;
  private data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T): ResponseConstructor<T> {
    return new ResponseConstructor<T>(true, "Success", data);
  }

  static error<T>(message: string): ResponseConstructor<T> {
    return new ResponseConstructor<T>(false, message);
  }

}
