import { useApproveMaterialRequestMutation } from '../../../../store/api/designApi';

export const useMaterialActions = (fetchData) => {
    const [approveRequest] = useApproveMaterialRequestMutation();

    const handleApproveMaterialRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to release this material request to procurement?')) return;
        try {
            await approveRequest(requestId).unwrap();
            alert('Material request released to procurement successfully!');
            fetchData();
        } catch (err) {
            alert('Approval failed: ' + (err.data?.message || err.message));
        }
    };

    return { handleApproveMaterialRequest };
};
