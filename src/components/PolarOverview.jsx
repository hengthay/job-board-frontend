import {
  Chart as ChartJS,
  RadialLinearScale, // Required for PolarArea
  ArcElement,        // Required for the "slices"
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  PolarAreaController,
  Title,
  Tooltip,
  Legend
);

const PolarOverview = ({ dataValues }) => {

  // Data for chart
  const data = {
    labels: ['Users', 'Profiles', 'Jobs', 'Companies', 'Types', 'Cats'],
    datasets: [
      {
        label: 'Platform Statistics',
        data: [
          dataValues.users, 
          dataValues.candidateProfiles, 
          dataValues.jobs, 
          dataValues.companies, 
          dataValues.jobTypes, 
          dataValues.jobCategories
        ],
        backgroundColor: [
          '#3b82f6', // Blue
          '#a855f7', // Purple
          '#22c55e', // Green
          '#f59e0b', // Amber
          '#06b6d4', // Cyan
          '#ef4444', // Red
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'right' // Legend is usually helpful for Polar charts
      },
    },
    scales: {
      r: { // 'r' stands for Radial scale
        ticks: { display: false }, // Hides the numbers on the rings for a cleaner look
        grid: { color: '#e5e7eb' }
      }
    }
  };

  return (
    <div className='h-80 w-full'>
      <PolarArea data={data} options={options}/>
    </div>
  )
}

export default PolarOverview