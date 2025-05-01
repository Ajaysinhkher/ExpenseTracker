// src/components/MonthlyPieChart.jsx
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import dayjs from 'dayjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyPieChart = () => {
  const { groups } = useSelector((state) => state.group);

  const monthlyData = useMemo(() => {
    const monthMap = {};

    groups.forEach(group => {
      (group.expenses || []).forEach(expense => {
        const month = dayjs(expense.date).format("MMM"); // e.g., "Apr"
        const amount = parseFloat(expense.amount);

        if (monthMap[month]) {
          monthMap[month] += amount;
        } else {
          monthMap[month] = amount;
        }
      });   
    });

    const labels = Object.keys(monthMap);
    const data = Object.values(monthMap);

    return { labels, data };
  }, [groups]);

  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#C9CBCF', '#5DADE2',
          '#45B39D', '#AF7AC5', '#F5B041', '#DC7633',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Monthly Expense Distribution' },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default MonthlyPieChart;
