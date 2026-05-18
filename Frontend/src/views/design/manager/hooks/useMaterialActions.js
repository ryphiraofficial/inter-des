import { procurementAPI } from '../../../../models/api';

export const useMaterialActions = (fetchData) => {
    const handleApproveMaterialRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to release this material request to procurement?')) return;
        try {
            const res = await procurementAPI.approveMaterialRequest(requestId);
            if (res.success) {
                alert('Material request released to procurement successfully!');
                fetchData();
            }
        } catch (err) {
            alert('Approval failed: ' + err.message);
        }
    };

    return { handleApproveMaterialRequest };
};
