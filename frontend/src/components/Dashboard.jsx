import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGroup, getGroup } from '../features/groupSlice';
import { addExpense,updateExpense ,deleteExpense } from '../features/expenseSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.groups);

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
    setEditExpenseModal(false);
 
  };
  

  const handleDeleteExpense = (expenseId)=>{
    dispatch(deleteExpense(expenseId));
    dispatch(getGroup());
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setAddGroupModal(true)}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
        >
          + Add Group
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {groups?.map((group) => (
    <div key={group.id} className="bg-white shadow-md border border-gray-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg text-gray-800">{group.name}</h2>
        <button
          onClick={() => {
            setExpenseGroupId(group.id);
            setAddExpenseModal(true);
          }}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Expense
        </button>
      </div>

      <div className="space-y-2">
        {group.expenses?.length ? (
          group.expenses.map((expense) => (
            <div key={expense.id} className="bg-gray-50 border border-gray-200 p-3 rounded text-sm flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">{expense.description}</div>
                <div className="text-sm text-gray-600">₹{expense.amount}</div>
                <div className="text-xs text-gray-400">{expense.createdAt}</div>
              </div>
              <div className="flex gap-2 mt-1">
              <button onClick={() => {setEditExpenseData({id: expense.id, group_id: group.id, description: expense.description,amount: expense.amount, date: expense.date,});
                setEditExpenseModal(true);
              }}
              className="bg-yellow-400 text-white px-2 py-1 text-xs rounded hover:bg-yellow-500">
              Edit
              </button>
              <button onClick={()=>handleDeleteExpense(expense.id)} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">
                  Delete
              </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No expenses added yet.</p>
        )}
      </div>
    </div>
  ))}
</div>


      {/* Group Modal */}
      {addGroupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Add Group</h3>
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

      {/* Expense Modal */}
      {addExpenseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add Expense</h3>
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

{editExpenseModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded p-6 w-96">
      <h3 className="text-lg font-bold mb-4">Edit Expense</h3>
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
