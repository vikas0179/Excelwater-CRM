import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Api from "@/services/ApiServices";
import { API_CHANGE_PASSWORD } from "@/services/ApiEndPoint";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

const ChangePassword = () => {
  const [loading, setLoading] = useState();

  const FormValidationSchema = yup
    .object({
      current_password: yup.string().required("Current Password is Required"),
      new_password: yup.string().required("New Password is Required"),
      new_confirm_password: yup.string().required("New Confirm Password is Required")
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await Api.post(API_CHANGE_PASSWORD, data);
      setLoading(false);
      // if (response.status === "RC100") {
      //   throw new Error(response.message);
      // }

      if (response.status === "RC200") {
        reset();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Breadcrumbs title="Change Password" />
      <Card title="Change Password" className="md:w-1/2">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Textinput name="current_password" label="Current Password" placeholder="Current Password" type="password" hasicon register={register} error={errors.current_password} />
            <Textinput name="new_password" label="New Password" placeholder="New Password" type="password" hasicon register={register} error={errors.new_password} />
            <Textinput name="new_confirm_password" label="New Confirm Password" placeholder="New Confirm Password" type="password" hasicon register={register} error={errors.new_confirm_password} />
            <div className="ltr:text-right rtl:text-left">
              <Button type="submit" text="Submit" icon="ic:round-save" className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]" isLoading={loading} />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChangePassword;
