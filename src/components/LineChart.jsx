import React from "react";
import { Line } from "react-chartjs-2";
import { Col, Row, Typography } from "antd";
import millify from "millify";
import {
  Chart as ChartJS,
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend, 
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const coinPrice = [];
  const coinTimestamp = [];

  const historyData = coinHistory?.data?.history;

  if (historyData) {
    for (let i = 0; i < historyData.length; i += 1) {
      coinPrice.push(historyData[i].price);
      coinTimestamp.push(
        new Date(historyData[i].timestamp * 1000).toLocaleDateString()
      );
    }
  }

  coinPrice.reverse();
  coinTimestamp.reverse();

  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: "Price In USD",
        data: coinPrice,
        fill: false, // Don't fill the area under the line
        backgroundColor: "#0071bd", // Color of the line
        borderColor: "#0071bd", // Color of the line
        tension: 0.1, // Adds a slight curve to the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index", 
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `$ ${millify(context.parsed.y)}`; // Format tooltip values
            }
            return label;
          },
          title: function (context) {
            return context[0].label; // Display the timestamp as the tooltip title
          },
        },
      },
      legend: {
        display: true, // Show the "Price In USD" legend
        position: "top", // Position the legend at the top of the chart
      },
      title: {
        display: true, // Show a title directly on the chart
        text: `${coinName} Price Chart`, // Use the coinName for the title
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        type: "linear", 
        beginAtZero: true, 
        ticks: {
          callback: function (value) {
            return `$ ${millify(value)}`; 
          },
          autoSkip: true, 
          maxRotation: 0, 
          minRotation: 0,
        },
      },
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxRotation: 45, 
          minRotation: 0,
        },
      },
    },
  };

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart
        </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            Change: {coinHistory?.data?.change}%
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: $ {currentPrice}
          </Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

export default LineChart;
