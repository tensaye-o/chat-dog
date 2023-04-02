import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const random = (min: number, max: number) => () =>
  ~~(Math.random() * (max - min + 1)) + min

export const randomize = random(1, 20)
