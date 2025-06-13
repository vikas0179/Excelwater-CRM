import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import LoaderWrapperView from "@/components/LoaderWrapperView";
import UserTable from "../userTable";
import { API_MANAGE_SUPPLIER_LIST, API_DELETE_SUPPLIER } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { toast } from "react-toastify";



export const ManagesSupplier = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);


    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_MANAGE_SUPPLIER_LIST}?page=${pageIndex}&size=${size}`);
            setLoading(false);

            console.log("API Response:", response.data); 

            if (response.data && Array.isArray(response.data.data)) {
                setData(response.data.data);
                setAllData(response.data);
            } else {
                setData([]);
                setAllData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setAllData([]);
        }
    };


    useEffect(() => {
        getData();
    }, [pageIndex]);

    const handleEditSupplier = async (supplier) => {
        console.log("Editing Supplier ID:", supplier.id);
        console.log("Supplier Data:", supplier);

        if (!supplier) {
            toast.error("Supplier data not available. Please try again.");
            return;
        }

        navigate(`/manage-supplier/add/${supplier.id}`, {
            state: { supplierData: supplier }
        });
    };





    const handleDeleteSupplier = async (supplierId) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("id", supplierId);

            console.log("Deleting Supplier ID:", supplierId);

            const response = await Api.post(API_DELETE_SUPPLIER, formData);

            console.log("Delete API Response:", response);

            if (response && response.status === "RC200") {
        await getData();

            } else {
                throw new Error(response.message || "Failed to delete supplier.");
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            toast.error(error.message || "Error deleting supplier.");
        } finally {
            setLoading(false);
        }
    };






    const COLUMNS = [
        {
            Header: "Name",
            accessor: "name",
            Cell: ({ row }) => {
                const { logo, logo_name, name } = row.original;

                return (
                    <div className="flex items-center gap-2 w-full">
                        {logo_name?.trim() ? (
                            <img
                                src={logo}
                                alt="Supplier Logo"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : null}
                        <span>{name}</span>
                    </div>
                );
            }
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Phone",
            accessor: "phone"
        },
        {
            Header: "Address",
            accessor: "address"
        },
        {
            Header: "Raw Material Name",
            accessor: "spare_part_names"
        },
        {
            Header: <div className="text-end">Action</div>,
            accessor: "id",
            Cell: ({ row }) => (
                <div className="flex space-x-3 rtl:space-x-reverse justify-end">
                    {/* Edit Button */}
                    <button
                        className="action-btn"
                        type="button"
                        onClick={() => handleEditSupplier(row.original)}
                    >
                        <Icon icon="heroicons:pencil-square" />
                    </button>

                    {/* Delete Button */}
                    <button
                        className="action-btn text-red-500"
                        type="button"
                        onClick={() => handleDeleteSupplier(row.original.id)}
                    >
                        <Icon icon="heroicons:trash" />
                    </button>
                </div>
            )
        }
    ];


    return (
        <>
            <div>
                <div className="md:flex justify-between items-center">
                    <Breadcrumbs title="Suppliers" />
                </div>
                <Card>
                    <div className="md:flex justify-between items-center flex-wrap ">
                        <div className="grow flex items-center flex-wrap"></div>
                        <div className="flex items-center ml-2 md:mt-0 mt-2">
                            <Textinput placeholder="search" />
                            <button
                                className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                                onClick={() => navigate("/manage-supplier/add", { state: { from: "manage-supplier" } })}
                            >
                                <Icon icon="heroicons-outline:plus" />
                                New
                            </button>

                        </div>
                    </div>
                    <div>


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
                                Sname="suppliers"
                            />

                        </LoaderWrapperView>
                    </div>

                </Card>
            </div>

        </>
    );
};
