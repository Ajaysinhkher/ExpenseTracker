import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGroup, getGroup } from '../features/groupSlice';
import { addExpense,updateExpense ,deleteExpense,getTotalExpense ,downloadPDF,downloadCsv} from '../features/expenseSlice';
import MonthlyPieChart from './MonthlyPieChart';


function Dashboard() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.groups);
  console.log(groups);
  
  const summary = useSelector((state) => state.expense.summary);
  // console.log("summary",summary)

  const [addGroupModal, setAddGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [expenseGroupId, setExpenseGroupId] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const [editExpenseModal, setEditExpenseModal] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState({
    id: '',
    group_id: '',
    description: '',
    amount: '',
    date: '',
  });


  useEffect(() => {
    dispatch(getGroup());
    dispatch(getTotalExpense());
  }, [dispatch]);

  const handleSubmitGroup = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      dispatch(addGroup({ name: groupName, expenses: [] }));
      setGroupName('');
      setAddGroupModal(false);
    }
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (description.trim() && amount && expenseDate) {
      dispatch(addExpense({
        group_id: expenseGroupId,
        description,
        amount,
        date: expenseDate,
      }));
      dispatch(getGroup());
      dispatch(getTotalExpense());
      setDescription('');
      setAmount('');
      setExpenseDate('');
      setExpenseGroupId(null);
      setAddExpenseModal(false);
    }
  };

 

  const handleUpdateExpense = (e) => {
    e.preventDefault();
    const { id, group_id, description, amount, date } = editExpenseData;
    dispatch(updateExpense({ id, group_id, description, amount, date }));
    dispatch(getGroup());
    dispatch(getTotalExpense());
    setEditExpenseModal(false);
 
  };
  

  const handleDeleteExpense = (expenseId)=>{
    dispatch(deleteExpense(expenseId));
    dispatch(getGroup());
  }

  // handle download pdf onclick:

  const handlePdfDownload = (groups)=>{
    dispatch(downloadPDF(groups))
  }

  const handleCsvDownload = (groups)=>{
    dispatch(downloadCsv(groups));
  }

return (
  <div className="min-h-screen bg-gray-50">
    <style>
      {`
        .scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }
        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}
    </style>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <button
          onClick={()=>handlePdfDownload(groups)}
          className="bg-gray-700 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm flex items-center space-x-1"
        >
          <span>Download Pdf</span>
        </button>

        <button
          onClick={()=>handleCsvDownload(groups)}
          className="bg-gray-700 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm flex items-center space-x-1"
        >
          <span>Download CSV</span>
        </button>

        <button
          onClick={() => setAddGroupModal(true)}
          className="bg-gray-700 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm flex items-center space-x-1"
        >
          <span>New Group</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Left side - Stats & Chart */}
        <div className="w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Total Expense</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">₹{summary.total}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium"> This Month</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">₹{summary.monthly}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Highest This Month</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">₹{summary.highest}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <MonthlyPieChart />
          </div>
        </div>

        {/* Right side - Groups */}
        <div className="w-3/4 space-y-6">
          {groups?.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3 bg-white border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-800">{group.name}</h2>
                <button
                  onClick={() => {
                    setExpenseGroupId(group.id);
                    setAddExpenseModal(true);
                  }}
                  className="bg-gray-700 text-white px-3 py-1 text-xs rounded hover:bg-gray-800 transition-colors duration-200"
                >
                  Add Expense
                </button>
              </div>

              <div className="max-h-[180px] overflow-y-auto scrollbar">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-gray-600 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-2 font-medium">Description</th>
                      <th className="text-right px-5 py-2 font-medium w-28">Amount</th>
                      <th className="text-left px-5 py-2 font-medium w-28">Date</th>
                      <th className="text-right px-5 py-2 font-medium w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group.expenses?.length ? (
                      group.expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-5 py-2 text-gray-800">{expense.description}</td>
                          <td className="px-5 py-2 text-right font-medium text-gray-800">₹{expense.amount}</td>
                          <td className="px-5 py-2 text-gray-600 text-sm">{expense.date}</td>
                          <td className="px-5 py-2 text-right flex justify-end gap-2">

                            <button
                              onClick={() => {
                                setEditExpenseData({
                                  id: expense.id,
                                  group_id: group.id,
                                  description: expense.description,
                                  amount: expense.amount,
                                  date: expense.date,
                                });
                                setEditExpenseModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-800 text-xs font-medium flex"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-sm text-gray-500">
                          No expenses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Modals below (no changes in structure, just classes) */}
    {/* Add Group Modal */}
    {addGroupModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h3 className="text-lg font-semibold mb-4">Add Group</h3>
          <form onSubmit={handleSubmitGroup}>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddGroupModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Add Expense Modal */}
    {addExpenseModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
          <form onSubmit={handleSubmitExpense}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddExpenseModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Edit Expense Modal */}
    {editExpenseModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>
          <form onSubmit={handleUpdateExpense}>
            <input
              type="text"
              value={editExpenseData.description}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, description: e.target.value })
              }
              placeholder="Description"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="number"
              value={editExpenseData.amount}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, amount: e.target.value })
              }
              placeholder="Amount (₹)"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="date"
              value={editExpenseData.date}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, date: e.target.value })
              }
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditExpenseModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}

export default Dashboard;
