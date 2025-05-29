import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { API_GET_DATA, API_USERS_ADD } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Select from "react-select";

const userAdd = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const getData = async () => {
    try {
      const res = await Api(API_GET_DATA);

      if (res.status === "RC200") {
        const d = res.data.roles.map((item) => {
          return { value: item.id, label: item.name };
        });
        setUser(d);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is Required"),
      password: yup.string().required("password is Required"),
      email: yup.string().email("Invalid email").required("Email is Required")
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

  const onSubmit = async (data) => {
    const formdata = new FormData();

    formdata.append("name", data.name);
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("role", data.role.value);
    try {
      setLoading(true);
      const response = await Api.post(API_USERS_ADD, formdata);
      setLoading(false);

      // if (response.status === "RC100") {
      //   throw new Error(response.message);
      // }

      if (response.status === "RC200") {
        reset();
        navigate("/manage-users");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Breadcrumbs title="Add User" BreadLink={[{ link: "/manage-users", name: "Manage Users" }]} />
      <Card title="Add User" className="md:w-1/2">
        <div>
          <form className="space-y-4">
            <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 ">
              <Textinput name="name" label="name" type="text" register={register} error={errors.name} placeholder="" />
              <Textinput name="email" label="email" type="email" register={register} error={errors.email} placeholder="" />

              <Textinput name="password" label="Password" type="password" hasicon register={register} error={errors.password} placeholder="" />
              <div>
                <label htmlFor=" hh" className="form-label ">
                  Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={user}
                      isSearchable={true}
                      placeholder="Select Role"
                      className="react-select"
                      classNamePrefix="select"
                      id="hh"
                      onChange={(selectedOption) => {
                        setValue(`role`, selectedOption);
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="ltr:text-right rtl:text-left">
              <Button type="submit" onClick={handleSubmit(onSubmit)} text="Submit" icon="ic:round-save" className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]" isLoading={loading} />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default userAdd;
