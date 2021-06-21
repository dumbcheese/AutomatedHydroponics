import React, {useState, useEffect, useRef} from 'react'
import Carousel from '../Carousel/Carousel';
import './login.css';
import '../Carousel/carousel.css'
import { Formik, useFormik} from "formik";
import {useDispatch} from 'react-redux';
import * as Yup from "yup";


import {FormControl, Checkbox, Container, Grid, TextField, Tooltip, Button} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import logo2 from './Auto.png';
import {Link, Redirect, useHistory} from 'react-router-dom'
import InputAdornment from '@material-ui/core/InputAdornment';

import {signInAction} from '../../actions/auth';

import xIcon from './xCircle.svg';

const LoginSchema = Yup.object({
    email: Yup.string().email('Enter valid email.').required('Email is required.'),
    password: Yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 characters minimum.')
  });

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'red',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E2E2E2',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#48DDB8',
        },
        '&.Mui-error': {
            backgroundColor: '#fef5f5',
          },
        '& .PrivateNotchedOutline-root-2'
        : {
            top: 0
        },
        '& .PrivateNotchedOutline-root-3': {
            top: 0,
          }
      },
    },
  })(TextField);


const Login = () =>{
  const dispatch = useDispatch();
  const history = useHistory();
    const [loginData, setLoginData] = useState({email: '', password: '', rememberMe: ''})
    const [errorData, setErrorData] = useState({email: '', password: ''})
    const [redirect, setRedirect] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const signIn = async () =>{
        const loginData = formik.values;

        dispatch(signInAction(loginData, history));
    }

    const formik = useFormik({
        initialValues:{
            email: "",
            password: ""
          },
          onSubmit: signIn,
          validationSchema: LoginSchema

    });


    function handleChange(e, type){
        e.preventDefault();
        setLoginData({ ...loginData, type: e.target.value})
        console.log(loginData);
    }



    useEffect(() => {}, [redirect])
    return(
        isLoading ? (
            <p>loading...</p>
        )
        : (
<Grid container>
            {redirect}
            <Grid item container xs={12} md={4}>
                <Container className='gridLogin' alignItems="center" justify="center" container spacing={2} direction="column">
                    <img src={logo2} style={{height: '110px', marginLeft: "-10px"}}/>
                    <h1 className='signIn'>Sign in</h1>
                    <h1 className='moto'>Automated Hydroponics</h1>
                    <form onSubmit={formik.handleSubmit} >
                    <Grid className='inputContainer' item container spacing={2} direction="column">
                        <Grid item>
                        <p className='inputLabel'>EMAIL</p>
                        <CssTextField value={formik.values.email} error={Boolean(formik.errors.email) && formik.touched.email} name="email" InputProps={{endAdornment: <InputAdornment  position="end">{Boolean(formik.errors.email) && formik.touched.email ? <button style={{border: "none", background: "none", margin: "0", padding: "0"}} onClick={(e)=>formik.values.email=""}><Tooltip title={formik.errors.email} open={true}><img src={xIcon} className={xIcon}></img></Tooltip></button> : ""}</InputAdornment>,}} className='inputTextfield' InputLabelProps={{shrink: false, style: {color: "#B4B4B4"}}} label={formik.values.email==''? 'johndoe@mail.com' : ''} fullWidth variant="outlined" onChange={formik.handleChange}/>

                        {/* <CssTextField value={formik.values.email} name="email" error={errors.email && touched.email} InputProps={{endAdornment: <InputAdornment position="end">{loginData.email == '' ? "aa" : <img src={CalendarIcon}></img>}</InputAdornment>,}} className='inputTextfield' InputLabelProps={{shrink: false, style: {color: "#B4B4B4"}}} label={loginData.email==''? 'johndoe@mail.com' : ''} required fullWidth variant="outlined" onChange={(e) => setLoginData({ ...loginData, email: e.target.value})}/> */}

                        {/* <CssTextField className='inputTextfield' InputProps={{startAdornment: <InputAdornment position="start"><img src={logo}></img></InputAdornment>,}} InputLabelProps={{shrink: false, style: {color: "#B4B4B4"}}} label={loginData.email==''? 'johndoe@mail.com' : ''} required fullWidth variant="outlined" onChange={(e) => setLoginData({ ...loginData, email: e.target.value})}/> */}
                        </Grid>
                        <Grid item>
                            <p className='inputLabel'>PASSWORD</p>
                            <CssTextField type="password"  name="password" value={formik.values.password} error={Boolean(formik.errors.password) && formik.touched.password} InputProps={{endAdornment: <InputAdornment  position="end">{Boolean(formik.errors.password) && formik.touched.password ? <button style={{border: "none", background: "none", margin: "0", padding: "0"}} onClick={(e)=>formik.values.password=""}><Tooltip title={formik.errors.password} open={true}><img src={xIcon} className={xIcon}></img></Tooltip></button> : ""}</InputAdornment>,}}className='inputTextfield' key="editor1"  label={formik.values.password==''? 'Enter your password' : ''}  InputLabelProps={{shrink: false, style: {color: "#B4B4B4"}}} fullWidth variant="outlined" onChange={formik.handleChange}/>
                        </Grid>


                        <Grid item container justify="space-between" alignItems="center" className="checkBoxContainer">
                            <Grid item className="aaa">
                                <Checkbox style ={{color: "#48DDB8",}} className="checkbox"/>
                                <p class="rememberMe" style={{color: "#B4B4B4"}}>Remember me</p>
                            </Grid>
                            <Link to={`/auth/forgotpassword`}>
                                <Grid item><p className="forgotPassword">Forgot your password?</p></Grid>
                            </Link>
                        </Grid>

                        <Grid item container spacing={2} direction="column" justify="center" alignItems="stretch">
                            <Grid item>
                                <Button type="submit" submit onClick={signIn} className="signInButton" variant="contained" disableElevation>
                                    <p className="buttonText" style={{fontWeight: "bold", color: "white"}}>SIGN IN</p>
                                </Button>

                            </Grid>
                            <Grid item>
                            <Link to={`/auth/register`} style={{textDecoration: 'none'}}>


                            </Link>
                            </Grid>
                        </Grid>

                    </Grid>
                    </form>
                </Container>
            </Grid>

            <Grid item xs={0} md={8} className="carouselContainerAlpha">
                    <Carousel></Carousel>
            </Grid>
        </Grid>
        )

    )
}

export default Login;