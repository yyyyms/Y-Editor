/* eslint-disable ts/no-explicit-any */
import { cloneDeep, isEqual, throttle } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

import type { IRGBA } from '../core/paint';

export class EventEmitter<T extends Record<string | symbol, any>> {
  private eventMap: Record<keyof T, Array<(...args: any[]) => void>>
    = {} as any;

  on<K extends keyof T>(eventName: K, listener: T[K]) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(listener);
    return this;
  }

  emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>) {
    const listeners = this.eventMap[eventName];
    if (!listeners || listeners.length === 0) {
      return false;
    }
    listeners.forEach((listener) => {
      listener(...args);
    });
    return true;
  }

  off<K extends keyof T>(eventName: K, listener: T[K]) {
    if (this.eventMap[eventName]) {
      this.eventMap[eventName] = this.eventMap[eventName].filter(
        item => item !== listener,
      );
    }
    return this;
  }
}

export function genUuid() {
  return uuidv4();
}

export function parseRGBAStr({ r, g, b, a }: IRGBA) {
  return `rgba(${r},${g},${b},${a})`;
}
export function isSameArray(a1: unknown[], a2: unknown[]) {
  if (a1.length !== a2.length) {
    return false;
  }
  const map = new Map<unknown, true>();
  for (let i = 0, len = a1.length; i < len; i++) {
    map.set(a1[i], true);
  }
  for (let i = 0, len = a2.length; i < len; i++) {
    if (!map.get(a2[i])) {
      return false;
    }
  }
  return true;
}
/**
 * 找出离 value 最近的 segment 的倍数值
 */
export function getClosestTimesVal(value: number, segment: number) {
  const n = Math.floor(value / segment);
  const left = segment * n;
  const right = segment * (n + 1);
  return value - left <= right - value ? left : right;
}
/**
 * Canvas 中绘制，必须为 x.5 才能绘制一列单独像素，
 * 否则会因为抗锯齿，绘制两列像素，且一个为半透明，导致一种模糊的效果
 *
 * 这个方法会得到值最接近的 x.5 值。
 */
export function nearestPixelVal(n: number) {
  const left = Math.floor(n);
  const right = Math.ceil(n);
  return (n - left < right - n ? left : right) + 0.5;
}

export function getDevicePixelRatio() {
  return 1;
}

export function normalizeHex(hex: string) {
  hex = hex.toUpperCase();
  const match = hex.match(/[0-9A-F]{1,6}/);
  if (!match) {
    return '';
  }
  hex = match[0];

  if (hex.length === 6) {
    return hex;
  }
  if (hex.length === 4 || hex.length === 5) {
    hex = hex.slice(0, 3);
  }
  // ABC -> AABBCC
  if (hex.length === 3) {
    return hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  // AB => ABABAB
  // A -> AAAAAA
  return hex.padEnd(6, hex);
}

export function parseHexToRGBA(hex: string): IRGBA | null {
  hex = normalizeHex(hex);
  if (!hex) {
    return null;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const aStr = hex.slice(6, 8);
  const a = aStr ? Number.parseInt(aStr, 16) / 255 : 1;
  return { r, g, b, a };
}

export { cloneDeep, isEqual, throttle };
