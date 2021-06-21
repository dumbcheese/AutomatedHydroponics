import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useStyles from './styles';
import './dashboard.css';
import {TextField, Button, Typography, Paper, Checkbox, FormControlLabel, CircularProgress} from '@material-ui/core';
import moment from 'moment';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import Modal from 'react-modal';
import WarningIcon from '@material-ui/icons/Warning';


import * as api from '../../api/index.js';

import {Container, Grow, Grid} from '@material-ui/core';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');


function Dashboard(){
    let user;
    const [currentId, setCurrentId] = useState(null);
    const [latestReading, setLatestReading] = useState({
      "ph": 1, 
      "EC": 3, 
      "temp": 15
    });

    //MODAl
    let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    
  }

  function closeModal() {
    setIsOpen(false);
  }

  const haltOperation = async() =>{
    setPostData({ ...postData, operate: false });
    try{
      const response = await api.postParameters({ ...postData, operate: false });
      console.log(response);
    } catch(error){
      console.log(error);
    }
  }


    // TEMP CHART - month
    const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-project-0-qzqku',
    });

    const chart = sdk.createChart({
      chartId: '83facf4e-f62a-43b8-a03d-88d9f2627cc7',
    });
    // EC Chart - month
    const chart2 = sdk.createChart({
      chartId: 'd9a78084-438d-4f4d-bc0a-a1f11d7d4cd6',
    });
    // TEMP - day
    const chart3 = sdk.createChart({
      chartId: '3a75ab19-7d83-4b7b-8efb-a60145583866',
    });
    // EC Chart - day
    const chart4 = sdk.createChart({
      chartId: '07036c49-1d04-44eb-a28c-988fac1c0597',
    });


    const [allReadings, setAllReadings] = useState([]);
    

    const [postData, setPostData] = useState({
      "pHLow": 0,
      "pHHigh": 0,
      "ECLow": 0, 
      "ECHigh": 0, 
      "tempLow": 0, 
      "tempHigh": 0, 
      "operate": true
    });
    const classes = useStyles();

    useEffect(()=>{
      user = JSON.parse(localStorage.getItem('profile'));
      console.log(user);
      chart
        .render(document.getElementById('chart'))
        .catch(() => window.alert('Chart failed to initialise'));

        chart2
        .render(document.getElementById('chart2'))
        .catch(() => window.alert('Chart failed to initialise'));

       const btn = document.getElementById('refreshBtn');
       btn.addEventListener('click', function(){
         chart.refresh();
         chart2.refresh();

       });

      getLatestReading();
      getAllReadings();
      importParameters();

      var interval = setInterval(()=>{
        getLatestReading();
      },5000)
      var interval = setInterval(()=>{
        getAllReadings();
      },5000)
    }, [])

    const clear = ()=>{
        setPostData({
          "pHLow": 0,
          "pHHigh": 0,
          "ECLow": 0, 
          "ECHigh": 0, 
          "tempLow": 0, 
          "tempHigh": 0,
          "operate": true
        })
  }

      const getAllReadings = async () =>{
        try{
            const response = await api.getAllReadings();
            setAllReadings(response.data);
            const all = response.data;
            
            if(all[all.length-1].EC < 50){
              openModal();
            }
        } catch(error){
            console.log(error);
        }
      }

      const importParameters = async () =>{
        try{
          const response = await api.getParameters();
          setPostData(response.data[0]);
        }catch(error){
          console.log(error);
        }
      }

    const getLatestReading = async () =>{
      try{
          const response = await api.fetchLatestReading();
          setLatestReading(response.data[0]);
      } catch(error){
          console.log(error);
      }
    }

      const inputParameters = async () =>{
        try{
            const response = await api.postParameters(postData);
            console.log(response);
        } catch(error){
            console.log(error);
        }
  }

      const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(postData)
        inputParameters();
    }
    let updatedDayCharts = false;

    const displayDayCharts = () =>{
      const monthCharts = document.getElementById('monthCharts');
      monthCharts.style.display = "none";

      const dayCharts = document.getElementById('dayCharts');
      dayCharts.style.display = "block";
      dayCharts.style.visibility = "visible";
      dayCharts.style.position = "relative";

      if(!updatedDayCharts){
      chart3
        .render(document.getElementById('chart3'))
        .catch(() => window.alert('Chart failed to initialise'));
      chart4
        .render(document.getElementById('chart4'))
        .catch(() => window.alert('Chart failed to initialise'));
      }
      const btn = document.getElementById('refreshBtn');

      btn.addEventListener('click', function(){
        chart4.refresh();
        chart3.refresh();
       
      });

        updatedDayCharts = true;

    }

    const displayMonthCharts = () =>{
      const monthCharts = document.getElementById('monthCharts');
      monthCharts.style.display = "block";
      const dayCharts = document.getElementById('dayCharts');
      dayCharts.style.display = "none";

      chart.refresh();
        chart2.refresh();
    }

    function changeOperateState(){
      if(postData.operate){
        setPostData({ ...postData, operate: false });
      } else{
        setPostData({ ...postData, operate: true });
        
      }
    }

    

    return(
     
      <div id="rootDiv">
            <Grow in>
              
              <Container>
              <Paper className={classes.paper} style={{marginBottom: "60px"}}>
              <div  style={{width: 250, margin: "auto", paddingBottom: 20, textAlign: "center"}}>
                <Typography variant="h5">Latest Reading</Typography>
              </div>
                <div className="latestContAlpha">
                  <div className="latestCont">
                    <Typography variant="h6">Time</Typography>
                    <Typography>{moment(latestReading.time).format('LLLL')}</Typography>
                  </div>
                  <div className="latestCont">
                    <Typography variant="h6">pH</Typography>
                    <Typography>{latestReading.pH}</Typography>
                  </div>
                  <div className="latestCont">
                    <Typography variant="h6">EC</Typography>
                    <Typography>{latestReading.EC}</Typography>
                  </div>
                  <div className="latestCont">
                    <Typography variant="h6">Temperature</Typography>
                    <Typography>{latestReading.temp}</Typography>
                  </div>
                </div>   
              </Paper>
                    <Grid container alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={4} >
                        <Paper className={classes.paper}>
                            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                              <Typography variant="h6">Input Desired Parameters</Typography>
                              <TextField name="pHLow" variant="outlined" label="pH Low" fullWidth value={postData.pHLow} onChange={(e) => setPostData({ ...postData, pHLow: e.target.value })} />
                              <TextField name="pHHigh" variant="outlined" label="pH High" fullWidth value={postData.pHHigh} onChange={(e) => setPostData({ ...postData, pHHigh: e.target.value })} />
                              <TextField name="ECLow" variant="outlined" label="EC Low" fullWidth value={postData.ECLow} onChange={(e) => setPostData({ ...postData, ECLow: e.target.value })} />
                              <TextField name="ECHigh" variant="outlined" label="EC High" fullWidth value={postData.ECHigh} onChange={(e) => setPostData({ ...postData, ECHigh: e.target.value })} />
                              <TextField name="tempLow" variant="outlined" label="Temp Low" fullWidth value={postData.tempLow} onChange={(e) => setPostData({ ...postData, tempLow: e.target.value })} />
                              <TextField name="tempHigh" variant="outlined" label="Temp High" fullWidth value={postData.tempHigh} onChange={(e) => setPostData({ ...postData, tempHigh: e.target.value })} />
                              <FormControlLabel
                                  control={
                                    <Checkbox
                                    checked={postData.operate}
                                      name="checkedF"
                                      onClick={changeOperateState}
                                    />
                                  }
                                  label="Operate"
                                />
                              <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                              <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
                            </form>
                        </Paper>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <Grid container>
                            <Grid item xs={2}>
                              <Button onClick={displayMonthCharts} style={{width: 100}} variant="outlined">Month</Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button onClick={displayDayCharts} style={{width: 100}} variant="outlined">Day</Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button id="refreshBtn" style={{width: 100}} variant="outlined">Refresh</Button>
                            </Grid>
                          </Grid>
                          <div id="monthCharts">
                            <div style={{height: 400}} id='chart'>
                              aaa
                            </div>
                            <div style={{height: 400}} id='chart2'>
                              aaa
                            </div>
                          </div>
                          <div id="dayCharts" style={{visibility: "hidden", position: "absolute", top: 0}} >
                            <div style={{height: 400}} id='chart3'>
                              aaa
                            </div>
                            <div style={{height: 400}} id='chart4'>
                              aaa
                            </div>
                          </div>
                            
                        </Grid>
                    </Grid>
                    <button onClick={openModal}>Open Modal</button>
                    <Modal
                      isOpen={modalIsOpen}
                      onAfterOpen={afterOpenModal}
                      onRequestClose={closeModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >
                      <WarningIcon/><Typography variant="h4">Warning</Typography>
                      <Typography variant="h6">Unusual readings reported by EC sensor.</Typography>
                      <Typography style={{ marginBottom: 20 }}>Please check its' state.</Typography>
                      <Button variant="contained" color="primary" onClick={closeModal}>close</Button>
                      <Button style={{ marginLeft: 10 }} variant="contained" color="secondary" onClick={haltOperation}>halt operation</Button>
                    </Modal>
              </Container>
                
            </Grow>
            </div>
     
    );
}


export default Dashboard;