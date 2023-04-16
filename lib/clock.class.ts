export const zeroPad = (num: number, digits: number = 2) => {
  let str = num.toString();
  while (str.length < digits) str = "0" + str;
  return str;
};

export const formatElapsed = (elapsed: number) => {
  const seconds = elapsed % 60;
  const minutes = Math.floor(elapsed / 60);
  return `${minutes}:${zeroPad(seconds)}`;
};

export class Clock {
  initial: number = 0;
  elapsed: number = 0;
  interval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.initial = 0;
    this.elapsed = 0;
  }

  start() {
    this.initial = Date.now();
    this.elapsed = 0;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (this.interval) clearInterval(this.interval);
  }

  resume() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.elapsed = Math.round((Date.now() - this.initial) / 1000);
  }
}
