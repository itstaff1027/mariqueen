import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const RevenueBarChart = ({ data = [], title = String, chartDataLabel = [], labels = [], dataValues = [] }) => {
  // Extract labels and dataset
  // const labels = data.map(item => item.name)
  // const uvData = data.map(item => item.uv)

  const chartData = {
    labels,
    datasets: [
      {
        label: chartDataLabel,
        data: dataValues,
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Tailwind indigo-500 semi-opaque
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        boxPadding: 8,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', padding: 8 },
      },
      y: {
        grid: {
          drawBorder: false,
          color: 'rgba(229, 231, 235, 0.5)', // Tailwind gray-200
        },
        ticks: { color: '#6b7280', padding: 8 },
      },
    },
  }

  return (
    <div style={{ width: '100%', height: '30vh' }}>
        <h1>{title}</h1>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default RevenueBarChart
