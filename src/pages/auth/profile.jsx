import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import useSWR from "swr";
import { API_GET_PROFILE, API_UPDATE_PROFILE } from "@/services/ApiEndPoint";
import Api, { fetcher } from "@/services/ApiServices";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import LoaderCircle from "@/components/Loader-circle";

const profile = () => {
  const [loading, setLoading] = useState(false);

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is Required"),
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

  const { data, isLoading } = useSWR(API_GET_PROFILE, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  useEffect(() => {
    reset({
      name: data?.data?.name,
      email: data?.data?.email
    });
  }, [data]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);

    try {
      setLoading(true);
      const response = await Api.post(API_UPDATE_PROFILE, formData);
      setLoading(false);
      // if (response.status === "RC100") {
      //   throw new Error(response.message);
      // }

      if (response.status === "RC200") {
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Breadcrumbs title="Profile Details" />
      {isLoading ? (
        <LoaderCircle />
      ) : (
        <Card title="Profile Details" className="md:w-1/2">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
              <Textinput name="name" label="Name" type="text" register={register} error={errors.name} placeholder="Name" />
              <Textinput name="email" label="Email Address" type="email" register={register} error={errors.email} placeholder="Email address" />

              <div className="ltr:text-right rtl:text-left">
                <Button type="submit" text="Submit" icon="ic:round-save" className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]" isLoading={loading} />
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default profile;
