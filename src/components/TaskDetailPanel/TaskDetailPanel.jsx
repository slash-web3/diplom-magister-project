import React, { useState } from "react";
import FibonacciTaskDetail from "../Tasks/FibonacciTask/FibonacciTaskDetail";
import TspSolveTaskDetail from "../Tasks/TspSolve/TspSolveTaskDetail.jsx"; // Припустимо, ви вже створили компонент для WASM
import RayTracingTaskDetail from "../Tasks/RaytracingTask/RaytracingTaskDetail.jsx"; // Імпортуємо новий компонент
import MultiplyMatricesTaskDetail from "../Tasks/Multiply-Matrices/MultiplyMatricesTaskDetail.jsx";
import "./TaskDetailPanel.css";

const TaskDetailPanel = ({ task, setEnvironment, onRunTest, loading, onClose }) => {
    const [method, setMethod] = useState("wasm"); // Дефолтно обирається WebAssembly
    const [inputValue, setInputValue] = useState(""); // Введене число для обчислень

    const renderTaskDetailContent = () => {
        switch (task.id) {
            case 1: // Fibonacci Task
                return (
                    <FibonacciTaskDetail
                        method={method}
                        setMethod={setMethod}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        onRunTest={onRunTest}
                        loading={loading}
                    />
                );
            case 2: // ТСП задача
                return (
                    <TspSolveTaskDetail
                        method={method}
                        setMethod={setMethod}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                );
            case 3: // Задача трасування променів
                return (
                    <RayTracingTaskDetail method={method} setMethod={setMethod} />
                );
            case 4: // Задача множення матриць
                return (
                    <MultiplyMatricesTaskDetail
                        method={method}
                        setMethod={setMethod}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        onRunTest={onRunTest}
                        loading={loading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="task-detail-popup">
            <div className="task-detail-content">
                <button className="close-button" onClick={onClose}>✖</button>

                <h2>{task.name}</h2>
                <p>{task.description}</p>

                {renderTaskDetailContent()}
            </div>
        </div>
    );
};

export default TaskDetailPanel;