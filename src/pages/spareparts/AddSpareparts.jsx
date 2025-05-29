import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { API_SPAREPARTS_ADD, API_EDIT_SPAREPARTS } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { useNavigate, useLocation } from "react-router-dom";

export const AddSpareParts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sparepartsData = location.state?.sparepartsData || null;

  const isEditMode = !!sparepartsData;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      part_name: sparepartsData?.part_name || "",
      part_number: sparepartsData?.part_number || "",
      price: sparepartsData?.price || "",
      min_alert_qty: sparepartsData?.min_alert_qty || "",
      description: sparepartsData?.desc || "",
      opening_stock: sparepartsData?.opening_stock || "",
    },
  });

  useEffect(() => {
    if (sparepartsData) {
      setValue("part_name", sparepartsData.part_name);
      setValue("part_number", sparepartsData.part_number);
      setValue("price", sparepartsData.price);
      setValue("min_alert_qty", sparepartsData.min_alert_qty);
      setValue("description", sparepartsData.desc);
      setValue("opening_stock", sparepartsData.opening_stock);
    }
  }, [sparepartsData, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("part_name", data.part_name);
      formData.append("part_number", data.part_number);
      formData.append("price", data.price);
      formData.append("min_alert_qty", data.min_alert_qty);
      formData.append("opening_stock", data.opening_stock);
      formData.append("desc", data.description);

      if (data.parts_image && data.parts_image[0]) {
        formData.append("image", data.parts_image[0]);
      }

      if (isEditMode) {
        formData.append("id", sparepartsData.id);
        await Api.post(API_EDIT_SPAREPARTS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await Api.post(API_SPAREPARTS_ADD, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/manage-sparepart");
    } catch (error) {
      console.error("Error saving spare part:", error);
      alert("Failed to save spare part!");
    }
  };

  return (
    <div>
      <Breadcrumbs
        title={isEditMode ? "Edit Raw Material" : "Add Raw Material"}
        BreadLink={[{ link: "/manage-sparepart", name: "Spare Parts" }]}
      />

      <Card title={isEditMode ? "Edit Raw Material" : "Add Raw Material"} className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Spare Parts Details */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Textinput
              name="part_name"
              label="Material Name*"
              type="text"
              placeholder="Enter part name"
              register={register}
              error={errors.part_name}
              rules={{ required: "Material Name is required" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textinput
              name="part_number"
              label="Material Number"
              type="text"
              placeholder="Enter part number"
              register={register}
              error={errors.part_number}
            />

            <Textinput
              name="price"
              label="Price*"
              type="number"
              placeholder="Enter price"
              register={register}
              error={errors.price}
              rules={{ required: "Price is required" }}
            />

          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description*</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className={`form-control py-2 px-2 border rounded w-full ${errors.description ? "border-red-500" : ""}`}
              rows="3"
              placeholder="Enter part description"
            ></textarea>
            {errors.description && (
              <p className="text-danger-500 text-sm mt-2">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Textinput
              name="opening_stock"
              label="Opening Stock*"
              type="number"
              placeholder="Enter opening stock"
              register={register}
              error={errors.opening_stock}
              rules={{ required: "Opening stock is required" }}
            />
          </div>


          {/* Min Alert Quantity */}
          <div>
            <Textinput
              name="min_alert_qty"
              label="Min Alert Quantity*"
              type="number"
              placeholder="Enter minimum alert quantity"
              register={register}
              error={errors.min_alert_qty}
              rules={{ required: "Min alert quantity is required" }}
            />
          </div>

          {/* Parts Image Upload */}
          <div>
            <label className="form-label">Material Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("parts_image", {
                validate: {
                  isImage: (files) => {
                    if (!files?.length) return true; // Optional upload
                    const file = files[0];
                    const isValidImage = file.type.startsWith("image/");
                    return isValidImage || "Only image files are allowed (PDF not accepted)";
                  },
                },
              })}
              className="form-control py-2 px-2 border rounded w-full file:py-2 file:px-4 file:border-0 file:bg-gray-100"
            />
            {errors.parts_image && (
              <p className="text-red-500 text-sm mt-1">{errors.parts_image.message}</p>
            )}
          </div>


          {/* Existing Image Preview */}
          {sparepartsData?.image && (
            <div>
              <label className="form-label">Existing Image</label>
              <img src={sparepartsData.image} alt="Spare Part" className="w-32 h-32 border rounded" />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end">
            <Button
              type="submit"
              text={isEditMode ? "Update" : "Submit"}
              icon="ic:round-save"
              className="btn btn-sm btn-dark flex justify-center items-center mt-4 h-[38px]"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};
