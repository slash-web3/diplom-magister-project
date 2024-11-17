import React, { useState, useEffect } from "react";
import init, { tsp_wasm } from "../../../wasm-tasks/TspSolve/tsp_solve.js"; // Шлях до вашого tsp_solve.js
import "./tspSolveTaskDetail.css";

const TspSolveTaskDetail = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [wasmLoaded, setWasmLoaded] = useState(false);  // Стан для відстеження завантаження WASM
    const [executionTime, setExecutionTime] = useState(null);  // Стан для збереження часу виконання
    const [minDistance, setMinDistance] = useState(null);  // Стан для збереження мінімальної відстані
    const [distances, setDistances] = useState(null); // Стан для збереження матриці відстаней

    // Завантаження WASM при першому рендері компонента
    useEffect(() => {
        const loadWasm = async () => {
            try {
                console.log("Завантаження WebAssembly...");
                await init();  // Завантаження WASM
                console.log("WebAssembly завантажено успішно!");
                setWasmLoaded(true);  // Оновлюємо стан, коли WASM завантажено
            } catch (e) {
                console.error("Помилка при завантаженні WebAssembly:", e);
                setError("Не вдалося завантажити WebAssembly.");
            }
        };

        loadWasm();
    }, []);

    // Функція для обробки натискання кнопки
    const handleSolve = async () => {
        try {
            setError(null);
            setResult(null);
            setExecutionTime(null); // Скидаємо час перед кожним новим викликом
            setMinDistance(null); // Скидаємо мінімальну відстань
            setDistances(null); // Скидаємо матрицю відстаней

            if (!wasmLoaded) {
                setError("WebAssembly не завантажено. Спробуйте ще раз.");
                return;
            }

            // Початок вимірювання часу
            const startTime = performance.now(); // Вимірюємо час до виклику функції WebAssembly

            // Викликаємо solve_tsp після успішного завантаження WASM
            const path = await tsp_wasm();  // Тепер чекаємо результат

            // Кінець вимірювання часу
            const endTime = performance.now(); // Вимірюємо час після виконання

            // Розраховуємо час виконання
            const timeTaken = endTime - startTime; // Вимірюємо в мілісекундах

            console.log("Результат шляху:", path);

            // path[0] - оптимальний маршрут
            // path[1] - мінімальна відстань
            // path[2] - матриця відстаней
            setResult(path[0]);  // Містить оптимальний маршрут
            setExecutionTime(timeTaken);  // Зберігаємо час виконання
            setMinDistance(path[1]);  // Мінімальна відстань
            setDistances(path[2]);  // Матриця відстаней

        } catch (e) {
            console.error("Помилка виконання:", e);
            setError("Сталася помилка під час виконання.");
        }
    };

    // Функція для форматування та виведення матриці
    const renderMatrix = () => {
        if (!distances) return null;
        return (
            <table className="tsp-matrix">
                <tbody>
                    {distances.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>{cell.toFixed(1)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="tsp-container">
            <h1 className="tsp-title">Задача комівояжера</h1>
            <form
                className="tsp-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSolve();
                }}
            >
                <button type="submit" className="tsp-button" disabled={!wasmLoaded}>
                    Запустити задачу
                </button>
            </form>

            {error && <div className="tsp-error">{error}</div>}

            {/* Виведення матриці відстаней перед результатом */}
            {distances && (
                <div className="tsp-matrix-container">
                    <h2>Матриця відстаней:</h2>
                    {renderMatrix()}
                </div>
            )}

            {result && (
                <div className="tsp-result">
                    <h2>Результат:</h2>
                    <p>
                        Оптимальний маршрут: {result.join(" → ")}
                    </p>
                    {minDistance !== null && (
                        <p>
                            Мінімальна відстань: {minDistance.toFixed(2)} км
                        </p>
                    )}
                </div>
            )}

            {executionTime !== null && (
                <p>Час виконання: {executionTime.toFixed(2)} мс</p>
            )}
        </div>
    );
};

export default TspSolveTaskDetail;
