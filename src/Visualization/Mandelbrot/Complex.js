export default class ComplexNumber {
  constructor(real = 0.0, imaginary = 0.0) {
    this.real = real;
    this.imaginary = imaginary;
  }

  getReal() {
    return this.real;
  }

  setReal(value) {
    this.real = value;
  }

  getImaginary() {
    return this.imaginary;
  }

  setImaginary(value) {
    this.imaginary = value;
  }

  setTo(other) {
    this.real = other.getReal();
    this.imaginary = other.getImaginary();
  }

  getLengthSquared() {
    return this.real * this.real + this.imaginary * this.imaginary;
  }

  inc(other) {
    this.real += other.getReal();
    this.imaginary += other.getImaginary();
  }

  dec(other) {
    this.real -= other.getReal();
    this.imaginary -= other.getImaginary();
  }

  square() {
    const newReal = this.real * this.real - this.imaginary * this.imaginary;
    const newImaginary = 2.0 * this.real * this.imaginary;
    this.real = newReal;
    this.imaginary = newImaginary;
  }
}
