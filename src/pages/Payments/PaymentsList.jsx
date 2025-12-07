import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DollarSign, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { fetchPayments } from '../../store/slices/paymentSlice';

export const PaymentsList = () => {
  const payments = useSelector(state => state.payments.transactions);
  const loading = useSelector(state => state.payments.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} className="text-green-500" />;
      case 'PENDING': return <Clock size={16} className="text-yellow-500" />;
      default: return <CreditCard size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments Management</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={20} />
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
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="neutral" className="uppercase">{payment.provider || payment.paymentMethod || 'Online'}</Badge>
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
