import React from 'react';
import '../css/ProductionManagement.css';
import { useProjectsList } from './hooks/useProjectsList';
import ProjectsFilterPanel from './components/ProjectsList/ProjectsFilterPanel';
import ProjectsTableRow from './components/ProjectsList/ProjectsTableRow';
import ProjectsTableSkeleton from './components/ProjectsList/ProjectsTableSkeleton';

const ProjectsList = () => {
    const {
        searchTerm, setSearchTerm,
        filterStatus, setFilterStatus,
        loading,
        filtersOpen, setFiltersOpen,
        expandedRows, toggleRow,
        activeDropdown, setActiveDropdown,
        dropdownRef,
        displayProjects,
        fetchProjects
    } = useProjectsList();

    return (
        <div className="pm-dashboard">
            <ProjectsFilterPanel 
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="pm-card">
                <div className="pm-table-container">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-desktop-only" style={{ width: '40px' }}></th>
                                <th>Project ID & Name</th>
                                <th className="pm-desktop-only">Client / Type</th>
                                <th>Status</th>
                                <th className="pm-desktop-only">Progress</th>
                                <th className="pm-desktop-only">Timeline</th>
                                <th className="pm-desktop-only">Engineer</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <ProjectsTableSkeleton />
                            ) : displayProjects.map(project => (
                                <ProjectsTableRow 
                                    key={project._id}
                                    project={project}
                                    expandedRow={expandedRows[project._id] ? project._id : null}
                                    toggleRow={toggleRow}
                                    activeDropdown={activeDropdown}
                                    setActiveDropdown={setActiveDropdown}
                                    dropdownRef={dropdownRef}
                                    onProjectUpdate={fetchProjects}
                                />
                            ))}
                            {!loading && displayProjects.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No projects found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsList;
