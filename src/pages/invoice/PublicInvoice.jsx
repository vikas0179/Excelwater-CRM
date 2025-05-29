import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";

const PublicInvoice = () => {
  const { invoiceNo } = useParams();

  // Static data
  const invoiceData = {
    invoice: {
      invoice_no: invoiceNo,
      customer_name: "John Doe",
      bill_to: "123 Billing Street, Mumbai, India",
      ship_to: "456 Shipping Avenue, Delhi, India",
      invoice_date: "2025-05-22",
    },
    shipping_charge: 29,
    paid_amount: 758,
    invoice_detail: [
      {
        id: 1,
        item: "Product A",
        desc: "Description A",
        qty: 2,
        rate: 100,
        discount: 10,
        taxAmount: 18,
      },
      {
        id: 2,
        item: "Product B",
        desc: "Description B",
        qty: 3,
        rate: 150,
        discount: 20,
        taxAmount: 30,
      },
    ],
  };

  const { invoice, invoice_detail } = invoiceData;

  return (
    <section className="invoice-view-wrapper p-2 sm:p-4 text-dark bg-white">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Invoice Content */}
        <div className="xl:col-span-2 border-2 border-black p-2 sm:p-4 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
            <img src="/src/assets/images/logo/logo.webp" alt="Logo" className="w-32 sm:w-36" />
            <div className="text-center sm:text-right text-xs sm:text-sm">
              <div>Text Invoice/Bill of Supply/Cash Memo</div>
              <div>(Duplicate for Transporter)</div>
            </div>
          </div>

          {/* Seller & Buyer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs sm:text-sm">
            <div>
              <p className="text-dark font-semibold">Sold By:</p>
              <p>Kheni International</p>
              <p className="py-2">{invoice.bill_to}</p>
              <p><strong>GST No:</strong> 24DGIPK8404D1ZM</p>
              <p><strong>Order No:</strong> ORD1646911503</p>
              <p><strong>Order Date:</strong> Mar 10, 2022 04:55 PM</p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-semibold">Shipping Address:</p>
              <p>{invoice.customer_name}</p>
              <p>Address: {invoice.ship_to}</p>
              <p className="mt-2"><strong>Invoice No:</strong> {invoice.invoice_no}</p>
              <p><strong>Invoice Date:</strong> {invoice.invoice_date}</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm border border-gray-800" cellPadding={3}>
              <thead className="bg-white">
                <tr>
                  {['Sl No.', 'Item', 'Description', 'Item Price', 'Qty', 'Discount', 'Amount', 'Total'].map((head, i) => (
                    <th key={i} className="border border-gray-900 text-left p-1 whitespace-nowrap">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice_detail.map((item, i) => {
                  const amount = item.qty * item.rate;
                  const netAmount = amount - item.discount;
                  const totalAmount = netAmount + item.taxAmount;

                  return (
                    <tr key={i}>
                      <td className="border border-gray-900">{i + 1}</td>
                      <td className="border border-gray-900">{item.item}</td>
                      <td className="border border-gray-900">{item.desc}</td>
                      <td className="border border-gray-900">${item.rate.toFixed(2)}</td>
                      <td className="border border-gray-900 text-right">{item.qty}</td>
                      <td className="border border-gray-900 text-right">${item.discount.toFixed(2)}</td>
                      <td className="border border-gray-900 text-right">${amount.toFixed(2)}</td>
                      <td className="border border-gray-900 text-right">${totalAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}

                {/* Totals */}
                {(() => {
                  let totalDiscount = 0;
                  let totalTax = 0;
                  let totalAmountSum = 0;

                  invoice_detail.forEach(item => {
                    const amount = item.rate * item.qty;
                    totalDiscount += item.discount;
                    totalTax += item.taxAmount;
                    totalAmountSum += amount - item.discount + item.taxAmount;
                  });

                  const shipping = invoiceData.shipping_charge;
                  const paid = invoiceData.paid_amount;
                  const finalTotal = totalAmountSum + shipping;

                  return (
                    <>
                      <tr>
                        <td className="border border-gray-900" colSpan={5}>Shipping Charge</td>
                        <td className="border border-gray-900"></td>
                        <td className="border border-gray-900 text-right">${shipping.toFixed(2)}</td>
                        <td className="border border-gray-900"></td>
                      </tr>
                      <tr className="bg-[#afadad] font-bold">
                        <td className="border border-gray-900" colSpan={5}>Total</td>
                        <td className="border border-gray-900 text-right">${totalDiscount.toFixed(2)}</td>
                        <td className="border border-gray-900 text-right">${(totalAmountSum - totalTax).toFixed(2)}</td>
                        <td className="border border-gray-900 text-right">${totalAmountSum.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-white font-bold">
                        <td colSpan={4}>Paid Amount</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="border border-gray-900 text-right">${paid.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-[#afadad] font-bold border border-gray-900">
                        <td colSpan={4}>Final Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="border border-gray-900 text-right">${finalTotal.toFixed(2)}</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border border-gray-900 text-xs sm:text-sm mt-4">
            <p className="pl-2 pt-1">Amount in Words:</p>
            <p className="font-bold uppercase pl-2">SEVEN HUNDRED FIFTY EIGHT INR ONLY</p>
            <p className="mt-4 mb-1 text-right border-t border-gray-900 pr-2">For Kheni International:</p>
            <div className="flex items-center justify-between mb-2 px-1">
                {/* QR Code on the left */}
                <div>
                  <QRCodeCanvas
value={`http://192.168.29.199:5173/manage_invoice/invoice_detail/${invoiceData.invoice.invoice_no}`}

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
          <p className="text-xs p-1 italic">* All above information is subject to our standard Terms & Conditions.</p>
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
  );
};

export default PublicInvoice;
