import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

// Function to generate contrasting color pairs
const generateContrastingColors = (count) => {
  const darkColors = [
    '#1E40AF', // Dark Blue
    '#4C1D95', // Dark Purple
    '#831843', // Dark Pink
    '#7C2D12', // Dark Orange
    '#064E3B', // Dark Green
    '#164E63', // Dark Cyan
    '#581C87', // Dark Violet
    '#831843', // Dark Rose
    '#1F2937', // Dark Gray
    '#92400E', // Dark Amber
  ]

  const lightColors = [
    '#93C5FD', // Light Blue
    '#DDD6FE', // Light Purple
    '#FCE7F3', // Light Pink
    '#FFEDD5', // Light Orange
    '#A7F3D0', // Light Green
    '#A5F3FC', // Light Cyan
    '#EDE9FE', // Light Violet
    '#FFE4E6', // Light Rose
    '#F3F4F6', // Light Gray
    '#FDE68A', // Light Amber
  ]

  const colors = []
  for (let i = 0; i < count; i++) {
    const index = i % darkColors.length
    colors.push(i % 2 === 0 ? darkColors[index] : lightColors[index])
  }
  
  // Shuffle the colors array to make it random
  return colors.sort(() => Math.random() - 0.5)
}

/**
 * ChartJsPieChart
 * Props:
 *  - data: Array of objects, each with { name, value }
 *
 * Example sampleData (Top 10 items):
 */
export const samplePieData = [
  { name: 'Product A', value: 45 },
  { name: 'Product B', value: 38 },
  { name: 'Product C', value: 32 },
  { name: 'Product D', value: 27 },
  { name: 'Product E', value: 23 },
  { name: 'Product F', value: 18 },
  { name: 'Product G', value: 15 },
  { name: 'Product H', value: 12 },
  { name: 'Product I', value: 8 },
  { name: 'Product J', value: 5 },
]

const ChartJsPieChart = ({ data = samplePieData, title = String, labels = [], pieValue = [] }) => {
  // const labels = data.map(item => item.name)
  // const values = data.map(item => item.value)

  const chartData = {
    labels,
    datasets: [
      {
        data: pieValue,
        backgroundColor: generateContrastingColors(pieValue.length),
        borderWidth: 0,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 16,
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        boxPadding: 8,
        usePointStyle: true,
      },
    },
  }

  return (
    <div>
      {/* Title outside the chart's box */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      {/* Give this div a real height */}
      <div style={{ width: '100%', height: '40vh' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}

export default ChartJsPieChart
