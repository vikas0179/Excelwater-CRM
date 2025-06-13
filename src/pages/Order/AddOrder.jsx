import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  API_GET_ALL_SUPPLIER_DATA,
  API_ORDER_ADD,
  API_GET_SUPPLIERWISE_SPAREPARTS,
  API_EDIT_ORDER,
} from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowDown } from "react-icons/fa";

export const AddOrder = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [suppliers, setSuppliers] = useState([]);
  const [sparePartsOptions, setSparePartsOptions] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [description, setDescription] = useState("");



  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.orderData;

  const selectedSupplier = watch("supplier");



  useEffect(() => {
    if (orderData) {
      setDescription(orderData.desc || "");
      setValue("details", orderData.desc || "");
    }
  }, [orderData, setValue]);

  useEffect(() => {
    const fetchSparePartsBySupplier = async (supplierId) => {
      if (!supplierId) {
        setSparePartsOptions([]);
        setSelectedPartId("");
        setSelectedParts([]);
        return;
      }

      try {

        const formData = new FormData();
        formData.append("id", supplierId);

        const response = await Api.post(API_GET_SUPPLIERWISE_SPAREPARTS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });


        if (response.data && Array.isArray(response.data)) {
          setSparePartsOptions(response.data);
          setSelectedPartId("");
        } else {
          setSparePartsOptions([]);
        }
      } catch (error) {
        setSparePartsOptions([]);
      }
    };

    fetchSparePartsBySupplier(selectedSupplier);
  }, [selectedSupplier]);


  useEffect(() => {
    if (orderData && sparePartsOptions.length > 0) {

      const formattedParts = orderData.order_items
        .map((item) => {

          const matchingPart = sparePartsOptions.find(
            (spare) => spare.part_name === item.item
          );
          if (!matchingPart) return null;

          return {
            name: item.item,
            description: item.desc || "",
            qty: item.qty || 1,
            rate: item.rate || 0,
            amount: item.amount || 0,
          };
        })
        .filter(Boolean);
      setSelectedParts(formattedParts);
    }
  }, [sparePartsOptions, orderData]);


  useEffect(() => {
    if (orderData) {
      setValue("supplier", orderData.supplier_id);
      setDescription(orderData.desc || "");
      setValue("details", orderData.desc || "");
    }
  }, [orderData, setValue]);

  useEffect(() => {
    const getSupplier = async () => {
      try {
        const response = await Api.post(API_GET_ALL_SUPPLIER_DATA);
        if (response.data && Array.isArray(response.data)) {
          setSuppliers(response.data);
        }
      } catch (error) {
        setSuppliers([]);
      }
    };
    getSupplier();
  }, []);

  const onSubmit = async (data) => {
    if (selectedParts.length === 0) {
      toast.error("Please add at least one spare part");
      return;
    }

    const formData = new FormData();

    formData.append("supplier_id", data.supplier);
    formData.append("description", data.details);

    selectedParts.forEach((part) => {
      formData.append("item[]", part.name);
      formData.append("desc[]", part.description);
      formData.append("rate[]", part.rate);
      formData.append("qty[]", part.qty);
      formData.append(
        "spare_id[]",
        sparePartsOptions.find((spare) => spare.part_name === part.name)?.id ||
        ""
      );
    });

    try {
      let response;

      if (orderData) {
        formData.append("id", orderData.id);
        response = await Api.post(API_EDIT_ORDER, formData);
      } else {
        response = await Api.post(API_ORDER_ADD, formData);
      }

      if (response.data) {

        navigate("/manage-order");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  const addPart = () => {
    if (selectedPartId) {
      const partData = sparePartsOptions.find(
        (part) => part.id === Number(selectedPartId)
      );
      if (partData) {
        const newPart = {
          name: partData.part_name,
          description: "",
          qty: 1,
          rate: partData.price,
          amount: partData.price,
        };

        setSelectedParts([...selectedParts, newPart]);
        setSelectedPartId("");
      }
    }
  };

  const updatePart = (index, key, value) => {
    const updatedParts = [...selectedParts];

    if (key === "description") {
      updatedParts[index][key] = value;
    } else {
      updatedParts[index][key] = value === "" ? "" : Number(value);

      if (key === "qty" || key === "rate") {
        updatedParts[index]["amount"] =
          (updatedParts[index]["qty"] || 0) * (updatedParts[index]["rate"] || 0);
      }
    }

    setSelectedParts(updatedParts);
  };

  const deletePart = (index) => {
    setSelectedParts(selectedParts.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs
        title={orderData ? "Edit Order" : "Add Order"}
        BreadLink={[{ link: "/manage-order", name: "Orders" }]}
      />

      <Card bodyClass="p-2 md:p-4 lg:p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Supplier Dropdown */}
              <div>
                <label className="block text-sm font-medium text-black-500 mb-1 dark:text-slate-300">
                  Supplier
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <select
                    className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                    {...register("supplier", { required: "Supplier is required" })}
                    value={selectedSupplier || ""}

                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>

                  <Link
                    to="/manage-supplier/add" state={{ from: "addorder" }}
                    onClick={addPart}
                    className="px-3 py-2 btn btn-dark text-white rounded"
                  >
                    +
                  </Link>
                </div>
                {errors.supplier && (
                  <p className="text-red-500 text-sm mt-1">{errors.supplier.message}</p>
                )}
              </div>


              {/* Spare Parts Dropdown */}
              <div>
                <label className="block text-sm font-medium text-black-500 dark:text-slate-300">
                  Raw Material
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700s"
                    value={selectedPartId}
                    disabled={!selectedSupplier}
                  >
                    <option value="">Select Raw Material</option>
                    {sparePartsOptions
                      .filter(
                        (part) =>
                          !selectedParts.some(
                            (selected) => selected.name === part.part_name
                          )
                      )
                      .map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.part_name}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={addPart}
                    className="px-3 py-3 btn btn-dark text-white rounded"
                  >
                    <FaArrowDown size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-black-500 dark:text-slate-300">Description</label>
              <textarea
                id="details"
                placeholder="Enter order details..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValue("details", e.target.value);
                }}
                className=" min-h-[125px] px-3 py-2 w-full mt-1 border border-gray-300 rounded dark:bg-slate-900 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Parts Table */}
          <Card bodyClass="p-0 overflow-x-auto mt-5">
            <table className="w-full border min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-900 dark:border-slate-700">
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Rate</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">
                    <IoMdSettings />
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedParts.map((part, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{part.name}</td>
                    <td className="p-2 border">
                      <textarea
                        value={part.description}
                        onChange={(e) =>
                          updatePart(index, "description", e.target.value)
                        }
                        className="w-full py-3 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={part.qty}
                        onChange={(e) => updatePart(index, "qty", e.target.value)}
                        className="w-full py-3 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                        min={1}
                      />
                      {/* Qty validation */}
                      {part.qty === "" || part.qty <= 0 ? (
                        <p className="text-red-500 text-xs mt-1">
                          Quantity must be greater than 0
                        </p>
                      ) : null}
                    </td>
                    <td className="p-2 border">
                      <div className="flex items-center border rounded-md  dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
                        <span className="px-4 bg-gray-50 text-gray-500 dark:bg-slate-900 dark:text-neutral-400 border-r dark:border-slate-700 py-2">
                          $
                        </span>
                       <input
  type="number"
  value={part.rate}
  readOnly
  className="w-full  px-2 bg-transparent focus:outline-none dark:text-white cursor-not-allowed"
  min={0}
/>

                      </div>
                      {/* Rate validation */}
                      {part.rate === "" || part.rate < 0 ? (
                        <p className="text-red-500 text-xs mt-1">Rate cannot be negative</p>
                      ) : null}
                    </td>

                    <td className="p-2 border text-right">${part.amount}</td>
                    <td className="p-2 border text-center">
                      <MdDelete
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => deletePart(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>


          {selectedParts.length === 0 && (
            <p className="text-red-500 mt-1">Please add at least one Raw Material</p>
          )}

          {/* Total Calculation */}
          <div className="grid justify-items-end mb-3 mt-3 lg:pr-[50px] pr-[0px] md:pr-[40px]">
            <span>
              Sub Total:{" "}
              <strong>
                $
                {selectedParts.reduce(
                  (sum, part) => sum + (part.amount || 0),
                  0
                )}
              </strong>
            </span>
            <span className="mt-2">
              Total:{" "}
              <strong>
                $
                {selectedParts.reduce(
                  (sum, part) => sum + (part.amount || 0),
                  0
                )}
              </strong>
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="submit" text={orderData ? "Update" : "Submit"} className="btn btn-dark" />
          </div>
        </form>
      </Card>
    </div>
  );
};
