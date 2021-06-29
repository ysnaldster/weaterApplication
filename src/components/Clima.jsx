import React, { useState } from 'react'
import { useForm } from './hook/useForm.jsx'
import { Input, Button, Grid, GridItem } from "@chakra-ui/react"
import { Container, Col, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { IoSearch } from 'react-icons/io5'
import axios from 'axios'


// Estilos 

const StyledMainContainers = styled(Col)`
    padding: 30px;
    text-align: center;
    background-color: #eeee;
    height: 94vh;
`
const StyledInput = styled(Input)`
    padding: 5px 20px;
    border-radius: 20px;
    border: none;
`
const StyledButtonSearch = styled(Button)`
    margin-left: 20px;
    background: rgba(0,0,0,.06);
    border: none;
    padding: 10px;
    border-radius: 10px;
`
const StyledForm = styled.form`
    display: flex; 
    justify-content: center;
`

const StyledGridItem = styled(GridItem)`
    display: flex; 
    justify-content: center; 
    align-items: center;
    flex-direction: column; 
`

const apiKey = 'pk.eyJ1IjoieXNuYWxkbyIsImEiOiJja3FnMXJkeGQxZm1pMm5wM2J2ams3N3U5In0.GEVkBjB7IHn8dPjs9cUGYg'



const Clima = () => {

    const [formValues, handleInputChange] = useForm({
        localidad: '',
    })
    const { localidad } = formValues;
    const [humedad, setHumedad] = useState(0.17 * 100)
    const [summary, setSummary] = useState('Mostly Cloudy')
    const [cloudCover, setCloudCover] = useState(0.75 * 100)
    const [low, setLow] = useState(40)


    const DispararAlerta = (e) => {
        e.preventDefault();
        console.log(localidad);
        const traerInfo = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${localidad}.json?access_token=${apiKey}`)
        traerInfo
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                const { features } = !!data && data;
                const resultado = features[0].geometry.coordinates;
                console.log(resultado[0], resultado[1]);
                if (data !== null) {
                    axios.get(`https://corsproxybypass.herokuapp.com/https://api.darksky.net/forecast/88030114c5e47763a011a75e7a10c633/${resultado[0]},${resultado[1]}`)
                        .then((response) => {
                            console.log(response);
                            console.log(response.data);
                            localStorage.setItem('icono', response.data.currently.icon);
                            localStorage.setItem('humedad', (response.data.currently.humidity) * 100)
                            localStorage.setItem('summary', response.data.currently.summary)
                            localStorage.setItem('cloudCover', (response.data.currently.cloudCover) * 100)
                            localStorage.setItem('low', (response.data.currently.temperature) * -1)
                            // Obtener
                            localStorage.getItem('icono')
                            setHumedad(localStorage.getItem('humedad'))
                            setSummary(localStorage.getItem('summary'))
                            setCloudCover(localStorage.getItem('cloudCover'))
                            setLow(localStorage.getItem('low'));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }

            })
            .catch(console.log('No se pudo traer la información'))
    }
    return (
        <div>
            <Container fluid>
                <Row>
                    <StyledMainContainers xs={12}>
                        <p>Consultar las codiciones Meteorológicas</p>
                        <StyledForm onSubmit={DispararAlerta} >
                            <StyledInput type='search' placeholder='Ingrese una ubicación ' name='localidad' value={localidad} onChange={handleInputChange} />
                            <StyledButtonSearch type='submit' style={{ marginLeft: '20px' }}>
                                <IoSearch />
                            </StyledButtonSearch>
                        </StyledForm>
                        <Grid
                            h="84px"
                            templateRows="repeat(2, 1fr)"
                            templateColumns="repeat(8, 1fr)"
                            gap={6}
                            style={{ margin: '0px 500px', paddingTop: '20px' }}
                        >
                            <GridItem rowSpan={2} colSpan={1}>
                                <img src='https://i.ibb.co/7yn7DNT/icon-clima.png' width='84px' height='84px' />
                            </GridItem>
                            <StyledGridItem colSpan={3} style = {{fontSize: '30px',fontWeight: 'bold'}}>{cloudCover}°</StyledGridItem>
                            <StyledGridItem colSpan={3} style = {{fontSize: '20px', fontWeight: 'bold'}}>{summary}</StyledGridItem>
                            <StyledGridItem colSpan={2} > <strong>Feels Like:</strong> {cloudCover}</StyledGridItem>
                            <StyledGridItem colSpan={2} > <strong>Low:</strong>{low}</StyledGridItem>
                            <StyledGridItem colSpan={2} > <strong>High:</strong>{cloudCover}</StyledGridItem>
                        </Grid>
                    </StyledMainContainers>
                </Row>
            </Container>

        </div>
    )
}

export default Clima
