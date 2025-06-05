import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import {
  FaUsers,
  FaShoppingCart,
  FaFileInvoice,
  FaBoxes,
  FaTruck,
  FaReceipt,
  FaMoneyBillWave 
} from "react-icons/fa";
import { API_DASHBOARD_COUNT } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import RevenueBarChart from "./Revenue-bar-chart";


const Dashboard = () => {
  const [allData, setAllData] = useState({});

  console.log(allData)
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await Api.get(`${API_DASHBOARD_COUNT}`);
      setLoading(false);
      if (response.data   ) {
        setAllData(response.data);
      } else {
        setAllData({});
      }
    } catch (error) {
      console.error("API fetch error:", error);
      setAllData({});
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const cards = [
    { icon: <FaUsers size={28} />, title: "Total Customers", count: allData.customer_count || 0 },
    { icon: <FaShoppingCart size={28} />, title: "Total Products", count: allData.product_count || 0 },
    { icon: <FaFileInvoice size={28} />, title: "Total  Suppliers", count: allData.supplier_count || 0 },
     { icon: <FaMoneyBillWave size={28} />, title: "Total Revenue", count: allData.total_revenue || 0 }, 
    // { icon: <FaBoxes size={28} />, title: "Raw Material", count: allData.spare_part_count || 0 },
    // { icon: <FaTruck size={28} />, title: "Material Order", count: allData.order_count || 0 },
    // { icon: <FaReceipt size={28} />, title: "Invoice", count: allData.invoice_count || 0 },
  ];

  return (<>
    <div>
      <Breadcrumbs title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {cards.map(({ icon, title, count }, i) => (
          <Card
            key={i}
            title=""
            className="flex flex-col items-center space-y-2"
            bodyClass="flex flex-col items-center space-y-2 p-6"
          >
            <div className="text-primary">{icon}</div>
            <div className="text-lg font-medium">{title}</div>
            <div className="text-3xl font-bold">{loading ? "..." : count}</div>
          </Card>
        ))}
      </div>
    </div>

    <div>

      <Card>
        <RevenueBarChart />
      </Card>
    </div>
 </> );
};

export default Dashboard;
