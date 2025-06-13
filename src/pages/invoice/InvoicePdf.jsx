import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '@/services/ApiServices';
import { API_INVOICE_DATA_BT_ID } from '@/services/ApiEndPoint';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Layout from '@/layout/Layout';
import Sidebar from '@/components/partials/sidebar';
import Header from '@/components/partials/header';
import "../../assets/scss/style.css"
import { QRCodeCanvas } from "qrcode.react";

export default function InvoicePdf() {
    const { id } = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchInvoice();
        }
    }, [id]);

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const response = await Api.get(`${API_INVOICE_DATA_BT_ID}/${id}`);
            setInvoiceData(response.data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !invoiceData) return <div className="p-4">Loading...</div>;

    const { invoice_detail = [] } = invoiceData;

    let subtotal = 0;
    invoice_detail.forEach(item => {
        subtotal += item.qty * item.rate;
    });
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    return (
        <section className="invoice-view-wrapper p-4 text-black bg-white">
            <div className="border border-gray-900 p-6">
                <div className="flex justify-between items-start">
                    <div className="text-sm text-black-500">
                        <span className="font-bold text-lg mb-1 text-black-500">Excel Water System</span>
                        <p>31-145 Traders Blvd E</p>
                        <p>Mississauga ON  L4Z 3L3</p>
                        <p>+1 888 622 3092</p>
                        <p>info@kentwater.ca</p>
                        <p>www.kentwater.ca</p>
                        <p><strong>GST/HST Registration No:</strong> 761788298RT0001</p>
                        <span className="text-2xl  text-sky-500 mt-2">INVOICE</span>

                    </div>

                    <div className="text-right text-black-500">
                        <img src="/src/assets/images/logo/logo.webp" alt="Logo" className="w-36 mb-2 ml-auto" />
                    </div>
                </div>

                <div className="grid grid-cols-3 mt-3 text-sm text-black-500">
                    <div>
                        <p className="font-semibold mb-1">BILL TO</p>
                        <p>{invoiceData.invoice.bill_to}</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">SHIP TO</p>
                        <p>{invoiceData.invoice.ship_to}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-1 text-sm text-black-500">
  <p><strong>INVOICE #&nbsp;</strong><span>{invoiceData.invoice.invoice_no}</span></p>
  <p><strong>DATE&nbsp;</strong><span>{invoiceData.invoice.invoice_date}</span></p>
  <p><strong>DUE DATE&nbsp;</strong><span>{invoiceData.invoice.invoice_date}</span></p>
  <p><strong>TERMS&nbsp;</strong><span>Due on receipt</span></p>
</div>


                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-black-500">

                </div>


                <div className="mt-6 overflow-x-auto text-black-500">
                    <table className="w-full text-sm border-none">
                        <thead className="bg-gray-100">
                            <tr className='bg-sky-100 text-sky-500'>
                                <th className=" p-2 text-left">Activity</th>
                                <th className=" p-2 text-left">Description</th>
                                <th className=" p-2 text-right">Qty</th>
                                <th className=" p-2 text-right">Rate</th>
                                <th className=" p-2 text-right">Tax</th>
                                <th className=" p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice_detail.map((item, index) => {
                                const amount = item.qty * item.rate;
                                return (
                                    <tr key={index}>
                                        <td className=" p-2">{item.item}</td>
                                        <td className=" p-2">{item.desc}</td>
                                        <td className=" p-2 text-right">{item.qty}</td>
                                        <td className=" p-2 text-right">${Number(item.rate).toFixed(2)}</td>
                                        <td className=" p-2 text-right">HST ON</td>
                                        <td className=" p-2 text-right">${Number(amount).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="text-sm text-right mt-4 w-full text-black-500">
                    <p className="mb-1"><strong> SUBTOTAL:</strong> ${Number(subtotal).toFixed(2)}</p>
                    <p className="mb-1"><strong> HST (ON) @ 13%: </strong>  ${Number(tax).toFixed(2)}</p>
                    <p className="font-bold text-lg">TOTAL: CAD {Number(total).toFixed(2)}</p>
                </div>

                <div className="flex justify-between items-end mt-6">
                    <div>
                        <QRCodeCanvas
                            value={`http://192.168.29.199:5173/manage_invoice/invoice_detail/${invoiceData.invoice.invoice_no}`}
                            size={100}
                        />
                    </div>
                    {/* <div className="text-right text-black-500">
                        <img
                            src="/src/assets/images/all-img/signature.png"
                            alt="Signature"
                            className="w-24 h-16 inline-block"
                        />
                        <p>Authorized Signatory</p>
                    </div> */}
                </div>
                
            </div>
             <div className="border p-4 print:hidden">
                    <button
                        className="bg-blue-600 text-white hover:bg-blue-400 px-4 py-2 rounded w-full"
                        onClick={() => window.print()}
                    >
                        Print Invoice
                    </button>
                </div>
        </section>
    );
}
