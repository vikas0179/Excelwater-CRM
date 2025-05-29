import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Api from "@/services/ApiServices";
import { API_LOGIN } from "@/services/ApiEndPoint";
import { login } from "@/store/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("Email is Required"),
      password: yup.string().required("Password is Required")
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ resolver: yupResolver(schema), mode: "all" });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await Api.post(API_LOGIN, data);
      setLoading(false);

      if (res.status === "RC200") {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("user", JSON.stringify({ name: res.data.name, role: res.data.role }));
        navigate("/dashboard");
        reset();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput name="email" label="email" type="email" register={register} error={errors.email} className="h-[48px]" placeholder="Enter your email" />
      <Textinput name="password" label="password" type="password" hasicon register={register} error={errors.password} className="h-[48px]" placeholder="Enter your password" />
      <div className="flex justify-end">
        {/* <Checkbox
                  value={checked}
                  onChange={() => setChecked(!checked)}
                  label="Keep me signed in"
                /> */}
        <Link to="/forgot-password" className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium">
          Forgot Password ?
        </Link>
      </div>
      <Button type="submit" text="Sign in" className="btn btn-dark block w-full text-center" isLoading={loading} />
    </form>
  );
};

export default LoginForm;
