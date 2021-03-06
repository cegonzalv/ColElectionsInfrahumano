import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { withStyles, Grid } from "material-ui";

import {
  RegularCard,
  ItemGrid,
  BarChart,
  Button,
  ProfileCard,
  PercentageVotes,
  ColombiaMap
} from "components";



import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

const baseUrl = "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/";
const primeraVuelta = {
  "url":"https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/primera_vuelta_presidencial.csv"
};
const segundaVuelta = {
  "url":"https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/segunda_vuelta_presidencial.csv"
}
const candidatosPrimera = [{
  nombre:"Iván Duque",
  id:"iván-duque",
  csv:"iván duque",
  partido:"Centro Democrático"
},
{
  nombre:"Gustavo Petro",
  id:"gustavo-petro",
  csv:"gustavo petro",
  partido:"Coalición Petro Presidente"
},
{
  nombre:"Sergio Fajardo",
  id:"sergio-fajardo",
  csv:"sergio fajardo",
  partido:"Coalición Colombia"
},
{
  nombre:"Germán Vargas Lleras",
  id:"germán-vargas-lleras",
  csv:"germán vargas lleras",
  partido:"Coalición #Mejor Vargas Lleras",
},
{
  nombre:"Humberto De La Calle",
  id:"humberto-de-la-calle",
  csv:"humberto de la calle",
  partido:"Coalición Partido Liberal y ASI",
},
{
  nombre:"Promotores del Voto en Blanco",
  id:"promotores-voto-en-blanco",
  csv:"promotores voto en blanco",
  partido:""
}
]
const candidatosSegunda =[{
  nombre:"Iván Duque",
  id:"iván-duque",
  csv:"iván duque",
  partido:"Centro Democrático"
},
{
  nombre:"Gustavo Petro",
  id:"gustavo-petro",
  csv:"gustavo petro",
  partido:"Coalición Petro Presidente"
}]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions:[],
      vuelta: "primera",
      candidate:{},
    };

  }

  compare(a,b) {
    if (a.count < b.count)
      return -1;
    if (a.count > b.count)
      return 1;
    return 0;
  }

  separarNombres(names){
    return names.split(' ').join('-');
  }


  cambiarPrimeraVuelta(){
    if(this.state.vuelta !== "primera")
      this.setState({vuelta:"primera",candidate:{}})
  }
  cambiarSegundaVuelta(){
    if(this.state.vuelta !== "segunda")
      this.setState({vuelta:"segunda",candidate:{}})
  }
  handleCandidateClick(candidato){
        this.handleScrollToElement();

    this.setState({candidate:candidato})
  }
  handleScrollToElement() {
  let checkExists = setInterval(()=> {
  const testNode = ReactDOM.findDOMNode(this.refs.candidate)
  if (testNode) {
    clearInterval(checkExists);

    testNode.scrollIntoView({behavior: 'smooth',block:"start"});
   }
  }, 200); // check every 100ms
  }
  

      render() {
        let descripcionDepartamento = "Vista detallada de las votaciones que recibió " + this.state.candidate.nombre + " por departamento."
        let descripcionDepartamentoPorcentaje = "Vista detallada del porcentaje de las votaciones que recibió " + this.state.candidate.nombre + " por departamento."
        let descripcionMapa = "Vista detallada de la distribución de los votos por municipio para el candidato " + this.state.candidate.nombre + "."
        const encodingDepartamento = {
          "x": {"field": "departamento", "type": "ordinal","sort": {"op": "sum", "field": this.state.candidate.csv,"order":"descending"}},
          "y": {"aggregate":"sum", "field": this.state.candidate.csv, "type": "quantitative" }
        }
        const encodingPorcentaje = {
          "x": {"field": "departamento", "type": "ordinal","sort": {"op": "average", "field": "PercentOfTotal","order":"descending"}},
          "y": {"aggregate":"average","field": "PercentOfTotal", "type": "quantitative", "axis":{
            "title":"Porcentaje de Votos"
            }
          },
          "color": {
            "condition": {
              "selection": "org",
              "bin":true,
              "field": "PercentOfTotal", "type": "quantitative"
            },
            "value": "grey"
          }
        }
        const transform = [
          {
            "calculate": "datum['" + this.state.candidate.csv + "']/datum.votantes * 100",
            "as": "PercentOfTotal"
          }
        ]

       

        const selection = {
          "org": {
              "type": "single",
              "fields": ["departamento"],
              "bind": {"input": "select","options": ["Amazonas","Antioquia","Arauca","Atlantico","Bogotá D.C.","Bolivar","Boyaca",
              "Caldas","Caqueta","Casanare","Cauca","Cesar","Choco","Cordoba","Cundinamarca","Guainia","Guaiviare","Huila","La Guajira",
              "Magdalena","Meta","Nariño","Norde de San","Putumayo","Quindio","Risaralda","San Andres","Santander","Sucre","Tolima","Valle",
              "Vaupes","Vichada"]}
            }
          }

         const transformMapa = [
          {
            "calculate": "datum['" + this.state.candidate.csv + "']/datum.votantes * 100",
            "as": "% de votos obtenidos"
          }
        ]
        const sizeMapaPorcentaje = {
          "field":"% de votos obtenidos",
          "type": "quantitative"
      }
      const sizeMapaConteo = {
        "field":this.state.candidate.csv,
        "type": "quantitative"
      }

        let data = primeraVuelta;
        let dataTotal = {
          url:"https://raw.githubusercontent.com/cegonzalv/ColElectionsInfrahumano/master/totales_" + this.state.vuelta+"_vuelta.csv"
        }
        let dataAgrupada = {
          url : "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/"+this.state.vuelta+"_vuelta_agrupada.csv"
        }
        if(this.state.vuelta === "segunda"){
          data = segundaVuelta; 
        }
        let profiles = [];
        let candidatos = candidatosPrimera;
        let size = [12,6,4];
        if(this.state.vuelta === "segunda"){
          candidatos = candidatosSegunda;
          size = [6,6,6];
        }
          candidatos.map((candidato)=>{
            profiles.push(
            <ItemGrid xs={size[0]} sm={size[1]} md={size[2]} key={candidato.id} >
              <ProfileCard
              avatar={baseUrl + this.separarNombres(candidato.id) + ".jpg"}
              title={candidato.nombre}
              candidato = {candidato}
              vuelta = {this.state.vuelta}
              subtitle={candidato.partido}
              description={<div><PercentageVotes candidato = {candidato.csv} data = {dataTotal}/></div>}
              footer={<Button onClick={()=>this.handleCandidateClick(candidato)}>Estadísticas</Button>}
              >
              </ProfileCard>
            </ItemGrid>
            )
            return candidato
        })
    return (
      <div>
      <Grid container>
          <h3>
          Estos gráficos muestran estadísticas de las votaciones de primera y segunda vuelta de las elecciones
          de Colombia del 2018.
          </h3>
          <ItemGrid xs={4} sm={4} md={4}/>
          <ItemGrid xs={4} sm={4} md={4}>
            <Button
              title="Seleccionar primera vuelta"
              color="info"
              onClick={()=>this.cambiarPrimeraVuelta()}
            >
            Primera Vuelta
            </Button>
            <Button
              title="Seleccionar segunda vuelta"
              color="success"
              onClick={()=>this.cambiarSegundaVuelta()}
            >
            Segunda Vuelta
            </Button>
          </ItemGrid>
          <ItemGrid xs={4} sm={4} md={4}/>

        </Grid>
        <h3>
          Candidatos
          </h3>
          <h4>
          (Seleccione uno para ver sus estadísticas)
          </h4>
        <Grid container>
        {
          profiles
        }
        </Grid>

      {this.state.candidate.csv &&
      <div ref="candidate">
        <Grid container>
          <ItemGrid xs={10} sm={10} md={9}>
          <RegularCard
              headerColor="green"
              cardTitle="Votaciones por departamento"
              cardSubtitle={descripcionDepartamento}
              content={
              <BarChart data= {data} encoding = {encodingDepartamento}/>
          }
          />
          </ItemGrid>
          <ItemGrid xs={2} sm={2} md={3}>
            {/*<Grid>
              <StatsCard
                icon={ThumbUp}
                iconColor="blue"
                title="Departamentos con mayor cantidad de votos"
                description={this.state.numPlacesTotal}
                statIcon={Update}
                statText="real time"
              />
              <StatsCard
                icon={ThumbDown}
                iconColor="red"
                title="Departamentos con menor cantidad de votos"
                description={this.state.numPlacesTotal}
                statIcon={Update}
                statText="real time"
              />
            </Grid>*/}
            
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={10} sm={10} md={9}>
          <RegularCard
              headerColor="blue"
              cardTitle="Porcentaje de votación por departamento"
              cardSubtitle={descripcionDepartamentoPorcentaje}
              content={
              <BarChart data= {dataAgrupada} encoding = {encodingPorcentaje} selection = {selection} transform = {transform}
              />
              }
          />
          </ItemGrid>
          <ItemGrid xs={2} sm={2} md={3}>
          {/*<Grid>
              <StatsCard
                icon={ThumbUp}
                iconColor="blue"
                title="Departamentos con mejor porcentaje de votos"
                description={this.state.numPlacesTotal}
                statIcon={Update}
                statText="real time"
              />
              <StatsCard
                icon={ThumbDown}
                iconColor="red"
                title="Departamentos con peor porcentaje de votos"
                description={this.state.numPlacesTotal}
                statIcon={Update}
                statText="real time"
              />
            </Grid>*/}
            </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="red"
              cardTitle="Votos por municipio"
              cardSubtitle={descripcionMapa}
              content={
                <Grid container>
                  <ItemGrid xs={6} sm={6} md={6}>
                    <ColombiaMap candidato = {this.state.candidate.csv} vuelta={this.state.vuelta} 
                    size ={sizeMapaConteo}/>
                  </ItemGrid>
                  <ItemGrid xs={6} sm={6} md={6}>
                    <ColombiaMap 
                    candidato = {this.state.candidate.csv} vuelta={this.state.vuelta} 
                    size ={sizeMapaPorcentaje} transform = {transformMapa}/>
                  </ItemGrid>
                </Grid>
              }
          />
          </ItemGrid>
        </Grid>
        </div>
      }
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
