import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";
import { API_DASHBOARD_COUNT } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";

const RevenueBarChart = ({ height = 400 }) => {
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const [chartData, setChartData] = useState([]);

  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(API_DASHBOARD_COUNT);
        const data = response?.data?.chart_data || {};

        console.log("data", data)
        const formattedData = Object.keys(monthMap).map((monthKey) => data[monthKey] || 0);
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: "Revenue",
      data: chartData,
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#4669FA"],
    },
    xaxis: {
      categories: Object.values(monthMap),
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
    },
    title: {
      text: "Monthly Revenue",
      align: "left",
      offsetX: isRtl ? "0%" : 0,
      style: {
        fontSize: "20px",
        fontWeight: "500",
        fontFamily: "Inter",
        color: isDark ? "#fff" : "#0f172a",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `$ ${val} thousands`,
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
    },
    colors: ["#4669FA"],
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  return (
    <div>
      <Chart
        options={{
          ...options,
          chart: { type: "bar", toolbar: { show: false } },
          plotOptions: {
            bar: {
              columnWidth: "50%",
              // borderRadius: 4,
            },
          },
        }}
        series={series}
        type="bar"
        height={height}
      />

    </div>
  );
};

export default RevenueBarChart;
