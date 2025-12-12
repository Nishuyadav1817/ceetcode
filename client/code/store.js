// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer
//   }
// });

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Load user data from localStorage (if it exists)
const savedUser = localStorage.getItem('user')
? JSON.parse(localStorage.getItem('user'))
: null;

// Add your preloaded state
const preloadedState = {
auth: {
user: savedUser,
},
};

export const store = configureStore({
reducer: {
auth: authReducer,
},
preloadedState,
});

// Subscribe to store changes to keep user in localStorage
store.subscribe(() => {
const state = store.getState();
if (state.auth.user) {
localStorage.setItem('user', JSON.stringify(state.auth.user));
} else {
localStorage.removeItem('user');
}
});
