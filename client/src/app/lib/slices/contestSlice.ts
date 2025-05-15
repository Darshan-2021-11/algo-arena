import { RootState } from "@/app/lib/store";
import { createSlice } from "@reduxjs/toolkit";

export interface value {
    problems: string[],
    contestid: string | null
}

const initialState: value = {
    problems: [],
    contestid: null
}

const contestSlice = createSlice({
    name: "contest",
    initialState,
    reducers: {
        updateProblem(state, action) {
            state.problems = action.payload;
        },
        setContestid(state, action) {
            state.contestid = action.payload;
        },
        removeContestid(state) {
            state.contestid = null;
        }
    }
})

export const { updateProblem, setContestid, removeContestid } = contestSlice.actions;
export const useContest = (state: RootState) => state.contest as value;
export default contestSlice.reducer;