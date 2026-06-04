import Project from '../../models/design/Project.js';
import Quotation from '../../models/sales/Quotation.js';

export const healTaskReferences = async (task) => {
    try {
        let updated = false;

        // If project reference is set but it actually points to a Quotation ID instead of a Project ID
        if (task.project) {
            const isProject = await Project.exists({ _id: task.project });
            if (!isProject) {
                // If it exists in Quotation, then task.project is currently pointing to a Quotation ID
                const isQuotation = await Quotation.exists({ _id: task.project });
                if (isQuotation) {
                    task.quotation = task.project;
                    
                    // Look up the actual project linked to this quotation
                    const projectDoc = await Project.findOne({ quotation: task.project });
                    if (projectDoc) {
                        task.project = projectDoc._id;
                    } else {
                        task.project = undefined;
                    }
                    updated = true;
                } else {
                    // Not a project and not a quotation, clear it
                    task.project = undefined;
                    updated = true;
                }
            }
        }

        // If project reference is missing but quotation reference is set, try to resolve it
        if (!task.project && task.quotation) {
            const projectDoc = await Project.findOne({ quotation: task.quotation });
            if (projectDoc) {
                task.project = projectDoc._id;
                updated = true;
            }
        }

        if (updated) {
            await task.save();
        }
    } catch (err) {
        console.error('healTaskReferences error:', err);
    }
};
