
// solution I would've used day-to-day work - reliable, short syntax, no brainer
function easy (array) {
    return [...new Set(array)];
}

function relevant (array) {
    // not using array.indexOf since it uses === for comparison rather than Object.is -
    // it would not uniquify NaN's which are commor error result, and this could lead to major
    // failures, e.g. excessive memory use where programmer would like to uniquify big array
    // and alter it later multiple times

    function liberalIsInArray (a, item) {
        for (let index = 0; index < a.length; index++) {
            const currentItem = a[index];
            console.log(currentItem);
            
            if (Object.is(currentItem, item)) {
                return true;
            }
        }

        return false;
    }

    const unique = [];

    array.forEach(element => {
        if (!liberalIsInArray(unique, element)) {
            unique.push(element);
        }
    });

    return unique;
}

module.exports = [
    easy,
    relevant
]