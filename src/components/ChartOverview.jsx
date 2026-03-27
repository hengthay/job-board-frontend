import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

// To created charts and register component
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)
const ChartOverview = ({ dataValues }) => {

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
        backgroundColor: '#3b82f6', // Tailwind Blue-500
        borderRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Vital for the chart to fill your container
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className='h-80 w-full'>
      <Bar data={data} options={options} />
    </div>
  )
}

export default ChartOverview