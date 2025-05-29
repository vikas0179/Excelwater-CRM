import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { API_GET_DATA, API_USERS_DETAIL, API_USERS_UPDATE } from "@/services/ApiEndPoint";
import Api, { fetcher } from "@/services/ApiServices";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Select from "react-select";
import useSWR from "swr";
import LoaderWrapperView from "@/components/LoaderWrapperView";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [role, setRole] = useState("");
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
      // name: yup.string().required("Name is Required"),
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

  const { data, isLoading } = useSWR(`${API_USERS_DETAIL}/${id}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  useEffect(() => {
    reset({
      name: data?.data?.name,
      email: data?.data?.email,

      state: data?.data?.state_city,
      role: user.filter((item) => item?.value == data?.data?.role)
    });
    setRole(data?.data?.role);
  }, [data, user]);

  const onSubmit = async (data) => {
    const formdata = new FormData();

    formdata.append("name", data.name);
    formdata.append("email", data.email);
    formdata.append("id", id);
    formdata.append("role", role);
    try {
      setLoading(true);
      const response = await Api.post(API_USERS_UPDATE, formdata);
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
      <Breadcrumbs title="Update User" BreadLink={[{ link: "/manage-users", name: "Manage Users" }]} />
      <Card title="Update User" className="md:w-1/2">
        <LoaderWrapperView isLoading={isLoading}>
          <div>
            <form className="space-y-4">
              <div className="lg:grid-cols-1 grid gap-5 grid-cols-1 ">
                <Textinput name="name" label="name" type="text" register={register} error={errors.name} placeholder="" />
                <Textinput name="email" label="email" type="email" register={register} error={errors.email} placeholder="" />

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
                          setRole(selectedOption.value);
                        }}
                      />
                    )}
                  />
                  <p className="mt-2 text-danger-500 block text-sm">{errors.base_currency_id?.message}</p>
                </div>
              </div>
              <div className="ltr:text-right rtl:text-left">
                <Button type="submit" onClick={handleSubmit(onSubmit)} text="Submit" icon="ic:round-save" className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]" isLoading={loading} />
              </div>
            </form>
          </div>
        </LoaderWrapperView>
      </Card>
    </div>
  );
};

export default UserEdit;
