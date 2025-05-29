import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Api from "@/services/ApiServices";
import { API_GET_PWD_RESET_LINK } from "@/services/ApiEndPoint";
import Button from "@/components/ui/Button";

const ForgotPass = () => {
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("Email is Required")
    })
    .required();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm({
    resolver: yupResolver(schema)
  });

  const forgotHandler = async (data) => {
    try {
      setLoading(true);
      const response = await Api.post(API_GET_PWD_RESET_LINK, data);
      setLoading(false);

      if (response.status === "RC200") {
        reset();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(forgotHandler)} className="space-y-4 ">
      <Textinput name="email" label="Email Address" type="email" register={register} error={errors.email} className="h-[48px]" placeholder="" />

      <Button type="submit" className="btn btn-dark block w-full text-center" isLoading={loading}>
        Send recovery email
      </Button>
    </form>
  );
};

export default ForgotPass;
