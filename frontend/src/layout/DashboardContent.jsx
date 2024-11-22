import KycRequired from "../ui/KycRequired";
import { Line } from "react-chartjs-2";
import { useContext } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BalanceContext } from "../contexts/useGlobalContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent = () => {
  const { balanceTotal } = useContext(BalanceContext);

  // Example data for the chart
  const data = {
    labels: ["1AM", "5AM", "9AM", "1PM", "5PM", "9PM"],
    datasets: [
      {
        label: "24 hr Change",
        data: [400.25, 410.75, 415.5, 420.9, 430.8, 440.0], // replace with real data if available
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Price (USD)" } },
    },
  };

  return (
    <div>
      <div className="my-4">
        <KycRequired />
      </div>{" "}
      <div className="flex flex-wrap items-center my-12 gap-x-[13rem] gap-y-4">
        <div className="custom-bl flex flex-col">
          <span className="text-3xl font-bold">Balance </span>
          <span className="text-xl">${balanceTotal}</span>
        </div>
        <div className="custom-bl flex flex-col">
          <span className="text-3xl font-bold">24hr Change / Investment</span>
          <span className="text-xl">$5,000 (+$400.34)</span>
        </div>
      </div>
      <div>
        <span className="text-3xl font-bold">24 hr Change</span>
        {/* <div>Chart</div> */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardContent;
