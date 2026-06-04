// Convenience selectors for reading RTK Query cached data without subscribing
// to the query (no additional network call, no loading state).
// Use these in components that display cached data derived from another hook's query.
//
// Example:
//   const taskCounts = useTaskCountsFromCache();
//   // { pending: 3, inProgress: 5, completed: 12, total: 20 }

import { productionApi } from '../api/productionApi';
import { useAppSelector } from '../hooks';

export const useTaskCountsFromCache = () => {
    const tasksResult = useAppSelector((state) =>
        productionApi.endpoints.getAllTasks.select()(state)
    );

    const tasks = tasksResult?.data?.data ?? [];
    return {
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        approved: tasks.filter(t => t.status === 'Approved').length,
        total: tasks.length,
    };
};

export const useProjectCountsFromCache = () => {
    const projectsResult = useAppSelector((state) =>
        productionApi.endpoints.getProjects.select({})(state)
    );

    const projects = projectsResult?.data?.data ?? [];
    return {
        active: projects.filter(p => p.status === 'Active').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        total: projects.length,
    };
};
