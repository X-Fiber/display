export class Helpers {
  static switchCaseChecker(cs: never): Error {
    return new Error(`Case type "${cs}" not implemented.`);
  }
}
