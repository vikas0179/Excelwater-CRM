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


    console.log("invoiceData", invoiceData)

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

    const { invoice_detail = [], currency } = invoiceData;

    console.log("invoice_detail", invoice_detail)

    return (<>



        <div className="print:hidden">
            <Breadcrumbs
                title={"Invoice#" + invoiceData.invoice.invoice_no}
                BreadLink={[{ link: "/manage-invoice", name: "Invoice" }]}
            />
        </div>

        <section className="invoice-view-wrapper p-4 text-dark  bg-white">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 ">
                {/* Invoice Content */}
                <div className="xl:col-span-2 border-2 border-black p-3 bg-white border border-gray-900 ">
                    {/* Header */}
                    <div className="flex justify-between mb-4">
                        <img src="/src/assets/images/logo/logo.webp" alt="Logo" className="w-36" />
                        <div className="text-right text-sm">
                            <div>Text Invoice/Bill of Supply/Cash Memo</div>
                            <div>(Duplicate for Transporter)</div>
                        </div>
                    </div>

                    {/* Seller & Buyer Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div children className='mt-2'>
                            <p className='text-dark '>Sold By:</p>
                            <p className='text-dark'>Kheni International</p>
                            <p className='py-3 '>{invoiceData.invoice.bill_to}</p>
                            <p><strong >GST Registration No:</strong> 24DGIPK8404D1ZM</p>
                            <p><strong >Order Number:</strong> ORD1646911503</p>
                            <p><strong>Order Date:</strong>  Thu, Mar 10, 2022 04:55 PM</p>
                        </div>
                        <div className="text-right ">
                            <h6 className=" text-sm mb-2 text-dark">Shipping Address:</h6>
                            <p> {invoiceData.invoice.customer_name}</p> <p>
                                Address: {invoiceData.invoice.ship_to}</p>

                            <p className='mt-5'><strong>Invoice Number:</strong>{invoiceData.invoice.invoice_no}</p>
                            <p><strong>Invoice Date:</strong> {invoiceData.invoice.invoice_date}</p>
                        </div>
                    </div>

                    {/* Item Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-800" cellPadding={3}>
                            <thead className="bg-white">
                                <tr >
                                    {['Sl No.', 'Item', 'Description', 'Item Price', 'Qty', 'Discount', 'Amount', 'Total Amount'].map((head, i) => (
                                        <th key={i} className="border border-gray-900 text-left p-1">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoice_detail.map((item, i) => {
                                    const rate = Number(item.rate) || 0;
                                    const qty = Number(item.qty) || 0;
                                    const discount = Number(item.discount) || 0;
                                    const taxAmount = Number(item.taxAmount) || 0;

                                    const amount = rate * qty;
                                    const netAmount = amount - discount;
                                    const totalAmount = netAmount + taxAmount;

                                    return (
                                        <tr key={i}>
                                            <td className="border border-gray-900">{i + 1}</td>
                                            <td className="border border-gray-900">{item.item}</td>
                                            <td className="border border-gray-900">{item.desc}</td>
                                            <td className="border border-gray-900">${rate.toFixed(2)}</td>
                                            <td className="border border-gray-900 text-right">{qty}</td>
                                            <td className="border border-gray-900 text-right">${discount.toFixed(2)}</td>
                                            <td className="border border-gray-900 text-right">${amount.toFixed(2)}</td>
                                            <td className="border border-gray-900 text-right">${totalAmount.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}


                                {/* Calculate totals */}
                                {(() => {
                                    let totalDiscount = 0;
                                    let totalAmountSum = 0;
                                    let totalTax = 0;

                                    invoice_detail.forEach(item => {
                                        const amount = item.rate * item.qty;
                                        const discount = item.discount || 0;
                                        const taxAmount = item.taxAmount || 0;
                                        totalDiscount += discount;
                                        totalAmountSum += (amount - discount + taxAmount);
                                        totalTax += taxAmount;
                                    });

                                    const shippingCharge = invoiceData.shipping_charge || 0;
                                    const paidAmount = invoiceData.paid_amount || 0;
                                    const finalTotal = totalAmountSum + shippingCharge;

                                    return (
                                        <>
                                            {/* Shipping Row */}
                                            <tr>
                                                <td className="border border-gray-900" colSpan={5}>Shipping Charge</td>
                                                <td className="border border-gray-900 text-right"></td>
                                                <td className="border border-gray-900 text-right">${shippingCharge.toFixed(2)}</td>
                                                <td className="border border-gray-900 text-right"></td>
                                            </tr>

                                            {/* Totals Row */}
                                            <tr className="bg-[#afadad] font-bold">
                                                <td className="border border-gray-900" colSpan={5}>Total</td>
                                                <td className="border border-gray-900 text-right">${totalDiscount.toFixed(2)}</td>
                                                <td className="border border-gray-900 text-right">${(totalAmountSum - totalTax).toFixed(2)}</td>
                                                <td className="border border-gray-900 text-right">${totalAmountSum.toFixed(2)}</td>
                                            </tr>

                                            {/* Paid Amount */}
                                            <tr className="bg-white font-bold">
                                                <td className="" colSpan={4}>Paid Amount</td>
                                                <td className="text-right"></td>
                                                <td className=""></td>
                                                <td className="text-right"></td>
                                                <td className="border border-gray-900 text-right">${paidAmount.toFixed(2)}</td>
                                            </tr>

                                            {/* Final Total */}
                                            <tr className="bg-[#afadad] font-bold border border-gray-900">
                                                <td className="" colSpan={4}>Final Total</td>
                                                <td className="text-right"></td>
                                                <td className=""></td>
                                                <td className="text-right"></td>
                                                <td className="border border-gray-900 text-right">${finalTotal.toFixed(2)}</td>
                                            </tr>
                                        </>
                                    );
                                })()}
                            </tbody>

                        </table>
                    </div>

                    {/* Footer */}
                    <div className="border-b border-l border-r border-gray-900  text-sm">
                        <p className="mb-2 text-left text-md pl-1 pt-1">
                            Amount in Words:
                        </p>
                        <p className='font-bold uppercase text-black  pl-1'>TWO HUNDRED SEVENTY NINE INR ONLY</p>
                        <p className="mt-4 mb-1 text-right border-t border-gray-900">For Kheni International:</p>

                        <div className="flex items-center justify-between mb-2 px-1">
                            {/* QR Code on the left */}
                            <div>
                                <QRCodeCanvas
                                    value={`http://192.168.29.199:5173/manage_invoice/invoice_detail/ ${invoiceData.invoice.invoice_no}`}
                                    size={80}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            {/* Signature on the right */}
                            <div className="text-right">
                                <img
                                    src="/src/assets/images/all-img/signature.png"
                                    alt="Signature"
                                    className="w-24 h-16 inline-block"
                                />
                                <p>Authorized Signatory</p>
                            </div>
                        </div>
                    </div>
                    <p className='text-xs p-1 '>* All above information is apply to our standard terms and Conditions  <strong> Please Read terms and Condition </strong></p>

                </div>

                {/* Side Panel */}
                <div className="border p-4 print:hidden">
                    <button
                        className="bg-blue-600 text-white hover:bg-blue-400 px-4 py-2 rounded w-full"
                        onClick={() => window.print()}
                    >
                        Print Invoice
                    </button>
                </div>

            </div>
        </section>
    </>
    );
}
