import React from 'react';

const ProjectsTableSkeleton = () => {
    return (
        <React.Fragment>
            {Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={`skeleton-row-${rowIdx}`} className="pm-table-row">
                    <td className="pm-desktop-only">
                        <div className="pm-skeleton-circle" style={{ width: '20px', height: '20px' }} />
                    </td>
                    <td>
                        <div className="pm-skeleton-line" style={{ width: '60%', marginBottom: '8px' }} />
                        <div className="pm-skeleton-line" style={{ width: '35%' }} />
                    </td>
                    <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '65%' }} /></td>
                    <td><div className="pm-skeleton-line" style={{ width: '52%' }} /></td>
                    <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '70%' }} /></td>
                    <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '58%' }} /></td>
                    <td className="pm-desktop-only"><div className="pm-skeleton-line" style={{ width: '64%' }} /></td>
                    <td><div className="pm-skeleton-circle" style={{ width: '24px', height: '24px', marginLeft: 'auto' }} /></td>
                </tr>
            ))}
        </React.Fragment>
    );
};

export default ProjectsTableSkeleton;
