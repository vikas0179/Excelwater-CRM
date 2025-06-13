import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { API_SUPPLIER_ADD, API_EDIT_SUPPLIER, API_GET_ALL_SPARE_PARTS_DATA } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select";
import InputMask from "react-input-mask";



export const AddSupplier = () => {

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [sparePartsOptions, setSparePartsOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);


  const navigate = useNavigate();

  const location = useLocation();
  const supplierData = location.state?.supplierData || null;

  const fromPage = location.state?.from;

  console.log("fromPage", fromPage)


  console.log("Supplier Data:", supplierData);


  const isEditMode = !!supplierData;


  const { register, handleSubmit, setValue, watch , control,  formState: { errors } } = useForm({
    defaultValues: {
      name: supplierData?.name || "",
      email: supplierData?.email || "",
      phone: supplierData?.phone || "",
      address: supplierData?.address || "",
      tan_number: supplierData?.tan_number || "",
      spare_parts: supplierData?.spare_part_ids
        ? supplierData.spare_part_ids.split(",").map(Number)
        : [],
    },
  });

  useEffect(() => {
    register("spare_parts", {
      validate: (value) => (value && value.length > 0) || "Please select at least one Raw Material"
    });
  }, [register]);



  useEffect(() => {
    if (supplierData) {
      setValue("name", supplierData.name);
      setValue("email", supplierData.email);
      setValue("phone", supplierData.phone);
      setValue("address", supplierData.address);
      setValue("tan_number", supplierData.tan_number);
    }
  }, [supplierData, setValue]);

  useEffect(() => {
    const getSpareparts = async () => {
      try {
        const response = await Api.post(API_GET_ALL_SPARE_PARTS_DATA);
        if (response.data && Array.isArray(response.data)) {
          const options = response.data.map(part => ({
            label: part.part_name,
            value: part.id,
          }));
          setSparePartsOptions(options);
        }
      } catch (error) {
        setSparePartsOptions([]);
      }
    };
    getSpareparts();
  }, []);

  useEffect(() => {
    if (supplierData?.spare_part_ids && sparePartsOptions.length > 0) {
      const sparePartIds = supplierData.spare_part_ids
        .split(",")
        .map((id) => Number(id.trim()));

      const selected = sparePartsOptions.filter((option) =>
        sparePartIds.includes(option.value)
      );

      setSelectedOptions(selected);

      setValue(
        "spare_parts",
        selected.map((opt) => opt.value),
        { shouldValidate: true }
      );
    }
  }, [supplierData, sparePartsOptions, setValue]);


  console.log("supplierData.spare_parts", supplierData?.spare_parts);






  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("tan_number", data.tan_number);

      if (data.supplier_image && data.supplier_image[0]) {
        formData.append("logo", data.supplier_image[0]);
      }


      if (data.spare_parts && data.spare_parts.length > 0) {
        data.spare_parts.forEach((id) => {
          formData.append("spare_part_ids[]", id);
        });
      }



      if (isEditMode) {
        formData.append("id", supplierData.id);
      }

      if (isEditMode) {
        await Api.post(API_EDIT_SUPPLIER, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await Api.post(API_SUPPLIER_ADD, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/manage-supplier");

      if (fromPage === "addorder") {
        navigate("/manage-order/add");
      } else if (fromPage === "manage-supplier") {
        navigate("/manage-supplier");
      } else {
        navigate("/manage-supplier");
      }

    } catch (error) {
      alert("Failed to save supplier");
    }
  };







  return (
    <div>
      <Breadcrumbs title={isEditMode ? "Edit Supplier" : "Add Supplier"} BreadLink={[{ link: "/manage-supplier", name: "Suppliers" }]} />

      <Card title={isEditMode ? "Edit Supplier" : "Add Supplier"} className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name, Email, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textinput name="name" label="Full Name*" type="text" placeholder="Enter full name" register={register} error={errors.name}
              rules={{ required: "Name is required" }} />

            <div>
              <label className="text-black-500  text-sm dark:text-slate-300">Raw Material*</label>
              <Select
                isMulti
                options={sparePartsOptions}
                value={selectedOptions}
                className="mt-2 dark:bg-slate-900 dark:border-slate-700"
                onChange={selected => {
                  setSelectedOptions(selected || []);
                  const values = selected ? selected.map(opt => opt.value) : [];
                  setValue("spare_parts", values, { shouldValidate: true });
                }}
              />
              {errors.spare_parts && (
                <p style={{ color: "red" }}>{errors.spare_parts.message}</p>
              )}

            </div>





          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textinput
              name="email"
              label="Email*"
              type="email"
              placeholder="Enter email address"
              register={register}
              error={errors.email}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
            />
           <div>
  <label className="block mb-1 font-medium text-black-500 dark:text-slate-300">
    Phone Number *
  </label>
  <Controller
    name="phone"
    control={control}
    rules={{
      required: "Phone number is required",
      pattern: {
        value: /^\d{3}-\d{3}-\d{4}$/,
        message: "Invalid format (e.g., 981-810-3878)",
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
            placeholder="___-___-____"
            className="w-full border px-3 py-2 rounded dark:bg-slate-900 dark:border-slate-700"
          />
        )}
      </InputMask>
    )}
  />
  {errors.phone && (
    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
  )}
</div>

          </div>

          {/* Address */}
          <div>
            <label className="form-label">Address*</label>
            <textarea
              {...register("address", {
                required: "Address is required",
              })}
              className="form-control py-2 px-2 border rounded w-full"
              rows="3"
              placeholder="Enter address"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>


          {/* TAN Number and Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* <Textinput name="tan_number" label="TAN Number" type="text" placeholder="Enter TAN Number " register={register} /> */}

            <div>
              <label className="form-label">Company Logo</label>
              <input
                type="file"
                {...register("supplier_image", {
                  validate: {
                    isImage: (files) => {
                      if (!files?.length) return true; // optional
                      const file = files[0];
                      const isValidImage = file.type.startsWith("image/");
                      return isValidImage || "Only image files are allowed (no PDF)";
                    }
                  }
                })}
                className="form-control py-2 px-2 border rounded w-full"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith("image/")) {
                    setLogoPreview(URL.createObjectURL(file));
                  } else if (file) {
                    toast.error("Only image files are allowed (no PDF)");
                    e.target.value = null; // Clear invalid file
                  }
                }}
              />


              {logoPreview && (
                <div className="mt-2">
                  <img src={logoPreview} alt="Preview" className="w-32 h-32 border rounded" />
                </div>
              )}


              {!logoPreview && supplierData?.logo?.trim() && (
                <div className="mt-2">
                  <img
                    src={supplierData.logo}
                    alt="Company Logo"
                    className="w-32 h-32 border rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}



              {/* Error Message */}
              {errors.supplier_image && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier_image.message}</p>
              )}
            </div>


          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end">
            <Button
              type="submit"
              text={loading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Submit")}
              icon="ic:round-save"
              className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};
