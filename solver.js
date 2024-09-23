const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

// Function to calculate the Lagrange interpolation polynomial
function lagrangeInterpolation(points) {
    const n = points.length;
    let c = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= (0 - points[j][0]) / (xi - points[j][0]);
            }
        }
        c += li * yi;
    }

    return c;
}

function main() {

    const inputFile = 'data1.json'; 
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;

    if (k > n) {
        console.error("Not enough roots provided");
        return;
    }

    const points = [];


    for (let key in data) {
        if (key !== 'keys') {
            const base = data[key].base;
            const value = data[key].value;
            const x = parseInt(key);
            const y = decodeValue(base, value);
            points.push([x, y]);
        }
    }

    const c = lagrangeInterpolation(points.slice(0, k));


    console.log("The constant term c is:", c);
}


main();
