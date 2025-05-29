import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { API_MANAGE_SPAREPARTS_LIST, API_DELETE_SPAREPARTS } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { toast } from "react-toastify";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import { useState, useEffect } from 'react';

export const ManageSpareparts = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_MANAGE_SPAREPARTS_LIST}?page=${pageIndex}&size=${size}`);
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

    const handleEditSparePart = async (spareparts) => {
        try {


            if (!allData || Object.keys(allData).length === 0) {
                toast.error("Supplier data not available. Please try again.");
                return;
            }

            navigate(`/manage-sparepart/add/${spareparts.id}`, {
                state: { sparepartsData: spareparts }
            });

        } catch (error) {
            console.error("Error navigating:", error);
            toast.error("Failed to navigate.");
        }
    };

    const handleDeleteSparePart = async (sparepartsId) => {
        if (!window.confirm("Are you sure you want to delete this spareparts?")) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("id", sparepartsId);

            const response = await Api.post(API_DELETE_SPAREPARTS, formData);


            if (response && response.status === "RC200") {
               
                window.location.reload();

            } else {
                throw new Error(response.message || "Failed to delete sparepart.");
            }
        } catch (error) {
            console.error("Error deleting sparepart:", error);
            toast.error(error.message || "Error deleting sparepart.");
        } finally {
            setLoading(false);
        }
    };


    const COLUMNS = [
        {
            Header: "Material Name",
            accessor: "part_name",
            Cell: ({ row }) => {
                const { image, image_name, part_name } = row.original;

                return (
                    <div className="flex items-center gap-2 w-full">
                        {image_name?.trim() ? (
                            <img
                                src={image}
                                alt="Spare Part"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : null}
                        <span>{part_name}</span>
                    </div>
                );
            }
        },
        {
            Header: "Material Number",
            accessor: "part_number"
        },
        {
            Header: "Price",
            accessor: "price",
            Cell: ({ cell }) => <span>${cell.value}</span>
        },
        {
            Header: "Min Alert Qty",
            accessor: "min_alert_qty"
        },
        {
            Header: " Opening Stock ",
            accessor: "opening_stock"
        },
        {
            Header: "Stock Qty",
            accessor: "stock_qty"
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
                <div className="flex space-x-3 rtl:space-x-reverse justify-end">
                    {/* Edit Button */}
                    <button
                        className="action-btn"
                        type="button"
                        onClick={() => handleEditSparePart(row.original)}
                    >
                        <Icon icon="heroicons:pencil-square" />
                    </button>

                    {/* Delete Button */}
                    <button
                        className="action-btn text-red-500"
                        type="button"
                        onClick={() => handleDeleteSparePart(row.original.id)}
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
                <Breadcrumbs title="Raw Material" />

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
                                navigate("/manage-sparepart/add");
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
                            Sname="Raw Material"
                            //   defaultSortBy={[{ id: "part_name", desc: false }]} 
                        />

                    </LoaderWrapperView>
                </div>

            </Card>
        </>
    );
};
