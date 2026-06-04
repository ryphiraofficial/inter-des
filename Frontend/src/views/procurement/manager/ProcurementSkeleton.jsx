import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    ManagerOverviewSkeleton, 
    StaffOverviewSkeleton, 
    ListSkeleton, 
    AssignmentsSkeleton, 
    VendorsSkeleton, 
    SourcingSkeleton 
} from '../components/ProcurementSkeletons';
import '../css/ProcurementPremium.css';

const ProcurementSkeleton = ({ role }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const isManager = role === 'manager';

    // Tab Router switcher
    if (isManager) {
        switch (activeTab) {
            case 'overview':
                return <ManagerOverviewSkeleton />;
            case 'handoffs':
                return <ListSkeleton titleText="Design Handoff Queue" />;
            case 'requests':
                return <ListSkeleton titleText="Material Requests" />;
            case 'assignments':
                return <AssignmentsSkeleton />;
            case 'vendors':
                return <VendorsSkeleton />;
            case 'completed':
                return <ListSkeleton titleText="Completed Requests" />;
            default:
                return <ManagerOverviewSkeleton />;
        }
    } else {
        switch (activeTab) {
            case 'overview':
                return <StaffOverviewSkeleton />;
            case 'sourcing':
                return <SourcingSkeleton />;
            case 'tasks':
                return <ListSkeleton titleText="My Active Tasks" />;
            case 'history':
                return <ListSkeleton titleText="Purchase History" />;
            case 'vendors':
                return <VendorsSkeleton />;
            default:
                return <StaffOverviewSkeleton />;
        }
    }
};

export default ProcurementSkeleton;
