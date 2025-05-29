import React, { useEffect, Suspense, Fragment, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import Settings from "@/components/partials/settings";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth";
import useMenulayout from "@/hooks/useMenulayout";
import useMenuHidden from "@/hooks/useMenuHidden";
import Footer from "@/components/partials/footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MobileMenu from "../components/partials/sidebar/MobileMenu";
import useMobileMenu from "@/hooks/useMobileMenu";
import MobileFooter from "@/components/partials/footer/MobileFooter";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import Api from "@/services/ApiServices";
import { API_GET_DATA } from "@/services/ApiEndPoint";
import { useDispatch } from "react-redux";
import { roleHandler } from "@/store/authSlice";
const Layout = () => {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const { pathname } = useLocation();





  const navigate = useNavigate();
  const switchHeaderClass = () => {
    if (menuType === "horizontal" || menuHidden) {
      return "ltr:ml-0 rtl:mr-0";
    } else if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };
  // content width
  const [contentWidth] = useContentWidth();
  const [menuType] = useMenulayout();
  const [menuHidden] = useMenuHidden();

  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const nodeRef = useRef(null);

  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      const res = await Api(API_GET_DATA);

      if (res.status === "RC200") {
        localStorage.setItem("role", JSON.stringify(res.data.role));
        dispatch(roleHandler({ role: res.data.role }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [pathname]);





  return (
    <>
      {/* <ToastContainer /> */}
      <Header className={`print:hidden ${width > breakpoints.xl ? switchHeaderClass() : ""}`} />
      {menuType === "vertical" && width > breakpoints.xl && !menuHidden && <Sidebar />}

      <MobileMenu
        className={`${width <= breakpoints.xl && mobileMenu ? "left-0 visible opacity-100  z-[9999]" : "left-[-300px] invisible opacity-0  z-[-999] "
          }`}
      />
      {/* mobile menu overlay*/}
      {width < breakpoints.xl && mobileMenu && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
      {/* <Settings /> */}
    <div className="
  content-wrapper transition-all duration-150
  ltr:ml-0 rtl:mr-0
  xl:ltr:ml-[248px] xl:rtl:mr-[248px]
  print:ml-0 print:mr-0
">



        {/* md:min-h-screen will h-full*/}
        <div className="page-content   page-min-height  ">
          <div className={contentWidth === "boxed" ? "container mx-auto" : "container-fluid"}>
            <Suspense fallback={<Loading />}>
              <motion.div
                key={location.pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                  pageInitial: {
                    opacity: 0,
                    y: 50
                  },
                  pageAnimate: {
                    opacity: 1,
                    y: 0
                  },
                  pageExit: {
                    opacity: 0,
                    y: -50
                  }
                }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5
                }}
              >
                {/* <Breadcrumbs /> */}
                {token ? <Outlet /> : <Navigate to="/" />}
              </motion.div>
            </Suspense>
          </div>
        </div>
      </div>
      {/* {width < breakpoints.md && <MobileFooter />} */}
      {width > breakpoints.md && <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />}
    </>
  );
};

export default Layout;
