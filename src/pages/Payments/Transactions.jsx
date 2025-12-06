import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { fetchPayments, deleteTransaction } from '../../store/slices/paymentSlice';
import toast from 'react-hot-toast';

export const Transactions = () => {
  const transactions = useSelector(state => state.payments.transactions);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete/void this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Payments & Transactions</h2>
        <p className="text-slate-500 text-sm">View financial records</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <div>{txn.enrollment?.user?.fullName || 'N/A'}</div>
                    <div className="text-xs text-slate-400">{txn.enrollment?.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">{txn.enrollment?.course?.title || 'Course Enrollment'}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {txn.currency} {txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={txn.status === 'SUCCESS' ? 'primary' : 'warning'}>{txn.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(txn.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete/Void"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
