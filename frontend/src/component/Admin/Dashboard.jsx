import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../more/Metadata.js";
import Loading from "../../more/Loader.js";
import { getAdminProduct } from "../../actions/ProductActions.js";
import { getAllOrders } from "../../actions/OrderAction.js";
import { getAllUsers } from "../../actions/userAction.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);

  const { orders } = useSelector((state) => state.AllOrders);

  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["#3BB77E"],
        hoverBackgroundColor: ["#3BB77E"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Not Available", "InStocAvilablek"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="dashboard">
          <MetaData title="Dashboard" />
          <Sidebar />

          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>

            {/* Widget small */}

            <div className="featured">
              <div className="featuredItem">
                <a href="/admin/products">
                  <span className="featuredTitle">Product</span>
                </a>
                <div className="featuredSalesContainer">
                  <span className="faeaturedMoney">
                    {products && products.length}
                  </span>

                </div>
                <span className="featuredSab">Total number of Product</span>
              </div>

              <div className="featuredItem">
                <a href="/admin/products">
                  <span className="featuredTitle">Sales</span>
                </a>
                <div className="featuredSalesContainer">
                  <span className="faeaturedMoney">
                    {orders && orders.length}
                  </span>
                </div>
                <span className="featuredSab">Total number of orders</span>
              </div>

              <div className="featuredItem">
                <span className="featuredTitle">Users</span>
                <div className="featuredSalesContainer">
                  <span className="faeaturedMoney">
                    {users && users.length}
                  </span>

                </div>
                <span className="featuredSab">Total number of users</span>
              </div>
            </div>
            <br></br>

            <div className="chart">
              <Line data={lineState} />
            </div>

          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;
