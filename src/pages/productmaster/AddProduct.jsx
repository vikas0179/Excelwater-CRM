import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { API_PRODUCT_ADD, API_EDIT_PRODUCT, API_GET_ALL_SPARE_PARTS_DATA } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";

export const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.productData || null;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [selectedParts, setSelectedParts] = useState(productData?.spare_part || []);
  const [selectedPart, setSelectedPart] = useState("");
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(productData?.image || "");
  const [sparePartError, setSparePartError] = useState("");


  console.log("spareParts", spareParts)

  useEffect(() => {
    if (productData) {
      setValue("product_name", productData.product_name);
      setValue("product_code", productData.product_code);
      setValue("price", productData.price);
      setValue("description", productData.desc);
      setImagePreview(productData.image);
    }
    getData();
  }, [productData]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await Api.post(API_GET_ALL_SPARE_PARTS_DATA);
      setLoading(false);
      if (response.data && Array.isArray(response.data)) {
        setSpareParts(response.data);
      }
    } catch (error) {
      setSpareParts([]);
    }
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addPart = () => {
    if (!selectedPart) return toast.error("Please select a valid spare part.");

    const selectedSpare = spareParts.find(part => part.part_name === selectedPart);

    if (selectedSpare) {
      const isAlreadyAdded = selectedParts.some(
        part => part.spare_parts_id === selectedSpare.id
      );

      if (isAlreadyAdded) {
        return toast.error("This spare part is already added.");
      }

      setSelectedParts(prev => [
        ...prev,
        {
          spare_parts_id: selectedSpare.id,
          item: selectedSpare.part_name,
          price: selectedSpare.price,
          qty: selectedSpare.stock_qty === 0 ? 0 : 1,
          stock_qty: selectedSpare.stock_qty,
        },
      ]);
      setSelectedPart("");
    }
  };


  const deletePart = (index) => setSelectedParts(selectedParts.filter((_, i) => i !== index));

  const updatePart = (index, key, value) => {
    const updatedParts = [...selectedParts];
    const parsedQty = Number(value) || 1;

    if (key === "qty" && parsedQty > updatedParts[index].stock_qty) {
      toast.error(`Maximum allowed quantity for "${updatedParts[index].item}" is ${updatedParts[index].stock_qty}`);
      return;
    }

    updatedParts[index][key] = key === "qty" ? parsedQty : value;
    setSelectedParts(updatedParts);
  };


  const onSubmit = async (data) => {
    if (selectedParts.length === 0) {
      setSparePartError("Please add at least one Raw Material.");
      return;
    } else {
      setSparePartError("");
    }



    try {
      const formData = new FormData();
      formData.append("product_name", data.product_name);
      formData.append("product_code", data.product_code);
      formData.append("price", data.price);
      formData.append("desc", data.description);


      if (productData) {
        formData.append("id", productData.id);
        if (!data.images?.[0]) {

          formData.append("image", productData.image);
        } else {
          formData.append("image", data.images[0]);
        }
      } else {

        if (data.images?.[0]) formData.append("image", data.images[0]);
      }

      selectedParts.forEach(part => {
        formData.append("spare_parts_id[]", part.spare_parts_id);
        formData.append("item[]", part.item);
        formData.append("qty[]", part.qty);
      });

      setLoading(true);
      const apiUrl = productData ? API_EDIT_PRODUCT : API_PRODUCT_ADD;
      await Api.post(apiUrl, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setLoading(false);
      navigate("/manage-product");
    } catch (error) {
      setLoading(false);
      alert("Something went wrong!");
    }
  };


  return (
    <div>
      <Breadcrumbs title={productData ? "Edit Product" : "Add Product"} BreadLink={[{ link: "/manage-product", name: "Products" }]} />
      <Card title={productData ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit(onSubmit)} className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Textinput name="product_name" label="Product Name" type="text" placeholder="Enter product name" register={register}
              error={errors.product_name}
              rules={{ required: "Product name is required" }} />
            <Textinput
              name="product_code"
              label="Product Code*"
              type="text"
              placeholder="Enter product code"
              register={register}
              error={errors.product_code}
              rules={{ required: "Product code is required" }}
            />

            <Textinput
              name="price"
              label="Price*"
              type="number"
              placeholder="Enter price"
              register={register}
              error={errors.price}
              rules={{ required: "Price is required", min: { value: 1, message: "Price must be at least 1" } }}
            />

            <label className="form-label">Description*</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="form-control py-2 px-2 border rounded w-full"
              rows="3"
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}

            <label className="form-label">Product Images*</label>
            <input
              type="file"
              {...register("images", {
                validate: files =>
                  productData || files.length > 0 || "Please upload a product image",
              })}
              className="form-control py-2 px-2 border rounded w-full"
              multiple
              onChange={handleImageChange}
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}


            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Image Preview:</p>
                <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover border rounded" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black-500 dark:text-slate-300">Raw Material*</label>
            <div className="flex items-center gap-2 mt-2">
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
              >
                <option value="">Select Raw Material</option>
                {spareParts.map((part) => (
                  <option key={part.id} value={part.part_name}>
                    {part.part_name}
                  </option>
                ))}
              </select>



              <button type="button" onClick={addPart} className="btn btn-dark text-white rounded">+</button>
            </div>
            {sparePartError && (
              <p className="text-red-500 text-md ">{sparePartError}</p>
            )}
            <Card bodyClass="p-0 overflow-x-auto mt-5">
              <table className="w-full border min-w-[600px]">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-900 dark:border-slate-700">
                    {/* <th className="p-2 border">Spare Part ID</th> */}
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border text-center"><IoMdSettings /></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParts.map((part, index) => (
                    <tr key={index}>
                      {/* <td className="p-2 border">{part.spare_parts_id}</td> */}
                      <td className="p-2 border">{part.item}</td>

                      <td className="p-2 border">
                        <input
                          type="number"
                          value={part.qty}
                          onChange={(e) => updatePart(index, "qty", e.target.value)}
                          className="w-full py-3 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                          min={1}
                          max={part.stock_qty}
                        />
                        <p className="text-xs text-gray-500">Available: {part.stock_qty}</p>
                      </td>

                      <td className="p-2 border text-center">
                        <MdDelete className="text-red-500 cursor-pointer" size={20} onClick={() => deletePart(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
          <div className="col-span-2 text-right">
            <Button type="submit" text={productData ? "Update" : "Submit"} className="btn btn-dark" />
          </div>
        </form>
      </Card>
    </div>
  );
};
