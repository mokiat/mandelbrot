import { rgb } from '../Graphics/Color';

const createColor = (iteration) => {
  const colorAmount = 1.0 - 30.0 / (30.0 + iteration);
  const threshold = 1.0 - 250.0 / (250.0 + iteration);
  const gradient =
    (0.5 + 0.5 * Math.sin((threshold * 10.0 * Math.PI) / 2.0)) * colorAmount;
  return rgb(gradient, gradient, 0.3 + gradient * 0.7);
};

export const createPalette = (iterations) => {
  const colors = [];
  colors.push(rgb(0.0, 0.0, 0.0));
  for (let i = 0; i < iterations; i++) {
    colors.push(createColor(i));
  }

  return (iteration) => {
    return colors[iteration + 1];
  };
};
