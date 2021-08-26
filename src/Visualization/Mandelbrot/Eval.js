import ComplexNumber from './Complex';

// acts as cache to prevent unnecessary allocations
const evaluation = new ComplexNumber();

export const evalEscapeIteration = (complex, iterations) => {
  evaluation.setTo(complex);
  for (let i = 0; i < iterations; i++) {
    if (evaluation.getLengthSquared() >= 4.0) {
      return i;
    }
    evaluation.square();
    evaluation.inc(complex);
  }
  return -1;
};
