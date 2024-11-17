import React, { useEffect, useRef, useState } from "react";
import { traceRay } from "../../../js-tasks/Ray-tracing/raytracing.js"; // Функція трасування через JavaScript
import init, { trace_ray } from "../../../wasm-tasks/Ray-tracing/ray_tracing.js"; // Ініціалізація та обгортка WebAssembly
import "./RaytracingTaskDetail.css";

const RayTracingTaskDetail = ({ method, setMethod }) => {
    const canvasRef = useRef(null);
    const [performanceTime, setPerformanceTime] = useState(null); // Час виконання

    // Ініціалізація WebAssembly
    useEffect(() => {
        const initWasm = async () => {
            try {
                await init(); // Завантаження WebAssembly
                console.log("WebAssembly модуль успішно завантажено!");
            } catch (error) {
                console.error("Помилка при завантаженні WebAssembly модуля:", error);
            }
        };
        initWasm();
    }, []);

    // Генерація зображення за допомогою JavaScript
    const renderWithJavaScript = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const startTime = performance.now();

        const pixels = traceRay(canvas.width, canvas.height); // Виклик функції JavaScript
        const imgData = new ImageData(new Uint8ClampedArray(pixels), canvas.width, canvas.height);
        ctx.putImageData(imgData, 0, 0);

        const endTime = performance.now();
        setPerformanceTime((endTime - startTime).toFixed(2));
    };

    // Генерація зображення за допомогою WebAssembly
    const renderWithWasm = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const startTime = performance.now();

        const result = trace_ray(canvas.width, canvas.height); // Виклик функції WebAssembly
        const imgData = new ImageData(new Uint8ClampedArray(result), canvas.width, canvas.height);
        ctx.putImageData(imgData, 0, 0);

        const endTime = performance.now();
        setPerformanceTime((endTime - startTime).toFixed(2));
    };

    // Обробник кнопки "Запустити"
    const handleGenerate = () => {
        if (method === "js") {
            renderWithJavaScript();
        } else {
            renderWithWasm();
        }
    };

    return (
        <div className="ray-tracing-task-content">
            {/* Canvas */}
            <canvas ref={canvasRef} id="ray-tracing-canvas"></canvas>

            {/* Панель управління */}
            <div className="ray-tracing-tools">
                <div className="method-selection">
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
                </div>

                {/* Кнопка запуску */}
                <button onClick={handleGenerate} className="generate-button">
                    Запустити
                </button>

                {/* Результати продуктивності */}
                {performanceTime && (
                    <div className="performance-metrics">
                        <p>Час виконання: {performanceTime} ms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RayTracingTaskDetail;
