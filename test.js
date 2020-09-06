// Tests I want to write
// 1. The function returns uniqified array, e.g. f([1, 2, 2, 2]) returns [1, 2]
// 2. The function uses strict type comparison, so f([1, 2, "2", 1]) returns [1, 2, "2"] in any order
// 3. The function handles falsy types well, so f([undefined, false, null, 0, undefined])
// returns [undefined, false, null, 0] in any order
// 4. The function handles non-primitive types well
// Tests I don't care to write:
// 1. Uniquifying NaN, -0 and +0 since their comparison methods vary (Object.is vs ===) and so do their
// results

const solutions = require('./solutions');

solutions.map((unique) => {
    test(`${unique.name} function actually returns uniquified array with strict type comparison`, () => {
        const testReference = new Object();

        const correctOutput = [1, 2, "2", undefined, false, null, "undefined", testReference];
        const testInput = [
            1, 2, "2", 1, undefined, false, undefined, null, "undefined", testReference, testReference];

        output = unique(testInput);

        // let's be safe and make sure our output is actually an array, rather than an object that implements
        // a forEach method and length propety
        expect(Array.isArray(output)).toBe(true);

        // checks if contains the correct values
        correctOutput.forEach((correctValue) => {
            expect(output).toContain(correctValue);
        });

        // and only the correct values - if the above passes and the length is correct, that'll do
        // since order doesn't matter and we shouldn't test it
        expect(output.length).toBe(correctOutput.length);
    });
});