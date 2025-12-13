import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IndianRupee, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { fetchPayments, updatePaymentStatus } from '../../store/slices/paymentSlice';
import { toast } from 'react-hot-toast';

export const PaymentsList = () => {
  const payments = useSelector(state => state.payments.transactions);
  const loading = useSelector(state => state.payments.loading);
  const dispatch = useDispatch();
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleStatusChange = async (paymentId, newStatus) => {
    setUpdatingPaymentId(paymentId);
    try {
      await dispatch(updatePaymentStatus({ paymentId, status: newStatus })).unwrap();
      toast.success('Payment status updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update payment status');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'success';
      case 'INITIATED': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle size={16} className="text-green-500" />;
      case 'INITIATED': return <Clock size={16} className="text-yellow-500" />;
      default: return <CreditCard size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments Management</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <IndianRupee size={20} />
          <span className="font-medium">
            Total: ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Student</th>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Method</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{payment.orderId}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{payment.enrollment?.user?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{payment.enrollment?.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{payment.enrollment?.course?.title || 'N/A'}</td>
                    <td className="p-4">
                      <span className="font-bold text-green-600">₹{payment.amount?.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={payment.status}
                        onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                        disabled={updatingPaymentId === payment.id}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${payment.status === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-700' :
                            payment.status === 'INITIATED' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                              'bg-red-50 border-red-200 text-red-700'
                          } ${updatingPaymentId === payment.id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:opacity-80'}`}
                      >
                        <option value="INITIATED">INITIATED</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Badge variant="neutral" className="uppercase">{payment.provider || payment.paymentMethod || 'razorpay'}</Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
