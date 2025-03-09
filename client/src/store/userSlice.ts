import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  email: string | null;
  role: "USER" | "ADMIN";
  loggedWith: "google" | "credentials" | null;
  avatar: string | null;
  name: string | null;
  header: string | null;
  groupId: number | null;
}

const initialState: IUser = {
  email: null,
  role: "USER",
  loggedWith: null,
  avatar: null,
  name: null,
  header: null,
  groupId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.email = action.payload.email;
      state.loggedWith = action.payload.loggedWith;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
      state.name = action.payload.name;
      state.header = action.payload.header || "";
      state.groupId = action.payload.groupId || null;
    },

    unsetUser: (state) => {
      state.email = null;
      state.loggedWith = null;
      state.role = "USER";
      state.avatar = null;
      state.name = null;
      state.header = null;
      state.groupId = null;
    },

    setNewName: (state, action: PayloadAction<Pick<IUser, "name">>) => {
      state.name = action.payload.name;
    },

    setNewAvatar: (state, action: PayloadAction<Pick<IUser, "avatar">>) => {
      state.avatar = action.payload.avatar;
    },

    setNewHeader: (state, action: PayloadAction<Pick<IUser, "header">>) => {
      state.header = action.payload.header;
    },

    setNewGroupId: (state, action: PayloadAction<Pick<IUser, "groupId">>) => {
      state.groupId = action.payload.groupId;
    },
  },
});

export const {
  setUser,
  unsetUser,
  setNewName,
  setNewAvatar,
  setNewHeader,
  setNewGroupId,
} = userSlice.actions;

export default userSlice.reducer;
