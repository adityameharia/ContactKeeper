import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
	REGISTER_FAIL,
	REGISTER_SUCCESS,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	CLEAR_ERRORS,
} from '../types';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const AuthState = (props) => {
	const initialState = {
		token: localStorage.getItem('token'),
		isAuthenticated: null,
		loading: true,
		user: null,
		error: null,
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	//load user
	const loadUser = async () => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
		try {
			const res = await axios.get('http://localhost:5000/api/auth');
			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (error) {
			dispatch({ type: AUTH_ERROR });
		}
	};
	//register user
	const register = async (formData) => {
		const config = { headers: { 'content-type': 'application/json' } };
		try {
			const res = await axios.post(
				'http://localhost:5000/api/users',
				formData,
				config
			);
			dispatch({ type: REGISTER_SUCCESS, payload: res.data });
			loadUser();
		} catch (error) {
			dispatch({ type: REGISTER_FAIL, payload: error.response.data.msg });
		}
	};

	//login user
	const login = async (formData) => {
		const config = { headers: { 'content-type': 'application/json' } };
		try {
			const res = await axios.post(
				'http://localhost:5000/api/auth',
				formData,
				config
			);
			console.log(res.data);
			dispatch({ type: LOGIN_SUCCESS, payload: res.data });
			loadUser();
		} catch (error) {
			dispatch({ type: LOGIN_FAIL, payload: error.response.data.msg });
		}
	};

	//logout
	const logout = () => dispatch({ type: LOGOUT });

	//clear errors
	const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				user: state.user,
				error: state.error,
				register,
				login,
				loadUser,
				logout,
				clearErrors,
			}}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
