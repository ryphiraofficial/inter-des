import React from 'react';
import '../css/ProductionManagement.css';
import { useTeamOverview } from './hooks/useTeamOverview';
import TeamTableSkeleton from './components/TeamOverview/TeamTableSkeleton';
import TeamMemberRow from './components/TeamOverview/TeamMemberRow';
import AddMemberModal from './components/TeamOverview/AddMemberModal';
import ConfirmDialog from './components/TeamOverview/ConfirmDialog';

const TeamOverview = () => {
    const {
        filteredTeam,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        newMember,
        setNewMember,
        handleCreateMember,
        handleDeleteMember,
        handleConfirmDelete,
        handleCancelDelete,
        confirmDialog,
        expandedRow,
        toggleRow
    } = useTeamOverview();

    return (
        <div className="pm-dashboard" style={{ paddingTop: '1.5rem' }}>
            {error && <div className="pm-error-message">{error}</div>}

            <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <TeamTableSkeleton />
                ) : (
                    <div className="pm-table-container">
                        <table className="pm-table">
                            <thead>
                                <tr>
                                    <th>Member Profile</th>
                                    <th className="pm-desktop-only">Reporting Team</th>
                                    <th className="pm-desktop-only">Workload &amp; Capacity</th>
                                    <th className="pm-desktop-only">Performance</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                    <th className="pm-mobile-only"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeam.map(member => (
                                    <TeamMemberRow
                                        key={member._id}
                                        member={member}
                                        expandedRow={expandedRow}
                                        toggleRow={toggleRow}
                                        handleDeleteMember={handleDeleteMember}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {filteredTeam.length === 0 && !loading && (
                <div className="pm-loading-state">
                    <span>No team members found.</span>
                </div>
            )}

            <AddMemberModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                newMember={newMember}
                setNewMember={setNewMember}
                handleCreateMember={handleCreateMember}
            />

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Remove Team Member"
                message="Are you sure you want to remove this team member? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default TeamOverview;
