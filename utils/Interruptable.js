class Interruptable {
  constructor() {
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
    if (this._timer) {
      clearTimeout(this._timer);
      if (!this._reject) {
        throw new Exception('_reject not set');
      }
      this._reject(1);
    }
  }

  get promise() {
    return this._promise;
  }

  sleep(duration) {
    this.timerHolder = {};
    return this._promise = new Promise((resolve, reject) => {
      if (this.cancelled) {
        return reject();
      }
      this._reject = reject;
      this._timer = setTimeout(() => {
        if (this.cancelled) {
          reject();
        } else {
          resolve();
        }
      }, duration);
    });
  }
}
module.exports = Interruptable;
