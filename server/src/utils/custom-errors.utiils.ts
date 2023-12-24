export class MissingInputParametersError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'MissingInputParametersError';
    }
  }