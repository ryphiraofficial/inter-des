import { useState, useEffect } from 'react';
import { 
    useGetMeetingsQuery, useGetUsersForMeetingsQuery, 
    useCreateMeetingMutation, useUpdateMeetingMutation, 
    useCancelMeetingMutation 
} from '../../../store/api/meetingApi';
import { computeStatus } from '../utils/meetingUtils';

export const useAdminMeetings = () => {
    const { data: mRes, isLoading: mLoading } = useGetMeetingsQuery();
    const { data: uRes, isLoading: uLoading } = useGetUsersForMeetingsQuery();
    const [createMeeting] = useCreateMeetingMutation();
    const [updateMeeting] = useUpdateMeetingMutation();
    const [cancelMeeting] = useCancelMeetingMutation();

    const meetings = mRes?.data || [];
    const allUsers = uRes?.data || [];
    const loading = mLoading || uLoading;

    const [showModal, setShowModal] = useState(false);
    const [editMeeting, setEditMeeting] = useState(null);
    const [filter, setFilter] = useState('all');
    const [meetingToCancel, setMeetingToCancel] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const handler = () => setShowModal(true);
        window.addEventListener('open-schedule-meeting-modal', handler);
        return () => window.removeEventListener('open-schedule-meeting-modal', handler);
    }, []);

    const handleCancel = (meeting) => {
        setMeetingToCancel(meeting);
    };

    const handleConfirmCancel = async () => {
        if (!meetingToCancel) return;
        setIsCancelling(true);
        try {
            await cancelMeeting(meetingToCancel._id).unwrap();
            setMeetingToCancel(null);
        } catch (err) {
            alert('Failed to cancel: ' + err.message);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleEdit = (meeting) => {
        setEditMeeting(meeting);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMeeting(null);
    };

    const handleSaved = () => {
        handleModalClose();
    };

    const filtered = meetings.filter(m => {
        if (filter === 'all') return true;
        return computeStatus(m) === filter;
    });

    const stats = {
        total: meetings.length,
        upcoming: meetings.filter(m => computeStatus(m) === 'upcoming').length,
        ongoing: meetings.filter(m => computeStatus(m) === 'ongoing').length,
        completed: meetings.filter(m => computeStatus(m) === 'completed').length,
    };

    return {
        meetings,
        allUsers,
        loading,
        showModal,
        editMeeting,
        filter,
        setFilter,
        meetingToCancel,
        setMeetingToCancel,
        isCancelling,
        handleCancel,
        handleConfirmCancel,
        handleEdit,
        handleModalClose,
        handleSaved,
        filtered,
        stats,
        createMeeting,
        updateMeeting
    };
};
