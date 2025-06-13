import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Textarea from "@/components/ui/Textarea";
import Fileinput from "@/components/ui/Fileinput";
import { API_GET_ALL_PRODUCT_DATA, API_INVOCIE_ADD, API_INVOICE_EDIT, API_CUSTOMER_MANAGE_LIST } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";


const suppliers = [
    { id: 1, value: "John", label: "John", shipTo: "Sicilia Business Hub, Near Maharaja Farm" },
    { id: 2, value: "Doe", label: "Doe", shipTo: "Another Address" },
    { id: 3, value: "User", label: "User", shipTo: "Some Other Place" },
    { id: 3, value: "savan", label: "savan", shipTo: "1103, A-Building, Mota Varacha" },
];


export const AddInvoice = () => {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();

    const navigate = useNavigate();

    const location = useLocation();

    const invoiceData = location.state?.invoiceData;




    const [selectProducts, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [product, setProductData] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [shipTo, setShipTo] = useState("");
    const [customers, setCustomers] = useState([]);
    const [billingAddress, setBillingAddress] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");





    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await Api.get(API_CUSTOMER_MANAGE_LIST);
                if (response.data.data) {
                    const customerList = response.data.data.map((c) => ({
                        id: c.id,
                        label: c.name,
                        value: c.name,
                        billingAddress: `${c.billing_address}, ${c.billing_landmark}, ${c.billing_city}, ${c.billing_state}, ${c.billing_zipcode}`,
                        shippingAddress: `${c.shipping_address}, ${c.shipping_landmark}, ${c.shipping_city}, ${c.shipping_state}, ${c.shipping_zipcode}`,
                    }));
                    setCustomers(customerList);

                    // 👇 Auto-select customer if editing
                    if (invoiceData) {
                        const selected = customerList.find(c => c.id === invoiceData.customer_id);
                        if (selected) {
                            setSelectedSupplier(selected.label);
                            setCustomerId(selected.id);
                            setBillingAddress(selected.billingAddress);
                            setShippingAddress(selected.shippingAddress);
                            setSearchTerm(selected.label);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch customers:", error);
                setCustomers([]);
            }
        };
        fetchCustomers();
    }, [invoiceData]);






    useEffect(() => {
        if (invoiceData) {
            // Populate form fields
            setInvoiceNumber(invoiceData.invoice_no || "");
            setInvoiceDate(invoiceData.invoice_date || "");
            setValue("description", invoiceData.desc || "");
            setCustomerId(invoiceData.customer_id || "");
            setShipTo(invoiceData.ship_to || "");
            setSearchTerm(invoiceData.customer_name || "");
            setSelectedSupplier(invoiceData.customer_name || "");
            setBillingAddress(invoiceData.billing_address || "");
            setShippingAddress(invoiceData.shipping_address || "");


            // If invoice image exists, we'll not preload the file (we show preview instead)
            setSelectedFile(null);

            // Set preloaded invoice products
            if (invoiceData.invoice_detail && Array.isArray(invoiceData.invoice_detail)) {
                const preloadedProducts = invoiceData.invoice_detail.map((p) => ({
                    id: p.product_id,
                    name: p.item,
                    description: p.desc,
                    qty: Number(p.qty),
                    rate: Number(p.rate)
                }));
                setProducts(preloadedProducts);
            }


        }
    }, [invoiceData, setValue]);




    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await Api.post(API_GET_ALL_PRODUCT_DATA);
                if (response.data && Array.isArray(response.data)) {
                    setProductData(response.data);
                }
            } catch (error) {
                setProductData([]);
            }
        };
        getProduct();
    }, []);



    useEffect(() => {
        setInvoiceNumber(+ String(Math.floor(100000 + Math.random() * 900000)));
        setInvoiceDate(new Date().toISOString().split("T")[0]);
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredSuppliers([]);
        } else {
            const filtered = customers.filter((c) =>
                c.label.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuppliers(filtered);
            console.log("Filtered suppliers:", filtered); // Debug here
        }
    };



    const onSubmit = async (data, isSendMail = false) => {
        if (!customerId) {
            toast.error("Please select a customer");
            return;
        }

        if (!invoiceNumber) {
            toast.error("Invoice number is required.");
            return;
        }

        if (!invoiceDate) {
            toast.error("Invoice date is required.");
            return;
        }

        if (selectProducts.length === 0) {
            toast.error("Please add at least one product.");
            return;
        }



        if (!data.description || data.description.trim() === "") {
            toast.error("Invoice description is required.");
            return;
        }

        const formData = new FormData();

        formData.append("invoice_date", invoiceDate);
        formData.append("description", data.description || "");
        formData.append("invoice_no", invoiceNumber);
        formData.append("customer_id", customerId || "");
        formData.append("ship_to", shippingAddress || "");
        formData.append("bill_to", billingAddress || "");

        // Conditionally append is_send_mail
        if (isSendMail) {
            formData.append("is_send_mail", "1"); // or true, depending on your API's expected value
        }

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        selectProducts.forEach((part) => {
            formData.append("product_id[]", part.id);
            formData.append("item[]", part.name);
            formData.append("desc[]", part.description || "");
            formData.append("qty[]", part.qty);
            formData.append("rate[]", part.rate);
        });

        try {
            let response;

            if (invoiceData) {
                // Edit order
                formData.append("id", invoiceData.id);
                response = await Api.post(API_INVOICE_EDIT, formData);
            } else {
                // Add new order
                response = await Api.post(API_INVOCIE_ADD, formData);
            }

            if (response.data) {
                navigate("/manage-invoice");
            } else {
                toast.error(response.data?.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        }
    };





    const addProduct = () => {
        if (selectedProduct) {
            const productDetails = product.find(p => p.id === parseInt(selectedProduct));
            if (productDetails && !selectProducts.some(part => part.id === productDetails.id)) {
                const newPart = {
                    id: productDetails.id,
                    name: productDetails.product_name,
                    description: "",
                    qty: 1,
                    rate: productDetails.price
                };
                setProducts([...selectProducts, newPart]);
                setSelectedProduct("");
            }
        }
    };

    const updatePart = (index, key, value) => {
        const updatedProducts = [...selectProducts];
        updatedProducts[index][key] = value;
        setProducts(updatedProducts);
    };

    const deletePart = (index) => {
        const updatedProducts = selectProducts.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };


    return (
        <div className="container mx-auto p-4">
            <Breadcrumbs
                title={invoiceData ? "Edit Invoice" : "Add Invoice"}
                BreadLink={[{ link: "/manage-invoice", name: "Invoice" }]}
            />


            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Left Side: Customer Search & Address Invoice */}
                        <div className="space-y-4">
                            {/* Customer Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search Customer"
                                    className="border p-2 rounded w-full mt-2 pr-8 dark:bg-slate-900 dark:border-slate-700"
                                />

                                <Link className="absolute right-3 top-7 btn btn-outline-dark px-2 py-1 transform -translate-y-1/2 text-gray-400 cursor-pointer select-none" to="/manage-customer/add" state={{ from: "addinvoice" }}>
                                    <FaPlus size={20} />

                                </Link>


                                {filteredSuppliers.length > 0 && (
                                    <ul className="absolute left-0 w-full border rounded bg-white shadow-md mt-1 z-10">
                                        {filteredSuppliers.map((s) => (
                                            <li key={s.value} className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => {
                                                    const selected = customers.find((c) => c.label === s.label);
                                                    if (selected) {
                                                        setSelectedSupplier(selected.label);
                                                        setCustomerId(selected.id);
                                                        setShippingAddress(selected.shippingAddress);
                                                        setBillingAddress(selected.billingAddress);
                                                        setSearchTerm(selected.label);
                                                        setFilteredSuppliers([]);
                                                    }
                                                }}




                                            >
                                                {s.label}
                                            </li>
                                        ))}
                                    </ul>

                                )}
                            </div>

                            {/* Address Invoice */}
                            <div className="flex flex-col sm:flex-row border p-2 rounded gap-4">
                                <div className="flex flex-col">
                                    <strong>Bill to</strong>
                                    <p><strong>Name :</strong> <span>{selectedSupplier || "N/A"}</span></p>
                                    <p><strong>Address :</strong> <span>{billingAddress || "N/A"}</span></p>
                                </div>

                                <div className="flex flex-col">
                                    <strong>Ship to</strong>
                                    <p><strong>Name :</strong> <span>{selectedSupplier || "N/A"}</span></p>
                                    <p><strong>Address :</strong> <span>{shippingAddress || "N/A"}</span></p>

                                </div>
                            </div>


                        </div>

                        {/* Right Side: Full-height Textarea */}
                        <div>
                            <label className="form-label">Description</label>

                            <textarea
                                label="Description"
                                id="details"
                                placeholder="Enter Invoice details..."
                                className=" w-full border p-2 dark:bg-slate-900 dark:border-slate-700 rounded-md"
                                {...register("description", { required: "Invoice description is required." })}
                            />
                            {errors.description && (
                                <p className="text-red-500">{errors.description.message}</p>
                            )}

                        </div>
                    </div>


                    <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-1 gap-4 mt-4">

                        <div>
                            <label className="text-sm font-medium text-black-500 dark:text-slate-300">Invoice Number</label>
                            <div className="flex rounded-lg">
                                <span className="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:bg-slate-900 dark:border-slate-700">INV-</span>
                                <input
                                    type="text"
                                    value={invoiceNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                        setInvoiceNumber(value);
                                    }}
                                    className="dark:bg-slate-900 dark:border-slate-700 py-1.5 sm:py-2 px-3 pe-11 block w-full border border-gray-200 rounded-e-lg sm:text-sm "
                                />
                            </div>

                        </div>
                        <div>
                            <label className="text-sm font-medium text-black-500 dark:text-slate-300">Invoice Upload</label>
                            <Fileinput
                                name="basic"
                                selectedFile={selectedFile}
                                onChange={handleFileChange}
                            />

                            {(selectedFile || (invoiceData?.image && typeof invoiceData.image === 'string' && invoiceData.image.trim() !== '')) && (
                                <div className="mt-2 flex items-center gap-2">
                                    {selectedFile ? (
                                        selectedFile.type === 'application/pdf' ? (
                                            <a
                                                href={URL.createObjectURL(selectedFile)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline flex items-center gap-1"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v4h5v12H6z" />
                                                </svg>
                                                View Uploaded PDF
                                            </a>
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Uploaded Invoice"
                                                className="h-20 border rounded"
                                                onError={(e) => (e.target.style.display = 'none')} // Hide image if it fails to load
                                            />
                                        )
                                    ) : (
                                        invoiceData.image.endsWith(".pdf") ? (
                                            <a
                                                href={invoiceData.image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline flex items-center gap-1"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v4h5v12H6z" />
                                                </svg>
                                                View PDF
                                            </a>
                                        ) : (
                                            <img
                                                src={invoiceData.image}
                                                alt="Invoice"
                                                className="h-20 border rounded"
                                                onError={(e) => (e.target.style.display = 'none')} // Hide image if it fails to load
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                        <div>
                            <label className="text-sm font-medium text-black-500 dark:text-slate-300">Invoice Date</label>
                            <input
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700"
                            />
                        </div>
                    </div>


                    {/* Spare Parts Selection */}
                    <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black-500 dark:text-slate-300 ">Products</label>
                            <div className="flex items-center gap-2 mt-2">
                                <select onChange={(e) => setSelectedProduct(e.target.value)} className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700">
                                    <option value="">Select Product</option>
                                    {product.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.product_name}
                                        </option>
                                    ))}
                                </select>

                                <button type="button" onClick={addProduct} className="px-3 py-2 btn btn-dark text-white rounded">+</button>

                            </div>
                        </div>
                    </div>

                    <Card bodyClass="p-0 overflow-x-auto">
                        <table className="w-full border min-w-[600px] ">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-slate-900 dark:border-0">
                                    <th className="p-2 border">Item</th>
                                    <th className="p-2 border">Description</th>
                                    <th className="p-2 border">Qty</th>
                                    <th className="p-2 border">Rate</th>
                                    <th className="p-2 border">Amount</th>
                                    <th className="p-2 border"><IoMdSettings /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectProducts.map((part, index) => (
                                    <tr key={part.id}>
                                        <td className="p-2 border">
                                            <input
                                                type="text"
                                                value={part.name}
                                                readOnly
                                                className="w-full py-2 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <textarea
                                                value={part.description}
                                                onChange={(e) => updatePart(index, "description", e.target.value)}
                                                className="w-full py-2 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                                            ></textarea>
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                type="number"
                                                value={part.qty === "" ? "" : part.qty}
                                                onChange={(e) => updatePart(index, "qty", Number(e.target.value))}
                                                className="w-full py-2 px-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <div className="flex rounded-md overflow-hidden border  border-gray-200 dark:border-slate-700">
                                                <span className="px-4 flex items-center bg-gray-50 text-sm text-gray-500 dark:bg-slate-900 dark:text-neutral-400 border-r dark:border-slate-700 ">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={part.rate}
                                                    onChange={(e) => updatePart(index, "rate", parseFloat(e.target.value))}
                                                    className="w-full py-2 px-2 text-sm border-0 focus:ring-0 dark:bg-slate-900 dark:text-white"
                                                />

                                            </div>
                                        </td>

                                        <td className="p-2 border text-center">
                                            ${part.qty * part.rate}
                                        </td>
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


                    {/* Totals */}
                    <div className="grid justify-items-end text-right text-lg font-semibold mt-4 space-y-1">
                        <span>
                            Sub Total: $
                            {selectProducts.reduce((sum, part) => sum + part.qty * part.rate, 0).toFixed(2)}
                        </span>
                        <span>
                            HST (13%): $
                            {(selectProducts.reduce((sum, part) => sum + part.qty * part.rate, 0) * 0.13).toFixed(2)}
                        </span>
                        <span>
                            Total: $
                            {(selectProducts.reduce((sum, part) => sum + part.qty * part.rate, 0) * 1.13).toFixed(2)}
                        </span>
                    </div>


                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            text="Save"
                            className="btn btn-dark px-6 py-2"
                            onClick={handleSubmit((data) => onSubmit(data, false))} 
                        />
                        <Button
                            type="button"
                            text="Save & Send"
                            className="btn btn-dark px-6 py-2"
                            onClick={handleSubmit((data) => onSubmit(data, true))}
                        />
                    </div>
                </form>
            </Card>
        </div>

    );
};
