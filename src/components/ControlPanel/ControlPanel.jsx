import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import TaskDetailPanel from '../TaskDetailPanel/TaskDetailPanel';

const tasks = [
    { id: 1, name: 'Числа Фібоначчі ( метод рекурсивних обчислень)', description: 'У цій задачі використовується проста рекурсивна реалізація алгоритму обчислення чисел Фібоначчі, яка обчислює кожне число як суму двох попередніх. Цей підхід є інтуїтивно зрозумілим, але неефективним, що призводить до експоненційного росту часу виконання.', color: '#fff' },
    { id: 2, name: 'Задача комівояжера методом повного перебору', description: 'Реалізація вирішення задачі комівояжера перебірним методом (brute-force approach). Це класичний метод, який гарантує правильність рішення, але має дуже високу обчислювальну складність  O(n!).', color: '#fff' },
    { id: 3, name: 'Задача генерації зображення з трасуванням променів', description: 'Реалізація обчислення кольорів пікселів на зображенні, перевіряючи перетин променів із заданою сферою в тривимірному просторі, та поверення масиву пікселів для візуалізації.', color: '#fff' },
    { id: 4, name: 'Задача знаходження добутку великих матриць', description: 'Реалізація обчислення добутку двох квадратних матриць розміром N x N', color: '#fff' },
    { id: 5, name: 'Wokr in progress', color: '#fff' },
    { id: 6, name: 'Wokr in progress', color: '#fff' },
    { id: 7, name: 'Wokr in progress', color: '#fff' },
];

const ControlPanel = ({ onRunTest, loading }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [method, setMethod] = useState("wasm"); // Дефолтно WebAssembly

    const handleSelectTask = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDetailPanel = () => {
        setSelectedTask(null);
    };

    return (
        <div className="control-panel">
            <div className="task-cards">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onSelect={handleSelectTask} neonColor={task.color} />
                ))}
            </div>
            {selectedTask && (
                <TaskDetailPanel
                    task={selectedTask}
                    onRunTest={onRunTest}
                    loading={loading}
                    onClose={handleCloseDetailPanel}
                />
            )}
        </div>
    );
};

export default ControlPanel;