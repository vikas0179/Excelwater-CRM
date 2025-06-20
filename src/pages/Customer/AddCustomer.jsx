import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Card from "@/components/ui/Card";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { API_CUSTOMER_ADD, API_CUSTOMER_EDIT } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import InputMask from "react-input-mask";

export const AddCustomer = () => {
  const { register, handleSubmit, setValue, getValues, control, formState: { errors } } = useForm();


  const navigate = useNavigate();
  const location = useLocation();

  const customerData = location.state?.customerData;
  const fromPage = location.state?.from;
  const isEditMode = !!customerData;

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (customerData) {
      setValue("name", customerData.name || "");
      setValue("email", customerData.email || "");
      setValue("mobile", customerData.mobile || "");

     
      setValue("billing_address.street", customerData.billing_address || "");
      // setValue("billing_address.landmark", customerData.billing_landmark || "");
      setValue("billing_address.city", customerData.billing_city || "");
      setValue("billing_address.state", customerData.billing_state || "");
      setValue("billing_address.zip", customerData.billing_zipcode || "");

     
      setValue("shipping_address.street", customerData.shipping_address || "");
      // setValue("shipping_address.landmark", customerData.shipping_landmark || "");
      setValue("shipping_address.city", customerData.shipping_city || "");
      setValue("shipping_address.state", customerData.shipping_state || "");
      setValue("shipping_address.zip", customerData.shipping_zipcode || "");
    }
  }, [customerData, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (isEditMode) {
        formData.append("id", customerData.id);
      }

      formData.append("name", data.name);
      formData.append("email", data.email || "");
      formData.append("mobile", data.mobile);

      formData.append("billing_address", data.billing_address.street || "");
      formData.append("billing_city", data.billing_address.city || "");
      formData.append("billing_state", data.billing_address.state || "");
      formData.append("billing_zipcode", data.billing_address.zip || "");

      formData.append("shipping_address", data.shipping_address.street || "");
      formData.append("shipping_city", data.shipping_address.city || "");
      formData.append("shipping_state", data.shipping_address.state || "");
      formData.append("shipping_zipcode", data.shipping_address.zip || "");

      setLoading(true);

      const apiUrl = isEditMode ? API_CUSTOMER_EDIT : API_CUSTOMER_ADD;

      const response = await Api.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);


      if (response?.status === "RC100") {
        return;
      }


      if (fromPage === "addinvoice") {
        navigate("/manage-invoice/add");
      } else {
        navigate("/manage-customer");
      }

    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };


  const handleSameAsBilling = (e) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);
    if (checked) {
      const billing = getValues("billing_address");
      setValue("shipping_address", billing);
    } else {
      setValue("shipping_address", {
        street: '',
        // landmark: '',
        city: '',
        state: '',
        zip: '',
      });
    }
  };


  return (<>

    <div className="md:flex justify-between items-center">
      <Breadcrumbs
        title={isEditMode ? "Edit Customer" : "Add Customer"}
        BreadLink={[{ link: "/manage-customer", name: "Customer" }]}
      />
    </div>

    <div className=" mx-auto p-4">

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium text-black-500 dark:text-slate-300">Name *</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter full name"
                className="w-full border px-3 py-2 rounded dark:bg-slate-900 dark:border-slate-700"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}

            </div>

            <div>
              <label className="block mb-1 font-medium text-black-500 dark:text-slate-300">Email</label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="Enter email"
                className="w-full border px-3 py-2 rounded dark:bg-slate-900 dark:border-slate-700"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}

            </div>

            <div>
              <label className="block mb-1 font-medium text-black-500 dark:text-slate-300">
                Mobile *
              </label>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^\d{3}-\d{3}-\d{4}$/,
                    message: "Invalid mobile number format (e.g., 647-212-4552)",
                  },
                }}
                render={({ field }) => (
                  <InputMask
                    mask="999-999-9999"
                    {...field}
                    value={field.value || ""}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="tel"
                        className="w-full border px-3 py-2 rounded dark:bg-slate-900 dark:border-slate-700"
                      />
                    )}
                  </InputMask>
                )}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

          </div>


          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Billing Address*</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("billing_address.street", { required: "Street is required" })}
                  placeholder="Street / House / Office No."
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.billing_address?.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.billing_address.street.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register("billing_address.city", { required: "City is required" })}
                  placeholder="City"
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.billing_address?.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.billing_address.city.message}</p>
                )}
              </div>

              {/* <div>
                <input
                  {...register("billing_address.landmark", { required: "Landmark is required" })}
                  placeholder="Landmark"
                  className="border px-3 py-2 rounded w-full"
                />
                {errors.billing_address?.landmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.billing_address.landmark.message}</p>
                )}
              </div> */}
            </div>

            {/* Inside Billing Address block */}
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div>
                  <input
                    {...register("billing_address.state", { required: "State is required" })}
                    placeholder="State"
                    className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                  />
                  {errors.billing_address?.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.billing_address.state.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("billing_address.zip", {
                      required: "Zip Code is required",
                      pattern: {
                        value: /^\d{5,6}$/,
                        message: "Zip code must be 5 or 6 digits",
                      },
                    })}
                    maxLength={6}
                    placeholder="Zip Code"
                    className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                  />
                  {errors.billing_address?.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.billing_address.zip.message}</p>
                  )}
                </div>
              </div>

            </div>
          </div>




          {/* Shipping Address */}
          <div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={handleSameAsBilling}
                  className="form-checkbox"
                />
                <span className="ml-2">Same as Billing Address </span>
              </label>
            </div>


            <h3 className="text-lg font-semibold mb-2">Shipping Address *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("shipping_address.street", { required: "Street is required" })}
                  placeholder="Street / House / Office No."
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.shipping_address?.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipping_address.street.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("shipping_address.city", { required: "City is required" })}
                  placeholder="City"
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.shipping_address?.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipping_address.city.message}</p>
                )}
              </div>

              {/* <div>
                <input
                  {...register("shipping_address.landmark", { required: "Landmark is required" })}
                  placeholder="Landmark"
                  className="border px-3 py-2 rounded w-full"
                />
                {errors.shipping_address?.landmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipping_address.landmark.message}</p>
                )}
              </div> */}
            </div>

            {/* Inside Shipping Address block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">


              <div>
                <input
                  {...register("shipping_address.state", { required: "State is required" })}
                  placeholder="State"
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.shipping_address?.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipping_address.state.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("shipping_address.zip", {
                    required: "Zip Code is required",
                    pattern: {
                      value: /^\d{5,6}$/,
                      message: "Zip code must be 5 or 6 digits",
                    },
                  })}
                  maxLength={6}
                  placeholder="Zip Code"
                  className="border px-3 py-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                />
                {errors.shipping_address?.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipping_address.zip.message}</p>
                )}
              </div>
            </div>

          </div>


          <div className="flex justify-end">
            <Button
              type="submit"
              className="btn btn-dark"
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>

    </div>
  </>

  );
};
