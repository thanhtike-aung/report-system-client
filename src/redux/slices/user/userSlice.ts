import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserUpdateState {
  isUserUpdateSuccess: boolean;
}

const initialState: UserUpdateState = {
  isUserUpdateSuccess: false,
};

const userUpdateSlice = createSlice({
  name: "userUpdate",
  initialState,
  reducers: {
    setIsUserUpdateSuccess: (state, action: PayloadAction<boolean>) => {
      state.isUserUpdateSuccess = action.payload;
    },
  },
});

export const { setIsUserUpdateSuccess } = userUpdateSlice.actions;
export default userUpdateSlice.reducer;
