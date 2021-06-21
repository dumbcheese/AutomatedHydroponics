import * as api from '../api';
import {useHistory} from 'react-router-dom';

export const signInAction = (formData, history) => async(dispatch) =>{

    try{

        const { data } = await api.userSignIn(formData);

        const action = {type: 'AUTH', payload: data};
        dispatch(action);

        history.push('/dashboard');

    } catch(error){
        console.log(error);
    }
}


export const signUpAction = (formData, history) => async(dispatch) =>{
    try{
        history.push('/')
    } catch(error){
        console.log(error);
    }
}
