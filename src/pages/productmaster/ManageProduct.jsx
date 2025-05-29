import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { API_MANAGE_PRODUCT_LIST, API_DELETE_PRODUCT } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { toast } from "react-toastify";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import Modal from '@/components/ui/Modal';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Tooltip from "@/components/ui/Tooltip";


export const ManageProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_MANAGE_PRODUCT_LIST}?page=${pageIndex}&size=${size}`);
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

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this Product?")) return;
    
        try {
            setLoading(true);
    
            const formData = new FormData();
            formData.append("id", productId);
    
            const response = await Api.post(API_DELETE_PRODUCT, formData);
    
    
            if (response && response.status === "RC200") {
              
                    window.location.reload();
                    
           
            } else {
                throw new Error(response.message || "Failed to delete Product.");
            }
        } catch (error) {
            toast.error(error.message || "Error deleting Product.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        try {
            if (!product) {
                toast.error("Product data not available. Please try again.");
                return;
            }
    
            navigate(`/manage-product/add/${product.id}`, {
                state: { productData: product }
            });
    
        } catch (error) {
            toast.error("Failed to navigate.");
        }
    };
    

    const COLUMNS = [
        
        {
            Header: "Product Name",
            accessor: "product_name",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <img
                        src={row.original.image}
                        alt="Product"
                        className="w-12 h-12 rounded object-cover"
                        // onError={(e) => (e.target.src = "/default-image.png")}
                    />
                    <span>{row.original.product_name}</span>
                </div>
            )
        },   
        {
            Header: "Product Code",
            accessor: "product_code"
        },
        {
            Header: "Price",
            accessor: "price",
            Cell: ({ cell }) => <span>${cell.value}</span>
        },
        {
            Header: "Description",
            accessor: "desc",
            Cell: ({ cell }) => (
                <span className="truncate w-48 block">{cell.value.substring(0, 50)}...</span>
            )
        },
        {
            Header: <div className="text-end">Action</div>,
            accessor: "id",
            Cell: ({ row }) => (
                <div className="flex space-x-3 justify-end">
                                        <Tooltip content="Spare Parts Detail" placement="top">
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
                                                onClick={() => handleEditProduct(row.original)}
                                            >
                                                <Icon icon="heroicons:pencil-square" />
                                            </button>

                    <button
                                                className="action-btn text-red-500"
                                                type="button"
                                                onClick={() => handleDeleteProduct(row.original.id)}
                                            >
                                                <Icon icon="heroicons:trash" />
                                            </button>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="md:flex justify-between items-center">
                <Breadcrumbs title="Products" />
            </div>
            <Card>
                <div className="md:flex justify-between items-center flex-wrap">
                    <div className="grow flex items-center flex-wrap"></div>
                    <div className="flex items-center ml-2 md:mt-0 mt-2">
                        <Textinput placeholder="search" />
                        <button
                            className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                            onClick={() => navigate("/manage-product/add")}
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

            {/* spare parts Details Modal */}
            <Transition appear show={modalOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    
                    {/* Header with Black Background */}
                    <div style={{ backgroundColor: 'black'}} className="text-white p-4 relative">
                        <h6 className="font-semibold text-white text-left">Spare Parts Detail</h6>

                        {/* Close Button */}
                        <button 
                            className="absolute top-4 right-4 text-white hover:text-gray-300"
                            onClick={() => setModalOpen(false)}
                        >
                            <Icon icon="heroicons-outline:x" className="w-6 h-6 border border-white rounded-md" />
                        </button>
                    </div>

                    {/* Table Section */}
                    <div className="px-6 pb-6 pt-4">
                        <table className="w-full border-collapse border border-gray-300 mt-3">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">Item</th>
                                    <th className="border border-gray-300 px-4 py-2">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProduct?.spare_part?.length > 0 ? (
                                    selectedProduct.spare_part.map((part, index) => (
                                        <tr key={index} className="border border-gray-300">
                                            <td className="border border-gray-300 px-4 py-2">{part.item}</td>
                                            <td className="border border-gray-300 px-4 py-2">{part.qty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center py-2">No Spare Parts Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </Dialog.Panel>
            </div>
        </div>
    </Dialog>
</Transition>


        </>
    );
};