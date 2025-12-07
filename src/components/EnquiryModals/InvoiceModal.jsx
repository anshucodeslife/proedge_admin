import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
// import logo from '../../assets/logo.png'; // Use target logo if available or standard text

export default function InvoiceModal({ isOpen, onClose, studentData }) {
    const printRef = useRef();
    if (!isOpen || !studentData) return null;

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div ref={printRef} className="p-8 bg-white text-gray-800 min-h-[29.7cm] flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start border-b-2 border-orange-500 pb-6 mb-6">
                            <div className="flex items-center gap-4">
                                {/* <img src={logo} alt="Logo" className="w-16 h-16 object-contain" /> */}
                                <div>
                                    <h1 className="text-2xl font-bold text-[#0a214d]">PROEDGE LEARNING</h1>
                                    <p className="text-sm text-gray-600">Premium Education</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-gray-200">INVOICE</h2>
                                <p className="font-medium text-gray-600 mt-2">Date: {new Date().toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500">Invoice #: INV-{Math.floor(100000 + Math.random() * 900000)}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-[#0a214d] mb-2">Bill To:</h3>
                            <p className="text-lg font-medium">{studentData.fullName}</p>
                            <p className="text-gray-600">{studentData.address || 'Address not provided'}</p>
                            <p className="text-gray-600">{studentData.email}</p>
                            <p className="text-gray-600">{studentData.contact || studentData.contactNumber}</p>
                        </div>

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
                                        <td className="p-3 border-b border-gray-200 text-right text-green-600">- {studentData.referralAmount}</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td className="p-3 font-bold text-right border-t border-gray-300">Total Payable:</td>
                                    <td className="p-3 font-bold text-right border-t border-gray-300 text-xl text-[#0a214d]">₹{studentData.totalFees}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        <p>This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-gray-300">Close</button>
                    <button onClick={handlePrint} className="px-6 py-2 rounded-lg bg-[#0a214d] text-white flex items-center gap-2">
                        <Printer className="w-5 h-5" /> Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
