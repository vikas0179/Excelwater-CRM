import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { API_SUPPLIER_ADD, API_EDIT_SUPPLIER } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


export const AddSupplier = () => {

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const supplierData = location.state?.supplierData || null;

   const fromPage = location.state?.from;

   console.log("fromPage", fromPage)


  console.log("Supplier Data:", supplierData);


  const isEditMode = !!supplierData; // Edit mode detect karne ke liye


  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: supplierData?.name || "",
      email: supplierData?.email || "",
      phone: supplierData?.phone || "",
      address: supplierData?.address || "",
      tan_number: supplierData?.tan_number || "",
    },
  });

  useEffect(() => {
    if (supplierData) {
      setValue("name", supplierData.name);
      setValue("email", supplierData.email);
      setValue("phone", supplierData.phone);
      setValue("address", supplierData.address);
      setValue("tan_number", supplierData.tan_number);
    }
  }, [supplierData, setValue]);


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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Textinput name="name" label="Full Name*" type="text" placeholder="Enter full name" register={register} error={errors.name}
              rules={{ required: "Name is required" }} />
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
            <Textinput name="phone" label="Phone Number*" type="text" placeholder="Enter phone number" register={register} error={errors.phone}
              rules={{ required: "Phone is required" }} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textinput name="tan_number" label="TAN Number*" type="text" placeholder="Enter TAN Number" register={register} error={errors.tan_number}
              rules={{ required: "Tan Number is required" }} />
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

              {/* Logo preview for new file */}
              {logoPreview && (
                <div className="mt-2">
                  <img src={logoPreview} alt="Preview" className="w-32 h-32 border rounded" />
                </div>
              )}

              {/* Existing logo from DB if editing */}
              {!logoPreview && supplierData?.logo && (
                <div className="mt-2">
                  <label className="form-label">Existing Image</label>
                  <img src={supplierData.logo} alt="Company Logo" className="w-32 h-32 border rounded" />
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
