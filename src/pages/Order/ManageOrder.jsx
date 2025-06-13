import React, { useEffect, useState, Fragment } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Icon } from "@iconify/react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import { toast } from "react-toastify";
import { API_MANAGE_ORDER_LIST, API_DELETE_ORDER, API_EDIT_ORDER_DETAILS } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import Fileinput from "@/components/ui/Fileinput";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "@/components/ui/Textarea";
import Tooltip from "@/components/ui/Tooltip";
import { get } from "react-hook-form";


export const ManageOrder = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState({});
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isEditable, setIsEditable] = useState(true);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [description, setDescription] = useState("");
    const [deliveryQty, setDeliveryQty] = useState("");

    console.log("deliveryQty", deliveryQty)

    useEffect(() => {
        if (selectedOrder) {
            let fileUrl = selectedOrder.invoice_file ? selectedOrder.invoice_file.replace(/\\/g, '') : null;

            console.log("Final Invoice File URL:", fileUrl); // ✅ Debugging

            setDescription(selectedOrder.invoice_desc || "");
            setUploadedFileUrl(fileUrl);
            setDeliveryQty(selectedOrder.order_items?.[0]?.delivery_qty || 0);

            if (selectedOrder.invoice_desc || selectedOrder.order_items?.[0]?.delivery_qty) {
                setIsEditable(false);
            }
        }
    }, [selectedOrder]);







    const handleInvoiceFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setUploadedFileUrl(fileUrl); // ✅ Set preview URL
        }
    };


    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_MANAGE_ORDER_LIST}?page=${pageIndex}&size=${size}`);

            setLoading(false);
            if (response.data && Array.isArray(response.data.data)) {
                setData(response.data.data);
                setAllData(response.data);
            } else {
                setData([]);
                setAllData({});
            }
        } catch (error) {
            console.error("API fetch error:", error);
            setData([]);
            setAllData({});
            setLoading(false);
        }
    };


    useEffect(() => {
        getData();
    }, [pageIndex]);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleEditOrder = async (order) => {

        try {
            if (!order) {
                toast.error("Order data not available. Please try again.");
                return;
            }

           
            setSelectedOrder(order);

        
            navigate(`/manage-order/add/${order.id}`, {
                state: { orderData: order }
            });

        } catch (error) {
            console.error("Error navigating:", error);
            toast.error("Failed to navigate.");
        }
    };


    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this Raw Material Order?")) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("id", orderId);

            const response = await Api.post(API_DELETE_ORDER, formData);


            if (response && response.status === "RC200") {
             
             await getData();

            } else {
                throw new Error(response.message || "Failed to delete Order.");
            }
        } catch (error) {
            console.error("Error deleting Order:", error);
            toast.error(error.message || "Error deleting Order.");
        } finally {
            setLoading(false);
        }
    };

const handleSave = async () => {
    if (!selectedOrder) {
        toast.error("No order selected.");
        return;
    }

    const formData = new FormData();
    formData.append("id", selectedOrder.id);
    formData.append("invoice_desc", description);

    if (selectedFile) {
        formData.append("invoice_file", selectedFile);
    }

    const orderItems = selectedOrder.order_items || [];

    if (orderItems.length === 0) {
        toast.error("No order items found.");
        return;
    }

    orderItems.forEach(item => {
        formData.append("order_item_id[]", item.id);
        formData.append("delivery_qty[]", deliveryQty); 
    });

    try {
        setLoading(true);
        const response = await Api.post(API_EDIT_ORDER_DETAILS, formData);

        if (response && response.status === "RC200") {

            // ✅ Update state
            const updatedOrder = {
                ...selectedOrder,
                invoice_desc: description,
                invoice_file: uploadedFileUrl,
                order_items: orderItems.map(item => ({
                    ...item,
                    delivery_qty: Number(deliveryQty), 
                }))
            };

            setSelectedOrder(updatedOrder);
            setIsEditable(false);
            getData(); // Refresh list
            setIsModalOpen(false);
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error("Error updating order:", error);
        toast.error(error.message || "Error updating order.");
    } finally {
        setLoading(false);
    }
};



    const COLUMNS = [
        {
            Header: "Order ID",
            accessor: "id",
        },
        {
            Header: "Supplier Name",
            accessor: "suppliername",
            Cell: ({ row }) => {

                const supplierName = row.original.stock_items?.[0]?.suppliername || "N/A";
                return <span>{supplierName}</span>;
            }
        },


        {
            Header: "Total Amount",
            accessor: "total_amount",
            Cell: ({ cell }) => <span>${cell.value}</span>,
        },
        {
            Header: "Status",
            accessor: "status_label",
            Cell: ({ row }) => {
                const status = row.original.order_items?.[0]?.status_label || "N/A";
                return <span>{status}</span>;
            }
        },
        {
            Header: <div className="text-end">Action</div>,
            accessor: "actions",
            Cell: ({ row }) => (
                <div className="flex space-x-3 justify-end">
                    <Tooltip content="View Order Details" placement="top">
                        <button
                            className="action-btn text-blue-500"
                            type="button"
                            onClick={() => handleViewDetails(row.original)}
                        >
                            <Icon icon="heroicons:eye" />
                        </button>
                    </Tooltip>
                    {/* Edit Button */}
                    <button
                        className="action-btn"
                        type="button"
                        onClick={() => handleEditOrder(row.original)}
                    >
                        <Icon icon="heroicons:pencil-square" />
                    </button>
                    {/* Delete Button */}
                    <button
                        className="action-btn text-red-500"
                        type="button"
                        onClick={() => handleDeleteOrder(row.original.id)}
                    >
                        <Icon icon="heroicons:trash" />
                    </button>

                </div>
            ),
        },
    ];

    return (
        <>
            <div className="md:flex justify-between items-center">
                <Breadcrumbs title="Material Order   " />
            </div>
            <Card>
                <div className="md:flex justify-between items-center flex-wrap">
                    <Textinput placeholder="Search" />
                    <button
                        className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                        onClick={() => navigate("/manage-order/add")}
                    >
                        <Icon icon="heroicons-outline:plus" />
                        New
                    </button>
                </div>

                <div className="mt-8">
                    <LoaderWrapperView isLoading={loading}>
                        <UserTable
                            columns={COLUMNS}
                            data={data}
                            allData={allData}
                            setPageIndex={setPageIndex}
                            pageIndex={pageIndex}
                            setSize={setSize}
                            Sname="Raw Material Orders"
                        />

                    </LoaderWrapperView>
                </div>
            </Card>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center w-full">
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div style={{ backgroundColor: "black" }} className="bg-black text-white p-4 relative">
                                    <h6 className="text-white font-semibold text-left">Order Details</h6>
                                    <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setIsModalOpen(false)}>
                                        <Icon icon="heroicons-outline:x" className="w-6 h-6 border border-white rounded-md" />
                                    </button>
                                </div>
                                <div className="px-6 pt-4">
                                    <label className="block font-semibold mb-2">Invoice Upload</label>
                                    <Fileinput
                                        name="basic"
                                        selectedFile={selectedFile}
                                        onChange={handleInvoiceFileChange}
                                        disabled={!!uploadedFileUrl}  // File preview hone ke baad disable ho jayega
                                    />


                                    {uploadedFileUrl && uploadedFileUrl.startsWith("http") && (
                                        <div className="border block p-2 rounded bg-gray-100 mt-2 ">
                                            <p className="text-sm text-gray-700 mb-2">File Preview:</p>

                                            {/* Image Preview */}
                                            <img
                                                style={{ width: '100%', maxWidth: '100px', height: 'auto' }}
                                                src={uploadedFileUrl}
                                                alt="Invoice Preview"
                                                className="rounded-md"
                                                onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails
                                            />

                                            {/*  Download Button */}
                                            <a
                                                href={uploadedFileUrl}
                                                download={uploadedFileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-dark text-white w-full max-w-[100px] px-3 py-2 rounded-md flex justify-center items-center mt-3"
                                            >
                                                <Icon icon="heroicons-outline:download" className="w-5 h-5 mr-2" />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    )}


                                </div>



                                <div className="px-6 pt-4">
                                    {isEditable ? (
                                        <Textarea
                                            label="Description"
                                            id="pn4"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    ) : (<>
                                        <label className="block font-semibold mb-2">Description</label>
                                        <div className="border p-2 rounded bg-gray-100">
                                            <p className="text-sm text-gray-700">{description}</p>
                                        </div>
                                    </>)}
                                </div>


                                <div className="px-6 pt-2">
                                    <table className="w-full border-collapse border border-gray-300 mt-3">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 px-4 py-2">Item</th>
                                                <th className="border border-gray-300 px-4 py-2">Desc</th>
                                                <th className="border border-gray-300 px-4 py-2">Qty</th>
                                                <th className="border border-gray-300 px-4 py-2">Delivery Qty</th>
                                                <th className="border border-gray-300 px-4 py-2">Rate</th>
                                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder?.order_items?.length > 0 ? (
                                                selectedOrder.order_items.map((item, index) => (
                                                    <tr key={index} className="border border-gray-300">
                                                        <td className="border border-gray-300 px-4 py-2">{item.item}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{item.desc}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{item.qty}</td>
                                                        <td className="px-4 py-2">


                                                            {isEditable ? (
                                                                <Textinput
                                                                    key={selectedOrder?.order_items?.[0]?.delivery_qty} // ✅ Ensure re-render
                                                                    type="number"
                                                                    placeholder="Enter Qty"
                                                                    value={deliveryQty}
                                                                    onChange={(e) => setDeliveryQty(e.target.value)}
                                                                />

                                                            ) : (
                                                                <div className="border p-2 rounded bg-gray-100">
                                                                    <p className="text-sm text-gray-700">{deliveryQty}</p>
                                                                </div>
                                                            )}

                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-2">{item.rate}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-2">No Items Available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end p-4">
                                    <div className="flex justify-end p-4">
                                        {isEditable && (
                                            <button className="btn btn-dark" onClick={handleSave}>Save</button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
