// client/src/components/ProgressChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ProgressChart({ workouts }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!workouts || workouts.length === 0) return;

    const sorted = [...workouts].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const labels = sorted.map(w => w.date);
    const data = sorted.map(w => w.sets * w.reps * w.weight);

    const ctx = canvasRef.current.getContext('2d');
    if (canvasRef.current._chart) {
      canvasRef.current._chart.destroy();
    }

    canvasRef.current._chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Workout Volume',
            data,
            tension: 0.3
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Volume' } }
        }
      }
    });
  }, [workouts]);

  return <canvas ref={canvasRef} />;
}
