import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Chart({ jsTime, wasmTime }) {
    const data = {
        labels: ["JavaScript", "WebAssembly"],
        datasets: [
            {
                label: "Час виконання (мс)",
                data: [jsTime, wasmTime],
                backgroundColor: ["#4CAF50", "#2196F3"],
            },
        ],
    };

    return (
        <div className="chart">
            <Bar data={data} />
        </div>
    );
}

export default Chart;
