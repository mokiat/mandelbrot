import { rgb } from '../Graphics/Color';

const createColor = (iteration, iterations) => {
  const beta = iteration / iterations;

  const red = Math.pow(beta, 2);
  const green = Math.abs(Math.sin(3 * Math.PI * beta));
  const blue = Math.abs(Math.cos(0.5 * Math.PI * beta));

  const brightness = 1.0 - 15.0 / (25.0 + beta * 500.0);
  return rgb(
    Math.min(red * brightness, 1.0),
    Math.min(green * brightness, 1.0),
    Math.min(blue * brightness, 1.0)
  );
};

export const createPalette = (iterations) => {
  const colors = [];
  colors.push(rgb(0.0, 0.0, 0.0));
  for (let i = 1; i <= iterations; i++) {
    colors.push(createColor(i, iterations));
  }

  return (iteration) => {
    return colors[iteration + 1];
  };
};
