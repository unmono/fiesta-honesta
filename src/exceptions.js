export class GameIsClosedError extends Error {
  constructor (message) {
    super(message);
    this.name = 'GameIsClosedError'
  }
}

export class GameIsOpenError extends Error {
  constructor (message) {
    super(message);
    this.name = 'GameIsOpenError';
  }
}

export class PlayerCookieError extends Error {
  constructor (message) {
    super(message);
    this.name = 'PlayerCookieError'
  }
}

export class GameLogicError extends Error {
  constructor (message) {
    super(message);
    this.name = 'GameLogicError'
  }
}

export class NotFoundError extends Error {
  constructor (message) {
    super(message);
    this.name = 'NotFoundError';
  }
}