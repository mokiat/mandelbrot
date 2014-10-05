describe("ClipArea", function() {

    var clipArea;

    describe("when a ClipArea has been created with initial values", function() {

        beforeEach(function() {
            clipArea = new graphics.ClipArea(200, 100, 400, 300);
        });

        it("should be possible to get X", function() {
            expect(clipArea.getX()).toEqual(200);
        });

        it("should be possible to get Y", function() {
            expect(clipArea.getY()).toEqual(100);
        });

        it("should be possible to get Width", function() {
            expect(clipArea.getWidth()).toEqual(400);
        });

        it("should be possible to get height", function() {
            expect(clipArea.getHeight()).toEqual(300);
        });

    });
});