import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Api from "@/services/ApiServices";
import { API_RESET_PASSWORD, API_VERIFY_TOKEN } from "@/services/ApiEndPoint";

const ResetForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const getData = async () => {
    try {
      const res = await Api.post(API_VERIFY_TOKEN, { token: token });

      if (res.status === "RC200") {
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const schema = yup
    .object({
      password: yup.string().required("Password is Required"),
      confirm_password: yup.string().required("Confirm Password is Required")
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append("password", data.password);
    formdata.append("confirm_password", data.confirm_password);
    formdata.append("token", token);
    try {
      setLoading(true);
      const response = await Api.post(API_RESET_PASSWORD, formdata);
      setLoading(false);

      if (response.status === "RC200") {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput name="password" label="password" type="password" hasicon placeholder="Password" register={register} error={errors.password} className="h-[48px]" />
      <Textinput name="confirm_password" label="Confirm Password" type="password" hasicon register={register} placeholder="Confirm Password" error={errors.confirm_password} className="h-[48px]" />

      <Button type="submit" text="Reset Password" className="btn btn-dark block w-full text-center " isLoading={loading} />
    </form>
  );
};

export default ResetForm;
