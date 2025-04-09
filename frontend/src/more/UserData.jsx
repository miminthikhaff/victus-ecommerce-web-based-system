import React, { useState, useEffect, useRef } from "react";
import "./UserOption.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Support from "@material-ui/icons/ReportProblem";
import HeartIcon from "@material-ui/icons/FavoriteBorder";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import { ToastContainer, toast } from 'react-toastify';

const UserData = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const { favouriteItems } = useSelector((state) => state.favourite);

  const [open, setOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const scroolEffect = useRef(null);

  // ⚠️ Add scroll effect safely using useEffect
  useEffect(() => {
    const handleScroll = () => {
      const dial = document.querySelector(".speedDial");
      if (!dial) return;
      if (window.pageYOffset > 100) {
        dial.classList.add("active");
      } else {
        dial.classList.remove("active");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 💡 Navigation functions
  const dashboard = () => history.push("/dashboard");
  const home = () => history.push("/");
  const orders = () => history.push("/orders");
  const cart = () => history.push("/cart");
  const favourite = () => history.push("/favourites");
  const account = () => history.push("/me");
  const report = () => history.push("/support");
  const logoutUser = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
  };

  // ✅ Build options only when user is available
  if (!user) return null;

  const options = [
    { icon: <HomeIcon />, name: "Home", func: home },
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    {
      icon: (
        <ShoppingCartIcon
          style={{
            color: cartItems.length === 0 ? "" : "tomato",
          }}
        />
      ),
      name: `Cart (${cartItems.length})`,
      func: cart,
    },
    {
      icon: (
        <HeartIcon
          style={{
            color: favouriteItems.length === 0 ? "" : "tomato",
          }}
        />
      ),
      name: `Favourite (${favouriteItems.length})`,
      func: favourite,
    },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <Support />, name: "Report us", func: report },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  // ✅ Insert dashboard based on role
  if (user.role === "admin" || user.role === "Creator") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        ref={scroolEffect}
        icon={
          <img
            className="speedDialIcon"
            src={user?.avatar?.url || "/profile.png"}
            alt="Profile"
            style={{ position: "fixed" }}
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={false}
          />
        ))}
      </SpeedDial>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default UserData;
