import { createSlice } from '@reduxjs/toolkit';

const clientPortalSlice = createSlice({
    name: 'clientPortal',
    initialState: {
        selectedProjectId: null,
    },
    reducers: {
        setSelectedProject: (state, action) => {
            state.selectedProjectId = action.payload;
        },
    },
});

export const { setSelectedProject } = clientPortalSlice.actions;

export const selectSelectedProjectId = (state) => state.clientPortal.selectedProjectId;

export default clientPortalSlice.reducer;
