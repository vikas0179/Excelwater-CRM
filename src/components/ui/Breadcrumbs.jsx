import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { menuItems } from "@/constant/data";
import Icon from "@/components/ui/Icon";

const Breadcrumbs = ({ title, BreadLink }) => {
  return (
    <>
      <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
        <ul className="breadcrumbs">
          <li className="text-primary-500">
            <NavLink to="/dashboard" className="text-lg">
              <Icon icon="heroicons-outline:home" />
            </NavLink>
            <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
              <Icon icon="heroicons:chevron-right" />
            </span>
          </li>
          <li>
            {BreadLink?.map((item, i) => {
              return (
                <>
                  <NavLink to={item.link} className="capitalize text-slate-500 dark:text-slate-400" key={i}>
                    {item.name}
                  </NavLink>
                  <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                    <Icon icon="heroicons:chevron-right" />
                  </span>
                </>
              );
            })}
          </li>
          <li className="capitalize text-slate-500 dark:text-slate-400">{title}</li>
        </ul>
      </div>
    </>
  );
};

export default Breadcrumbs;
