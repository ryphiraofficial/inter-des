import Expense from '../../models/accounts/Expense.js';
import Project from '../../models/design/Project.js';

export const getExpenses = async (req, res) => {
    try {
        const { project, type, status, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (project) query.project = project;
        if (type) query.type = type;
        if (status) query.paymentStatus = status;
        
        const skip = (page - 1) * limit;
        const expenses = await Expense.find(query)
            .populate('project', 'name projectNumber')
            .populate('vendor', 'name')
            .populate('createdBy', 'fullName')
            .sort({ expenseDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Expense.countDocuments(query);
        
        res.status(200).json({ success: true, count: expenses.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createExpense = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const expense = await Expense.create(req.body);
        
        await Project.findByIdAndUpdate(req.body.project, {
            $inc: { spent: req.body.amount }
        });
        
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const oldExpense = await Expense.findById(req.params.id);
        if (!oldExpense) return res.status(404).json({ success: false, message: 'Expense not found' });
        
        const amountDiff = (req.body.amount || oldExpense.amount) - oldExpense.amount;
        if (amountDiff !== 0) {
            await Project.findByIdAndUpdate(oldExpense.project, { $inc: { spent: amountDiff } });
        }
        
        Object.assign(oldExpense, req.body);
        await oldExpense.save();
        
        res.status(200).json({ success: true, data: oldExpense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
        
        if (expense.project) {
            await Project.findByIdAndUpdate(expense.project, { $inc: { spent: -expense.amount } });
        }
        
        await expense.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
