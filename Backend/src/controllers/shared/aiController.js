import { GoogleGenerativeAI } from '@google/generative-ai';
import Client from '../../models/sales/Client.js';
import Quotation from '../../models/sales/Quotation.js';
import Inventory from '../../models/procurement/Inventory.js';
import Task from '../../models/design/Task.js';
import User from '../../models/admin/User.js';
import Project from '../../models/design/Project.js';
import Payment from '../../models/accounts/Payment.js';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('⚠️ WARNING: GEMINI_API_KEY is not defined in your environment variables.');
}
const genAI = new GoogleGenerativeAI(apiKey || 'MISSING_KEY');

/**
 * @desc    Process general AI queries with system context
 * @route   POST /api/ai/query
 */
export const queryAI = async (req, res) => {
    try {
        const { prompt, currentPath, pageState } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        // --- AI LOGIC COMMENTED OUT PER USER REQUEST ---
        /*
        // 1. Gather dynamic context based on the request (enriching with accounts, performance, and quotations)
        const [clients, inventory, tasks, users, projects, payments, quotations] = await Promise.all([
            Client.find().limit(50).select('name company email phone address'),
            Inventory.find().limit(100).select('itemName section price unit'),
            Task.find({ status: { $ne: 'Completed' } }).limit(20).select('title status priority assignedTo'),
            User.find({ status: 'Active' }).select('fullName role email'),
            Project.find().limit(50).select('name budget paymentStatus paymentCollectionStatus assignedAccountsStaff advanceAmount'),
            Payment.find().limit(100).select('amount paymentDate paymentMethod receivedBy invoice'),
            Quotation.find().limit(50).select('quotationNumber projectName clientPhone status grandTotal items')
        ]);
        
        // ... (rest of context and instructions) ...
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(combinedPrompt);
        const text = (await result.response).text();
        */

        res.status(200).json({
            success: true,
            data: "The Antigravity AI Assistant is currently disabled.",
            contextUsed: {
                clients: 0,
                inventory: 0,
                quotations: 0
            }
        });

    } catch (error) {
        console.warn(`⚠️ AI Service Warning: ${error.message || 'Service unavailable.'}`);
        res.status(200).json({
            success: true,
            data: "⚠️ The AI service is temporarily unavailable due to high API demand or rate limits. Please try again in a few moments.",
            contextUsed: {
                clients: 0,
                inventory: 0,
                quotations: 0
            }
        });
    }
};

/**
 * @desc    Smart suggestions for fields
 * @route   POST /api/ai/suggest
 */
export const getSuggestion = async (req, res) => {
    try {
        const { type, field, value } = req.body;

        // Use gemini-1.5-flash - newer model with better availability
        const model = genAI.getGenerativeModel({
            model: "models/gemini-1.5-flash"
        });

        const prompt = `Give a 10-word professional interior design suggestion for the field "${field}" when the value is "${value}". Type: ${type}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.status(200).json({
            success: true,
            suggestion: response.text().trim()
        });
    } catch (error) {
        console.error('AI Suggestion Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'AI suggestion failed'
        });
    }
};
