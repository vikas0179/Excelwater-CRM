import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { API_INVOCIE_MANAGE_LIST, API_DELETE_INVOICE } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import Tooltip from "@/components/ui/Tooltip";
import { Dialog, Transition } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { Popover } from "@headlessui/react";



export const ManageInvoice = () => {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [allData, setAllData] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isQrOpen, setIsQrOpen] = useState(false);
    const [qrInvoice, setQrInvoice] = useState(null);


    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_INVOCIE_MANAGE_LIST}?page=${pageIndex}&size=${size}`);
            setLoading(false);
            if (response.data && Array.isArray(response.data.data)) {
                setData(response.data.data);
                setAllData(response.data);
            } else {
                setData([]);
                setAllData({});
            }
        } catch (error) {
            setData([]);
            setAllData({});
        }
    };

    useEffect(() => {
        getData();
    }, [pageIndex]);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this Order?")) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("id", orderId);

            const response = await Api.post(API_DELETE_INVOICE, formData);


            if (response && response.status === "RC200") {
               
                window.location.reload();

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

    const handleEditOrder = async (invoice) => {

        try {
            if (!invoice) {
                toast.error("invoice data not available. Please try again.");
                return;
            }



            // Navigate karte waqt order data bhejna
            navigate(`/manage-invoice/add/${invoice.id}`, {
                state: { invoiceData: invoice }
            });

        } catch (error) {
            console.error("Error navigating:", error);
            toast.error("Failed to navigate.");
        }
    };
    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };




    const COLUMNS = [
        {
            Header: "Invoice Date",
            accessor: "invoice_date",
            Cell: ({ value }) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            Header: "Invoice Number",
            accessor: "invoice_no",
            Cell: ({ row }) => (
                <button
                    className="text-blue-600 font-semibold hover:text-blue-800"
                    onClick={() => handleViewDetails(row.original)}
                >
                    {row.original.invoice_no}
                </button>
            )
        },

        {
            Header: "Customer Name",
            accessor: "customer_name",
        },
        {
            Header: "Billing Address",
            accessor: "bill_to",
        },
        {
            Header: "Shipping Address",
            accessor: "ship_to",
        },
        {
            Header: "Total Amount",
            accessor: "total_amount",
            Cell: ({ cell }) => <span>${cell.value}</span>,
        },
        {
            Header: "Payment Status",
            // accessor: "total_amount",
            // Cell: ({ cell }) => <span>${cell.value}</span>,
        },
        {
            Header: "File",
            accessor: "image", // You can use either "image" or "image_name", accessor is required
            Cell: ({ cell }) => {
                const row = cell.row.original;
                const imageName = row.image_name;
                const imageUrl = row.image;

                // Agar image_name null ya empty ho, kuch return nahi kare
                if (!imageName) return null;

                const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                const isPdf = imageUrl.toLowerCase().endsWith(".pdf");

                return (
                    <a
                        href={imageUrl}
                        download={fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 flex items-center"
                        title="Download File"
                    >
                        <Icon
                            icon={isPdf ? "mdi:file-pdf-outline" : "mdi:file-outline"}
                            width={24}
                            height={24}
                        />
                    </a>
                );
            },
        },
        {
            Header: "Action",
            accessor: "actions",
            Cell: ({ row }) => {
                const invoice = row.original;
                const qrUrl = `http://192.168.29.199:5173/manage_invoice/invoice_detail/${invoice.invoice_no}`;

                return (
                    <div className="flex space-x-3 items-center">

                        {/* QR Code popover */}
                        <button
                            className="action-btn text-blue-500"
                            title="QR Code"
                            onClick={() => {
                                setQrInvoice(invoice);
                                setIsQrOpen(true);
                            }}
                        >
                            <Icon icon="heroicons-outline:qrcode" />
                        </button>


                        {/* Print Invoice */}
                        <Tooltip content="Print Invoice" placement="top">
                            <button
                                className="action-btn text-green-600"
                                onClick={() =>
                                    navigate(`/manage-invoice/invoice/${invoice.id}`, {
                                        state: { invoiceData: invoice },
                                    })
                                }
                            >
                                <Icon icon="heroicons:printer" />
                            </button>
                        </Tooltip>

                        {/* Edit Invoice */}
                        <button
                            className="action-btn"
                            onClick={() => handleEditOrder(invoice)}
                        >
                            <Icon icon="heroicons:pencil-square" />
                        </button>

                        {/* Delete Invoice */}
                        <button
                            className="action-btn text-red-500"
                            onClick={() => handleDeleteOrder(invoice.id)}
                        >
                            <Icon icon="heroicons:trash" />
                        </button>
                    </div>
                );
            },
        }

    ];



    return (
        <>
            <div className="md:flex justify-between items-center">
                <Breadcrumbs title="invoice" />

                {/* <div className="flex items-center ml-2 mb-6 md:mt-0 mt-2">
                    <button className="btn btn-dark btn-sm text-center ml-4 flex items-center h-[36px]">
                        <Icon icon="uiw:file-excel" />
                        &nbsp; Export Suppliers
                    </button>
                </div> */}

            </div>
            <Card>
                <div className="md:flex justify-between items-center flex-wrap ">
                    <div className="grow flex items-center flex-wrap">
                    </div>
                    <div className="flex items-center ml-2 md:mt-0 mt-2">
                        <Textinput
                            placeholder="search"
                        />
                        <button
                            className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                            onClick={() => {
                                navigate("/manage-invoice/add");
                            }}
                        >
                            <Icon icon="heroicons-outline:plus" />
                            New
                        </button>
                    </div>
                </div>

                <div className='mt-8'>
                    <LoaderWrapperView isLoading={loading}>
                        <UserTable
                            columns={COLUMNS}
                            data={data}
                            allData={allData}
                            setPageIndex={setPageIndex}
                            pageIndex={pageIndex}
                            setSize={setSize}
                            Sname="products"
                        />
                    </LoaderWrapperView>
                </div>

            </Card>

            <Transition appear show={isModalOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center w-full">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">

                                    {/* Header */}
                                    <div style={{ backgroundColor: "black" }} className="bg-black text-white p-4 relative">
                                        <h6 className="text-white font-semibold text-left">Invoice Details</h6>
                                        <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setIsModalOpen(false)}>
                                            <Icon icon="heroicons-outline:x" className="w-6 h-6 border border-white rounded-md" />
                                        </button>
                                    </div>

                                    {/* Invoice Info */}
                                    <div className="p-6 text-sm text-gray-800">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div><strong>Invoice No:</strong> {selectedInvoice?.invoice_no}</div>
                                            <div>
                                                <strong>Date:</strong>{" "}
                                                {selectedInvoice?.invoice_date
                                                    ? new Date(selectedInvoice.invoice_date).toLocaleDateString("en-GB")
                                                    : ""}
                                            </div>

                                            <div><strong>Customer:</strong> {selectedInvoice?.customer_name}</div>
                                            <div><strong>Bill To:</strong> {selectedInvoice?.bill_to}</div>
                                            <div><strong>Ship To:</strong> {selectedInvoice?.ship_to}</div>
                                            <div><strong>Description:</strong> {selectedInvoice?.desc}</div>
                                        </div>

                                        {/* Item Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border px-4 py-2 text-left">Item</th>
                                                        <th className="border px-4 py-2 text-left">Description</th>
                                                        <th className="border px-4 py-2 text-center">Qty</th>
                                                        <th className="border px-4 py-2 text-right">Rate</th>
                                                        <th className="border px-4 py-2 text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedInvoice?.invoice_detail?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="border px-4 py-2">{item.item}</td>
                                                            <td className="border px-4 py-2">{item.desc}</td>
                                                            <td className="border px-4 py-2 text-center">{item.qty}</td>
                                                            <td className="border px-4 py-2 text-right">${item.rate}</td>
                                                            <td className="border px-4 py-2 text-right">${item.amount}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Total */}
                                        <div className="mt-4 text-right font-semibold text-base">
                                            Total: ${selectedInvoice?.total_amount}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isQrOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsQrOpen(false)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">

                                    <div style={{ backgroundColor: "black" }} className="bg-black text-white p-4 relative">
                                        <h6 className="text-white font-semibold text-left">QR Code</h6>
                                        <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setIsQrOpen(false)}>
                                            <Icon icon="heroicons-outline:x" className="w-6 h-6 border border-white rounded-md" />
                                        </button>
                                    </div>


                                    <div className="text-center  p-3">
                                        {qrInvoice && (
                                            <>
                                                <div className='flex items-center justify-center'>
                                                    <QRCodeCanvas
                                                        id="qrCodeEl"
                                                        value={`http://192.168.29.199:5173/manage_invoice/invoice_detail/${qrInvoice.invoice_no}`}
                                                        size={200}
                                                    />
                                                </div>


                                                <button
                                                    onClick={() => {
                                                        const canvas = document.getElementById("qrCodeEl");
                                                        const pngUrl = canvas
                                                            .toDataURL("image/png")
                                                            .replace("image/png", "image/octet-stream");

                                                        const downloadLink = document.createElement("a");
                                                        downloadLink.href = pngUrl;
                                                        downloadLink.download = `${qrInvoice.invoice_no}_QRCode.png`;
                                                        document.body.appendChild(downloadLink);
                                                        downloadLink.click();
                                                        document.body.removeChild(downloadLink);
                                                    }}
                                                    className="btn btn-sm btn-dark mt-4"
                                                >
                                                    Download QR Code
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>





        </>
    );
};
