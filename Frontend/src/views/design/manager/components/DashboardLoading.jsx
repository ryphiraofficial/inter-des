import React from 'react';
import DesignSkeleton from '../DesignSkeleton';
import { 
    PipelineSkeleton, 
    ProjectsSkeleton, 
    TasksSkeleton, 
    StaffOverviewSkeleton, 
    MaterialReviewSkeleton,
    MeetingsSkeleton
} from './DashboardSkeletons';

const DashboardLoading = ({ activeTab }) => {
    let SkeletonComponent = DesignSkeleton;
    switch (activeTab) {
        case 'pipeline':
        case 'project_status':
            SkeletonComponent = PipelineSkeleton;
            break;
        case 'project_management':
            SkeletonComponent = ProjectsSkeleton;
            break;
        case 'tasks':
            SkeletonComponent = TasksSkeleton;
            break;
        case 'staff_overview':
            SkeletonComponent = StaffOverviewSkeleton;
            break;
        case 'material_review':
            SkeletonComponent = MaterialReviewSkeleton;
            break;
        case 'meetings':
            SkeletonComponent = MeetingsSkeleton;
            break;
        default:
            SkeletonComponent = DesignSkeleton;
    }

    return (
        <div className="role-dashboard">
            <SkeletonComponent />
        </div>
    );
};

export default DashboardLoading;
