import Program from '../../models/accounts/Program.js';
import Voucher from '../../models/accounts/Voucher.js';
import Project from '../../models/design/Project.js';

export const resolveProgramForProject = async (projectId, clientId, userId) => {
    let program = await Program.findOne({ project: projectId });
    if (!program) {
        program = await Program.create({
            project: projectId,
            client: clientId,
            createdBy: userId
        });
    }
    return program;
};

export const getPrograms = async (filters = {}) => {
    let programs = await Program.find(filters)
        .populate('project', 'name projectNumber stage status paymentStatus')
        .populate('client', 'name email phone')
        .sort({ createdAt: -1 });

    if (programs.length === 0) {
        const projects = await Project.find().populate('client');
        for (const proj of projects) {
            await Program.create({
                project: proj._id,
                client: proj.client?._id || null,
                clientAmountPaid: proj.collectedAmount || 0,
                balanceDue: proj.advanceAmount ? Math.max(0, proj.advanceAmount - (proj.collectedAmount || 0)) : 0,
                clearanceStatus: proj.paymentStatus === 'Cleared' ? 'Cleared For Procurement' : 'Pending',
            });
        }
        programs = await Program.find(filters)
            .populate('project', 'name projectNumber stage status paymentStatus')
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 });
    }

    return programs;
};

export const getProgramById = async (programId) => {
    return await Program.findById(programId)
        .populate('project', 'name projectNumber stage status paymentStatus advanceAmount')
        .populate('client', 'name email phone');
};

export const clearForProcurement = async (programId, notes) => {
    const program = await Program.findById(programId);
    if (!program) throw new Error('Program not found');

    program.clearanceStatus = 'Cleared For Procurement';
    if (notes) program.notes = (program.notes ? program.notes + '\n' : '') + notes;
    await program.save();

    // Update the Project directly as well to maintain legacy behavior
    const project = await Project.findById(program.project);
    if (project) {
        project.paymentStatus = 'Cleared'; // The old procurement gate looks for this
        await project.save();
    }

    return program;
};

export const recalculateProgramBalances = async (programId) => {
    const program = await Program.findById(programId).populate('project');
    if (!program) return;

    const vouchers = await Voucher.find({ program: programId, status: 'Posted' });

    let amountPaid = 0;
    let expenses = 0;

    for (const vch of vouchers) {
        if (vch.type === 'Receipt') amountPaid += vch.amount;
        if (vch.type === 'Purchase') expenses += vch.amount; // Or Payment? Purchases record the expense.
    }

    program.clientAmountPaid = amountPaid;
    program.projectExpenses = expenses;
    
    if (program.project) {
        // Assume total budget is advanceAmount + something, or just use advanceAmount for now as expected collected
        program.balanceDue = (program.project.advanceAmount || 0) - amountPaid;
        
        // Also update the Project model for backward compatibility
        program.project.collectedAmount = amountPaid;
        await program.project.save();
    }

    await program.save();
};
