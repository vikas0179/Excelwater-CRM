import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { API_INVOCIE_MANAGE_LIST, API_DELETE_INVOICE, API_INVOICE_CHANGE_VOID_STATUS, API_INVOICE_VOIDED_DATA } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import Tooltip from "@/components/ui/Tooltip";
import { Dialog, Transition } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { Popover } from "@headlessui/react";
import { Switch } from '@headlessui/react';


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
    const [showVoided, setShowVoided] = useState(false);
    const [isVoidedView, setIsVoidedView] = useState(false);


    const handleToggleView = () => {
        const newState = !isVoidedView;
        setIsVoidedView(newState);
        localStorage.setItem("voidedView", newState);
    };

    useEffect(() => {
        const savedView = localStorage.getItem("voidedView");
        if (savedView !== null) {
            setIsVoidedView(savedView === "true");
        }
    }, []);





    const getData = async () => {
        try {
            setLoading(true);
            const apiUrl = isVoidedView
                ? API_INVOICE_VOIDED_DATA
                : `${API_INVOCIE_MANAGE_LIST}?page=${pageIndex}&size=${size}`;

            const response = await Api.get(apiUrl);
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
            setLoading(false);
        }
    };



    useEffect(() => {
        getData();
    }, [pageIndex, isVoidedView]);




    const handleEditOrder = async (invoice) => {

        try {
            if (!invoice) {
                toast.error("invoice data not available. Please try again.");
                return;
            }

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

    const handleVoidStatusChange = async (invoiceId, status) => {
        try {
            const formData = new FormData();
            formData.append("id", invoiceId);
            formData.append("status", status ? 1 : 0);

            await Api.post(API_INVOICE_CHANGE_VOID_STATUS, formData);
            window.location.reload();
        } catch (error) {
            toast.error("Failed to update void status.");
        }
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
            accessor: "image",
            Cell: ({ cell }) => {
                const row = cell.row.original;
                const imageName = row.image_name;
                const imageUrl = row.image;


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
            Header: "Void",
            accessor: "void_status",
            Cell: ({ row }) => {
                const invoice = row.original;
                const [enabled, setEnabled] = useState(invoice.void_status === 1);

                const handleToggle = async () => {
                    const newStatus = !enabled;
                    setEnabled(newStatus);
                    await handleVoidStatusChange(invoice.id, newStatus);
                };

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={enabled}
                            onChange={handleToggle}
                            className={`${enabled ? "bg-indigo-600" : "bg-gray-300"
                                } relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                        >
                            <span
                                className={`${enabled ? "translate-x-5" : "translate-x-0"
                                    } pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                        </Switch>
                        <span className="text-sm">{enabled ? "On" : "Void"}</span>
                    </div>
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

                    </div>
                );
            },
        }

    ];


    return (
        <>
            <div className="md:flex justify-between items-center">
                <Breadcrumbs title="invoice" />



            </div>
            <Card>
                <div className="md:flex justify-between items-center flex-wrap ">
                    <button
                        className={`btn btn-outline-dark btn-sm text-center flex items-center h-[38px] ${isVoidedView ? ' text-black-500' : ''}`}
                        onClick={handleToggleView}
                    >
                        {isVoidedView ? 'Show Active' : 'Void Invoices'}
                    </button>




                    <div className="md:flex justify-between items-center flex-wrap">



                        <div className="flex items-center gap-4 md:mt-0 mt-2">
                            <Textinput placeholder="search" />
                            <button
                                className="btn btn-outline-dark btn-sm text-center flex items-center h-[38px]"
                                onClick={() => {
                                    navigate("/manage-invoice/add");
                                }}
                            >
                                <Icon icon="heroicons-outline:plus" />
                                New
                            </button>
                        </div>
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
                            Sname="invoices"
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
