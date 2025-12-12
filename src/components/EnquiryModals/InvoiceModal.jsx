import React, { useRef } from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import proweblogo from '../../assets/proedgeweblogo.png';

export default function InvoiceModal({ isOpen, onClose, studentData }) {
    const printRef = useRef();

    if (!isOpen || !studentData) return null;

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners
    };

    // Extract invoice details from nested or flat structure
    const invoiceNo = studentData.invoiceNo ||
        studentData.enrollments?.[0]?.payments?.[0]?.invoice?.invoiceNo ||
        'INV-PENDING';

    const invoiceDateRaw = studentData.invoiceDate ||
        studentData.enrollments?.[0]?.payments?.[0]?.invoice?.createdAt ||
        new Date();

    const invoiceDate = new Date(invoiceDateRaw).toLocaleDateString();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Printable Content */}
                <div ref={printRef} className="p-8 bg-white text-gray-800 min-h-[29.7cm] flex flex-col justify-between">
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-orange-500 pb-6 mb-6">
                            <div className="flex items-center gap-4">
                                <img src={proweblogo} alt="ProEdge Logo" className="w-16 h-16 object-contain" />
                                <div>
                                    <h1 className="text-2xl font-bold text-[#0a214d]">PROEDGE LEARNING</h1>
                                    <p className="text-sm text-gray-600">A VisionPro Ventures Private Limited Company.</p>
                                    <p className="text-sm text-gray-600">1074 1st Floor Simpi Gali, Sirsi, Karnataka, 581-401</p>
                                    <p className="text-sm text-gray-600">Ph: +91 81057 51886 | info@proedgelearning.in</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-gray-200">INVOICE</h2>
                                <p className="font-medium text-gray-600 mt-2">Date: {invoiceDate}</p>
                                <p className="text-sm text-gray-500">Invoice #: {invoiceNo}</p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-[#0a214d] mb-2">Bill To:</h3>
                            <p className="text-lg font-medium">{studentData.fullName}</p>
                            <p className="text-gray-600">{studentData.address || 'Address not provided'}</p>
                            <p className="text-gray-600">{studentData.email}</p>
                            <p className="text-gray-600">{studentData.contact || studentData.contactNumber}</p>
                        </div>

                        {/* Course Details Table */}
                        <table className="w-full mb-8 border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3 border-b-2 border-gray-300 font-bold text-gray-700">Description</th>
                                    <th className="p-3 border-b-2 border-gray-300 font-bold text-gray-700 text-right">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border-b border-gray-200">
                                        <p className="font-semibold">{studentData.courseName}</p>
                                        <p className="text-sm text-gray-500">Batch: {studentData.batchTiming}</p>
                                    </td>
                                    <td className="p-3 border-b border-gray-200 text-right font-medium">
                                        {studentData.originalFees || studentData.totalFees}
                                    </td>
                                </tr>
                                {studentData.referralAmount > 0 && (
                                    <tr>
                                        <td className="p-3 border-b border-gray-200 text-green-600">Referral Discount</td>
                                        <td className="p-3 border-b border-gray-200 text-right text-green-600">
                                            - {studentData.referralAmount}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td className="p-3 font-bold text-right border-t border-gray-300">Total Payable:</td>
                                    <td className="p-3 font-bold text-right border-t border-gray-300 text-xl text-[#0a214d]">
                                        ₹{studentData.totalFees}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Payment Plan Details */}
                        {studentData.paymentOption === 'Payment in Advance' && studentData.advancePaymentAmount && (
                            <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-100">
                                <h3 className="font-bold text-[#0a214d] mb-3">Payment in Advance</h3>
                                <div className="text-sm">
                                    <p className="text-gray-600 mb-2">Advance amount paid to secure enrollment:</p>
                                    <p className="text-2xl font-bold text-green-600">₹{studentData.advancePaymentAmount}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Remaining Balance: ₹{(studentData.totalFees - studentData.advancePaymentAmount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {studentData.paymentOption === 'Pay in Installments' && (
                            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-[#0a214d] mb-3">Payment Plan (Installments)</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">1st Installment</p>
                                        <p className="font-semibold">₹{studentData.installment1Amount}</p>
                                        <p className="text-xs text-gray-500">Due: {studentData.installment1Date}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">2nd Installment</p>
                                        <p className="font-semibold">₹{studentData.installment2Amount}</p>
                                        <p className="text-xs text-gray-500">Due: {studentData.installment2Date}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Final Installment</p>
                                        <p className="font-semibold">₹{studentData.installment3Amount}</p>
                                        <p className="text-xs text-gray-500">Due: {studentData.installment3Date}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        <p>This is a computer-generated invoice and does not require a signature.</p>
                        <p className="mt-1">Thank you for choosing ProEdge Learning!</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 rounded-lg bg-[#0a214d] text-white flex items-center gap-2 hover:bg-[#0d2a61] transition-colors shadow-lg"
                    >
                        <Printer className="w-5 h-5" />
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
