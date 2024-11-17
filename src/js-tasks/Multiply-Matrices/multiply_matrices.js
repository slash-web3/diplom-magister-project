// multiply_matrices_js.js

function multiplyMatricesJS(a, b, n, blockSize) {
    const result = new Array(n * n).fill(0); // Результат множення, заповнений нулями

    // Розбиття на блоки
    for (let i = 0; i < n; i += blockSize) {
        for (let j = 0; j < n; j += blockSize) {
            for (let k = 0; k < n; k += blockSize) {
                const iMax = Math.min(i + blockSize, n);
                const jMax = Math.min(j + blockSize, n);
                const kMax = Math.min(k + blockSize, n);

                for (let ii = i; ii < iMax; ii++) {
                    for (let jj = j; jj < jMax; jj++) {
                        let sum = 0;

                        for (let kk = k; kk < kMax; kk++) {
                            sum += a[ii * n + kk] * b[kk * n + jj];
                        }

                        result[ii * n + jj] += sum;
                    }
                }
            }
        }
    }

    return result;
}

export { multiplyMatricesJS };
