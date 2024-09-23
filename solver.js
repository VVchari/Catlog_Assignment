const fs = require('fs');
function decode(value, base) {
  return parseInt(value, base);
}

function gaussianElimination(matrix, results) {
  const n = matrix.length;

  // Forward elimination
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const factor = matrix[j][i] / matrix[i][i];
      for (let k = i; k < n; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      results[j] -= factor * results[i];
    }
  }

  // Backward substitution
  const coefficients = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    coefficients[i] = results[i];
    for (let j = i + 1; j < n; j++) {
      coefficients[i] -= matrix[i][j] * coefficients[j];
    }
    coefficients[i] /= matrix[i][i];
  }

  return coefficients;
}


function readJsonAndSolve() {
  fs.readFile("data.json", 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const jsonData = JSON.parse(data);

    const points = [];
    for (const key in jsonData) {
      if (key !== "keys") {
        const x = parseInt(key);
        const base = parseInt(jsonData[key]["base"]);
        const yEncoded = jsonData[key]["value"];
        const y = decode(yEncoded, base);
        points.push([x, y]);
      }
    }
    const n = jsonData.keys.n; 
    const k = jsonData.keys.k; 
    const matrix = Array(k).fill(null).map(() => Array(k).fill(0));
    const results = Array(k).fill(0);

    for (let i = 0; i < k; i++) {
      const [x, y] = points[i];
      for (let j = 0; j < k; j++) {
        matrix[i][j] = Math.pow(x, k - j - 1); 
      }
      results[i] = y; 
    }
    const coefficients = gaussianElimination(matrix, results);
    console.log("The constant term (c) is:", coefficients[k - 1]);
  });
}
readJsonAndSolve();
