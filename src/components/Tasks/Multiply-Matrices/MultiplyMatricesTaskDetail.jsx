import React, { useState } from 'react';
import init, { multiply_matrices } from "../../../wasm-tasks/Multiply-Matrices/matrices_mult_wasm.js";
import { multiplyMatricesJS } from '../../../js-tasks/Multiply-Matrices/multiply_matrices.js'; // Чиста JS реалізація
import "./MultiplyMatricesTaskDetail.css";

const MultiplyMatricesTaskDetail = ({ method, setMethod, inputValue, setInputValue, onRunTest, loading }) => {
    const [result, setResult] = useState("");
    const [executionTime, setExecutionTime] = useState("");

    const generateMatrix = (size) => {
        const matrix = new Float32Array(size * size);
        for (let i = 0; i < size * size; i++) {
            matrix[i] = Math.random() * 10; // Генеруємо випадкові числа
        }
        return matrix;
    };

    const handleMultiplyMatrices = async () => {
        const size = parseInt(inputValue, 10);
        if (isNaN(size) || size <= 0) {
            alert("Please enter a valid matrix size!");
            return;
        }

        const matrixA = generateMatrix(size);
        const matrixB = generateMatrix(size);
        const block_size = 40; // розмір блоку для оптимізації

        let result;
        let startTime, endTime;

        if (method === 'wasm') {
            // Ініціалізація WebAssembly
            await init();

            startTime = performance.now();
            result = multiply_matrices(matrixA, matrixB, size, block_size);
            endTime = performance.now();
        } else {
            // Чиста реалізація JavaScript
            startTime = performance.now();
            result = multiplyMatricesJS(matrixA, matrixB, size, block_size);
            endTime = performance.now();
        }

        const executionTime = endTime - startTime;

        setResult(`Успішно пораховано матрицю розміром ${size}x${size}`);
        setExecutionTime(`Витрачено часу на підрахунок: ${executionTime.toFixed(4)} мс`);
    };

    return (
        <div className="task-detail">
            <div className="input-section">
                <label htmlFor="matrixSize">Розмір матриці:</label>
                <input
                    id="matrixSize"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter matrix size"
                />
            </div>

            <div className="method-selection">
                <h2>Оберіть метод виконання:</h2>
                <label className="switch">
                    <input
                        type="radio"
                        name="method"
                        value="wasm"
                        checked={method === "wasm"}
                        onChange={() => setMethod("wasm")}
                    />
                    <span className="slider"></span>
                    WebAssembly
                </label>
                <label className="switch">
                    <input
                        type="radio"
                        name="method"
                        value="js"
                        checked={method === "js"}
                        onChange={() => setMethod("js")}
                    />
                    <span className="slider"></span>
                    JavaScript
                </label>
            </div>

            <button id="multiplyButton" onClick={handleMultiplyMatrices}>
                Згенерувати та порахувати матриці
            </button>

            <div id="resultSection">
                <h2>Результат виконання</h2>
                <p>{result}</p>
            </div>

            <div id="timeSection">
                <h2>Час виконання</h2>
                <p>{executionTime}</p>
            </div>
        </div>
    );
};

export default MultiplyMatricesTaskDetail;
