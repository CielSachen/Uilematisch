import { createCanvas } from 'canvas';
import type { ColorResolvable } from 'discord.js';

export const bot: ColorResolvable = '#FF6600';

export const distube: ColorResolvable = '#ED4245';

/** RGB color values arranged in an array. */
export type RGB = [
  red: number,
  green: number,
  blue: number,
];

/**
 * Gets the RGB values of a color using its decimal value.
 * @param decimal The decimal value of the color.
 * @returns The RGB values of the color.
 */
export const getRGB = (decimal: number): RGB => {
  const red = Math.floor(decimal / (256 * 256));
  const green = Math.floor(decimal / 256) % 256;
  const blue = decimal % 256;

  return [
    red,
    green,
    blue,
  ];
};

/**
 * Creates an image of a single color through {@link https://github.com/Automattic/node-canvas Canvas}
 * using its hexadecimal value.
 * @param hexadecimal The full hexadecimal value of the color.
 * @param width The width of the created image.
 * @param height The height of the created image.
 * @returns The created image of the color.
 */
export const createColorImage = (hexadecimal: string, width: number, height: number) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = hexadecimal;

  ctx.fillRect(0, 0, width, height);

  return canvas.toBuffer();
};
