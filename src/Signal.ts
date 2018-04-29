/* tslint:disable no-any */
export default class Signal {

  private listeners: any[];

  constructor() {
    this.listeners = [];
  }

  public addListener(listener: any) {
    this.listeners.push(listener);
  }

  public removeListener(listener: any) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  public dispatch(...args: any[]) {
    this.listeners.forEach(listener => {
      listener(...args);
    });
  }
}