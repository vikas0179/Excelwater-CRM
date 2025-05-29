import React, { Fragment, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useSelector, useDispatch } from "react-redux";
import { Transition } from "@headlessui/react";
import { handleCustomizer } from "@/store/layout";
import SimpleBar from "simplebar-react";
import Semidark from "./Tools/Semidark";
import RtlSwicth from "./Tools/Rtl";
import Skin from "./Tools/Skin";
import Theme from "./Tools/Theme";
import ContentWidth from "./Tools/ContentWidth";
import Menulayout from "./Tools/Menulayout";
import MenuClose from "./Tools/MenuClose";
import MenuHidden from "./Tools/MenuHidden";
import NavbarType from "./Tools/NavbarType";
import FooType from "./Tools/FooterType";
import useWidth from "@/hooks/useWidth";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import LoaderCircle from "@/components/Loader-circle";
import { API_SALES_LEAD_DETAILS } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Flatpickr from "react-flatpickr";

const Setings = ({ viewId }) => {
  const isOpen = useSelector((state) => state.layout.customizer);
  const dispatch = useDispatch();
  // ** Toggles  Customizer Open
  const setCustomizer = (val) => dispatch(handleCustomizer(val));

  const { width, breakpoints } = useWidth();

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [DOB, setDOB] = useState("");
  const [editId, setEditId] = useState("");
  const getService = async () => {
    if (!viewId) return;
    try {
      setLoading(true);
      const res = await Api(`${API_SALES_LEAD_DETAILS}/${viewId}`);
      setLoading(false);

      if (res.status === "RC200") {
        setData(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getService();
  }, [viewId]);

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is Required")
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    setValue
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  });

  return (
    <div>
      {!isOpen && (
        <span
          className="fixed ltr:md:right-[-32px] ltr:right-0 rtl:left-0 rtl:md:left-[-32px] top-1/2 z-[888] translate-y-1/2 bg-slate-800 text-slate-50 dark:bg-slate-700 dark:text-slate-300 cursor-pointer transform rotate-90 flex items-center text-sm font-medium px-2 py-2 shadow-deep ltr:rounded-b rtl:rounded-t"
          // onClick={() => setCustomizer(true)}
        >
          {/* <Icon icon="clarity:settings-line" className="text-slate-50 text-lg animate-spin" /> */}
          {/* <span className="hidden md:inline-block ltr:ml-2 rtl:mr-2">Settings</span> */}
        </span>
      )}

      <div
        className={`
        setting-wrapper fixed ltr:right-0 rtl:left-0 top-0 md:w-[70%] w-[50%]
         bg-white dark:bg-slate-800 h-screen z-[9999]  md:pb-6 pb-[100px] shadow-base2
          dark:shadow-base3 border border-slate-200 dark:border-slate-700 transition-all duration-150
          ${isOpen ? "translate-x-0 opacity-100 visible" : "ltr:translate-x-full rtl:-translate-x-full opacity-0 invisible"}
        `}
      >
        <SimpleBar className="px-6 h-full">
          <header className="flex items-center justify-end border-b border-slate-100 dark:border-slate-700 -mx-6 px-6 py-[15px] mb-6">
            {/* <div>
              <span className="block text-xl text-slate-900 font-medium dark:text-[#eee]">Theme customizer</span>
              <span className="block text-sm font-light text-[#68768A] dark:text-[#eee]">Customize & Preview in Real Time</span>
            </div> */}
            <div className="cursor-pointer text-2xl text-slate-800 dark:text-slate-200" onClick={() => setCustomizer(false)}>
              <Icon icon="heroicons-outline:x" />
            </div>
          </header>
          <div className=" space-y-4">
            <LoaderWrapperView isLoading={loading}>
              <div className="flex flex-col">
                <Card className="shadow-none bg-[#f5f5f5]">
                  <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Date</span>
                          <span className="block">{data?.date ? data?.date : "-"}</span>
                        </div>
                      </div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Phone</span>
                          <span className="block ">{data?.phone ? data?.phone : "-"}</span>
                        </div>
                      </div>

                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Type </span>
                          <span className="block ">
                            {data?.type === 0 && <Badge label="book water test" className="bg-success-500 text-white" />}
                            {data?.type === 1 && <Badge label="contact page" className="bg-success-500 text-white" />}
                            {data?.type === 2 && <Badge label="popup" className="bg-success-500 text-white" />}
                            {data?.type === 3 && <Badge label="home popup" className="bg-success-500 text-white" />}
                            {data?.type === 4 && <Badge label="friend" className="bg-success-500 text-white" />}
                            {data?.type === 5 && <Badge label="wts" className="bg-success-500 text-white" />}
                            {data?.type === 6 && <Badge label="ro" className="bg-success-500 text-white" />}
                            {data?.type === 7 && <Badge label="admin/direct call" className="bg-success-500 text-white" />}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Name</span>
                          <span className="block">{data?.name ? data?.name : "-"}</span>
                        </div>
                      </div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">City </span>
                          <span className="block ">{data?.city ? data?.city : "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Email</span>
                          <span className="block ">{data?.email ? data?.email : "-"}</span>
                        </div>
                      </div>

                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div>
                          <span className="block font-medium">Status </span>
                          <span className="block ">{data?.status === 2 ? "Dropped " : "Converted"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-x-4 rtl:space-x-reverse pb-3">
                        <div className="grid grid-cols-2 flex items-stretch space-x-4 rtl:space-x-reverse">
                          <button type="button" onClick={() => setShow(true)} className="btn btn-outline-dark flex items-center">
                            <Icon icon="heroicons-outline:plus" />
                            <span className="ml-1">Update Status</span>
                          </button>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                <div className="h-80">
                  <Card className="shadow-none">
                    <div
                      id="scrollableDiv"
                      style={{
                        height: 300,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse"
                      }}
                    >
                      {/*Put the scroll bar always on the bottom*/}
                    </div>
                  </Card>
                </div>

                <hr />
                <Card className="shadow-none">
                  <form className="space-y-4">
                    <div className="lg:grid-cols-2 grid gap-5 grid-cols-1 ">
                      <Textarea name="name" label="Message *" type="text" register={register} placeholder="" />
                      <div>
                        <Textinput name="name" label="File (optional)" type="text" register={register} error={errors.name} placeholder="" />{" "}
                        <div>
                          <label className="form-label" for="default-picker">
                            Followup Date (optional)
                          </label>
                          <Flatpickr
                            value={DOB}
                            id="default-picker"
                            className="form-control py-2"
                            onChange={(date, d, f) => {
                              setDOB(d);
                            }}
                            options={{
                              altInput: true,
                              altFormat: "d-m-Y",
                              dateFormat: "d-m-Y"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ltr:text-right rtl:text-left">
                      <Button
                        // onClick={handleSubmit(onSubmit)}
                        className="btn btn-dark text-center"
                        // isLoading={loading}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </LoaderWrapperView>
          </div>
        </SimpleBar>
      </div>

      <Transition as={Fragment} show={isOpen}>
        <div className="overlay bg-white bg-opacity-0 fixed inset-0 z-[999]" onClick={() => setCustomizer(false)}></div>
      </Transition>
    </div>
  );
};

export default Setings;
