// components/TaskCard/TaskCard.js
import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onSelect, neonColor }) => {
    return (
        <div
            className="task-card"
            onClick={() => onSelect(task)}
            style={{
                boxShadow: `0 0 0px ${neonColor}, 0 0 0px ${neonColor}, 0 0 8px ${neonColor}`,
                border: `1px solid ${neonColor}` // Додаємо границю для підкреслення неонового ефекту
            }}
        >
            <h3>{task.name}</h3>
            <p className="card-article">{task.description}</p>
        </div>
    );
};

export default TaskCard;
