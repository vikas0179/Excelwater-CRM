import React, { useEffect, useState, Fragment } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Icon } from "@iconify/react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import { toast } from "react-toastify";
import { API_CUSTOMER_MANAGE_LIST, API_DELETE_CUSTOMER } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import Fileinput from "@/components/ui/Fileinput";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "@/components/ui/Textarea";
import Tooltip from "@/components/ui/Tooltip";
import { get } from "react-hook-form";




export default function ManageCustomer() {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState({});
    const [pageIndex, setPageIndex] = useState(1);
    const [size, setSize] = useState(100);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(`${API_CUSTOMER_MANAGE_LIST}?page=${pageIndex}&size=${size}`);
            setLoading(false);
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
      
                const formattedData = response.data.data.map(item => ({
                    ...item,
                    billingAddress: {
                        street: item.billing_address,
                        // landmark: item.billing_landmark,
                        city: item.billing_city,
                        state: item.billing_state,
                        zip: item.billing_zipcode,
                    },
                    shippingAddress: {
                        street: item.shipping_address,
                        // landmark: item.shipping_landmark,
                        city: item.shipping_city,
                        state: item.shipping_state,
                        zip: item.shipping_zipcode,
                    }
                }));
                setData(formattedData);
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

    const handleEditCustomer = (customer) => {
        try {
            if (!customer) {
                toast.error("Customer data not available. Please try again.");
                return;
            }

            navigate(`/manage-customer/add/${customer.id}`, {
                state: { customerData: customer }
            });

        } catch (error) {
            toast.error("Failed to navigate.");
        }
    };

    const handleDeleteOrder = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this Customer?")) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("id", customerId);

            const response = await Api.post(API_DELETE_CUSTOMER, formData);


            if (response && response.status === "RC200") {
                 await getData();

            } else {
                throw new Error(response.message || "Failed to delete Customer.");
            }
        } catch (error) {
            console.error("Error deleting Customer:", error);
            toast.error(error.message || "Error deleting Customer.");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        getData();
    }, [pageIndex]);

    const COLUMNS = [
        { Header: "Name", accessor: "name" },
        { Header: "Email", accessor: "email" },
        { Header: "Mobile", accessor: "mobile" },
        {
            Header: "Billing Address",
            accessor: "billingAddress",
            Cell: ({ value }) => (
                <div>
                    <div> <strong>Street/Office No.</strong>{value.street}</div>
                    {/* <div> <strong>Landmark</strong> {value.landmark}</div> */}
                    <div>
                        <strong>City</strong>   {value.city}
                    </div>
                    <div><strong>State</strong> {value.state} </div>
                    <div><strong>ZipCode</strong>  {value.zip} </div>
                </div>
            ),
        },
        {
            Header: "Shipping Address",
            accessor: "shippingAddress",
            Cell: ({ value }) => (
                <div>
                    <div> <strong>Street/Office No.</strong>{value.street}</div>
                    {/* <div> <strong>Landmark</strong> {value.landmark}</div> */}
                    <div>
                        <strong>City</strong>   {value.city}
                    </div>
                    <div><strong>State</strong> {value.state} </div>
                    <div><strong>ZipCode</strong>  {value.zip} </div>
                </div>
            ),
        },
        {
            Header: <div className="text-end">Action</div>,
            accessor: "actions",
            Cell: ({ row }) => (
                <div className="flex space-x-3 justify-end">
                    {/* <Tooltip content="View Order Details" placement="top">
                        <button
                            className="action-btn text-blue-500"
                            type="button"
                            onClick={() => handleViewDetails(row.original)}
                        >
                            <Icon icon="heroicons:eye" />
                        </button>
                    </Tooltip> */}
                    {/* Edit Button */}
                    <button
                        className="action-btn"
                        type="button"
                        onClick={() => handleEditCustomer(row.original)}
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


    return (<>
        <div className="md:flex justify-between items-center">
            <Breadcrumbs title="Customer " />
        </div>

        <Card>
            <div className="md:flex justify-between items-center flex-wrap">
                <Textinput placeholder="Search" />
                <button
                    className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                    onClick={() => navigate("/manage-customer/add", { state: { from: "manage-customer" } })}
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
                        Sname="customers"
                    />

                </LoaderWrapperView>
            </div>
        </Card>

    </>)
}
