import React from "react";
import { Link } from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";

import Logo from "@/assets/images/logo/logo.webp";
import Illustration from "@/assets/images/auth/login.jpg";
const forgotPass = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          {/* <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" className="mb-10" />
            </Link>

            <h4>
              Unlock your Project
              <span className="text-slate-800 dark:text-slate-400 font-bold">performance</span>
            </h4>
          </div> */}
          <div className="absolute  h-full w-full z-[-1]">
            <img src={Illustration} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box2 flex flex-col justify-center h-full">
              <div className="text-center 2xl:mb-10 mb-5">
                <Link to="/">
                  <img src={Logo} alt="" className="mx-auto mb-10" />
                  {/* <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-5 mt-5">Kent Water Purification Systems</h1> */}
                </Link>
                <h4 className="font-medium mb-4">Forgot Your Password?</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">Reset Password with Kent Water Purification Systems.</div>
              </div>

              <ForgotPass />
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 text-sm">
                <Link to="/" className="text-slate-900 dark:text-white font-medium hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
            <div className="auth-footer text-center"> &copy; {new Date().getFullYear()} Kent Water Purification Systems, All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forgotPass;
