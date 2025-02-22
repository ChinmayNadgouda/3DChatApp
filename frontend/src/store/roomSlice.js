import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRoom: null,
  currentUsername: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setUsername: (state, action) => {
      state.currentUsername = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;  
    },
    resetRoom: (state) => {
      state.currentRoom = null;
      state.currentUsername = null;
    },
  },
});

export const { setRoom, setUsername, setSocket, resetRoom } = roomSlice.actions;
export const setRoomAsync = (room) => (dispatch) => {
    return new Promise((resolve) => {
      dispatch(setRoom(room));
      resolve(); // Resolve the promise
    });
  };
export default roomSlice.reducer;