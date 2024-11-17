import React, { useState, useEffect } from 'react';
import './FibonacciTaskDetail.css';
import { fibonacci as fibonacciJs } from '../../../js-tasks/Fibonacci/fibonacci.js';
import Chart from '../../../components/Chart/Chart'; // Імпортуємо компонент Chart

const FibonacciTaskDetail = ({ method, setMethod, inputValue, setInputValue, onRunTest, loading }) => {
    const [wasmModule, setWasmModule] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState({ wasm: null, js: null }); // Результати
    const [durations, setDurations] = useState({ wasm: null, js: null }); // Час виконання
    const [lastCalculatedMethod, setLastCalculatedMethod] = useState(null); // Останній обчислений метод

    // Завантаження WebAssembly модуля
    useEffect(() => {
        const loadWasmModule = async () => {
            if (wasmModule) return;

            try {
                console.log("Завантаження модуля WebAssembly...");
                const wasm = await import('../../../wasm-tasks/Fibonacci/fibonacci_wasm.js');
                await wasm.default(); // Ініціалізація модуля
                setWasmModule(wasm); // Зберігаємо модуль
                console.log("Модуль WebAssembly успішно завантажено.");
            } catch (error) {
                console.error("Помилка завантаження модуля WebAssembly:", error);
            }
        };

        loadWasmModule();
    }, [wasmModule]);

    // Обробка кнопки "Порахувати"
    const handleRunTest = async () => {
        setIsCalculating(true);
        const n = parseInt(inputValue, 10);

        if (isNaN(n) || n < 0) {
            alert("Введіть коректне додатне число.");
            setIsCalculating(false);
            return;
        }

        const newResults = { wasm: null, js: null };
        const newDurations = { wasm: null, js: null };

        // Виконання Wasm
        if (method === 'wasm' || method === 'both') {
            if (wasmModule && typeof wasmModule.fibonacci === 'function') {
                try {
                    console.log("Викликаємо wasm.fibonacci(", n, ")");
                    const startTimeWasm = performance.now();
                    let wasmResult = wasmModule.fibonacci(n); // Викликаємо WebAssembly функцію

                    // Перетворюємо BigInt у число
                    if (typeof wasmResult === 'bigint') {
                        console.log("Перетворюємо BigInt у Number");
                        wasmResult = Number(wasmResult); // Конвертуємо в число
                    }

                    newResults.wasm = wasmResult;
                    newDurations.wasm = performance.now() - startTimeWasm;
                    console.log("Результат wasm (після перетворення):", newResults.wasm);
                } catch (error) {
                    console.error("Помилка виконання wasm.fibonacci:", error);
                }
            } else {
                console.error("Модуль WebAssembly не завантажено або функція недоступна.");
            }
        }

        // Виконання JS
        if (method === 'js' || method === 'both') {
            try {
                console.log("Викликаємо js.fibonacci(", n, ")");
                const startTimeJs = performance.now();
                newResults.js = fibonacciJs(n); // Викликаємо JS-функцію
                newDurations.js = performance.now() - startTimeJs;
                console.log("Результат js:", newResults.js);
            } catch (error) {
                console.error("Помилка виконання js.fibonacci:", error);
            }
        }

        // Оновлення стану
        setResults(newResults);
        setDurations(newDurations);
        setLastCalculatedMethod(method);
        setIsCalculating(false);

        // Викликаємо onRunTest для активного методу
        if (method !== 'both' && newResults[method] !== null) {
            onRunTest(newResults[method]);
        }
    };

    // Обробка введення числа
    const handleInputChange = (e) => setInputValue(e.target.value);

    return (
        <div className="task-detail-body">
            <div className="fibonacci-data-area">
                <div className="task-input-section">
                    <label htmlFor="fibonacci-input">Введіть значення N:</label>
                    <input
                        type="number"
                        id="fibonacci-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Наприклад, 10"
                    />
                </div>

                <div className="task-method-section">
                    <label>
                        WebAssembly (Wasm)
                        <div className="switch">
                            <input
                                type="radio"
                                name="method"
                                checked={method === "wasm"}
                                onChange={() => setMethod("wasm")}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                    <label>
                        JavaScript
                        <div className="switch">
                            <input
                                type="radio"
                                name="method"
                                checked={method === "js"}
                                onChange={() => setMethod("js")}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                    <label>
                        Both
                        <div className="switch">
                            <input
                                type="radio"
                                name="method"
                                checked={method === "both"}
                                onChange={() => setMethod("both")}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                </div>
            </div>

            <button
                className="fibonacci-button"
                onClick={handleRunTest}
                disabled={loading || isCalculating}
            >
                {isCalculating ? 'Підрахунок...' : 'Порахувати'}
            </button>

            {/* Виведення результатів */}
            {lastCalculatedMethod && lastCalculatedMethod !== 'both' && results[lastCalculatedMethod] !== null && (
                <>
                    <div className="fibonacci-result">
                        <h3>Результат: {results[lastCalculatedMethod]}</h3>
                    </div>
                    <div className="fibonacci-duration">
                        <h4>Час виконання: {durations[lastCalculatedMethod]?.toFixed(2)} мс</h4>
                    </div>
                </>
            )}

            {lastCalculatedMethod === 'both' && (
                <div>
                    <div className="fibonacci-result-both">
                        <p>Результат</p>
                        <div className="fibonacci-both-values">
                            <div>WASM: {results.wasm}</div>
                            <div>JS: {results.js}</div>
                        </div>
                    </div>
                    <div className="fibonacci-duration">
                        <div className="duration-text">
                            <h4>Час виконання wasm: {durations.wasm?.toFixed(2)} мс</h4>
                            <h4>Час виконання js: {durations.js?.toFixed(2)} мс</h4>
                        </div>
                        <div className="duration-chart">
                            <Chart jsTime={durations.js} wasmTime={durations.wasm} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FibonacciTaskDetail;
