describe("ComplexNumber", function() {

    var complexNumber;

    describe("when a ComplexNumber has been created without values", function() {

        beforeEach(function() {
            complexNumber = new mandelbrot.ComplexNumber();
        });

        it("complex number is equal to zero", function() {
            expect(complexNumber.getReal()).toBeCloseTo(0.0);
            expect(complexNumber.getImaginary()).toBeCloseTo(0.0);
        });

        describe("when real and imaginary values have been set", function() {
            beforeEach(function() {
                complexNumber.setReal(1.5);
                complexNumber.setImaginary(0.5);
            });

            it("they should be accessible", function() {
                expect(complexNumber.getReal()).toBeCloseTo(1.5);
                expect(complexNumber.getImaginary()).toBeCloseTo(0.5);
            });
        });

    });

    describe("when a ComplexNumber has been created with initial values", function() {
        beforeEach(function() {
            complexNumber = new mandelbrot.ComplexNumber(4.0, 3.0);
        });

        it("the values should be accessible", function() {
            expect(complexNumber.getReal()).toBeCloseTo(4.0);
            expect(complexNumber.getImaginary()).toBeCloseTo(3.0);
        });

        it("should be possible to get the squared lenght", function() {
            expect(complexNumber.getLengthSquared()).toBeCloseTo(25.0);
        });

        describe("when the ComplexNumber has been squared", function() {
            beforeEach(function() {
                complexNumber.square();
            });

            it("its values should have changed accordingly", function() {
                expect(complexNumber.getReal()).toBeCloseTo(7.0);
                expect(complexNumber.getImaginary()).toBeCloseTo(24.0);
            });
        });

        describe("when the ComplexNumber has been incremented", function() {
            beforeEach(function() {
                var other = new mandelbrot.ComplexNumber(3.0, 5.0);
                complexNumber.inc(other);
            });

            it("its values should have changed accordingly", function() {
                expect(complexNumber.getReal()).toBeCloseTo(7.0);
                expect(complexNumber.getImaginary()).toBeCloseTo(8.0);
            });
        });
        
        describe("when the ComplexNumber has been decremented", function() {
            beforeEach(function() {
                var other = new mandelbrot.ComplexNumber(3.0, 8.0);
                complexNumber.dec(other);
            });
            
            it("its values should have changed accordingly", function() {
                expect(complexNumber.getReal()).toBeCloseTo(1.0);
                expect(complexNumber.getImaginary()).toBeCloseTo(-5.0);
            });
        });
        
        describe("when the ComplexNumber has been set to match another ComplexNumber", function() {
            beforeEach(function() {
                var other = new mandelbrot.ComplexNumber(-4.0, 1.5);
                complexNumber.setTo(other);
            });
            
            it("its values should have changed accordingly", function() {
                expect(complexNumber.getReal()).toBeCloseTo(-4.0);
                expect(complexNumber.getImaginary()).toBeCloseTo(1.5);
            });
        });
    });

});
