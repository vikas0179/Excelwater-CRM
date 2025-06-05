import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Icon } from '@iconify/react';
import Textinput from '@/components/ui/Textinput';
import Card from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { API_ALERT_MATERIAL_REPORT } from "@/services/ApiEndPoint";
import Api from "@/services/ApiServices";
import { toast } from "react-toastify";
import UserTable from "../userTable";
import LoaderWrapperView from "@/components/LoaderWrapperView";

export const AlertMaterialReport = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
   

    const getData = async () => {
        try {
            setLoading(true);
            const response = await Api.get(API_ALERT_MATERIAL_REPORT); // No pagination params
            setLoading(false);

            if (response.data && Array.isArray(response.data)) {
                setData(response.data);
           
            } else {
                console.error("Invalid data format", response.data);
                setData([]);
   
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

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
            },
        },
        {
            Header: "Material Number",
            accessor: "part_number",
            Cell: ({ cell }) => <span>{cell.value ?? "N/A"}</span>,
        },
        {
            Header: "Price",
            accessor: "price",
            Cell: ({ cell }) => <span>₹{cell.value}</span>,
        },
        {
            Header: "Min Alert Qty",
            accessor: "min_alert_qty",
        },
        {
            Header: "Opening Stock",
            accessor: "opening_stock",
        },
        {
            Header: "Stock Qty",
            accessor: "stock_qty",
        },
       
    ];

    return (
        <>
            <div className="md:flex justify-between items-center">
                <Breadcrumbs title="Alert Material Report" />
            </div>

            <Card>
                <div className="md:flex justify-between items-center flex-wrap">
                    <div className="grow flex items-center flex-wrap" />
                    <div className="flex items-center ml-2 md:mt-0 mt-2">
                        <Textinput placeholder="search" />
                    </div>
                </div>

                <div className='mt-8'>
                    <LoaderWrapperView isLoading={loading}>
                        <UserTable
                            columns={COLUMNS}
                            data={data}
                             paginate={false} 
                        />
                    </LoaderWrapperView>
                </div>
            </Card>
        </>
    );
};
