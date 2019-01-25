function getDateHoy(){
  var hoy = new Date();
var dd = hoy.getDate();
var mm = hoy.getMonth()+1; //hoy es 0!
var yyyy = hoy.getFullYear();
if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 
  hoy = yyyy+'-'+mm+'-'+dd;
  return hoy;
}
angular.module('starter.services', [])

.factory('Adms', function() {
  var usuarios;
  var rutasTotales;
  var superw;
  var condicionAcutalizar=0;
  var condicionesCache=[{id:0,cache:'puntacumulado',valor:false}];
  var fechas=[{id:0,valor:getDateHoy(),nom:'Desde'},
              {id:1,valor:getDateHoy(),nom:'Hasta'}]
  var puntajeAcumulado;
  var rutasconQuiebre;
  var listaRutasAux=[];

  var checketCondicon=[{score: 'Pendientes', check : true, num :2,axuiliar:''}, 
                    {score: 'Concretados', check : true, num :1,auxiliar:''},
                    {score: 'Puntuadas', check:false, num:3,auxiliar:''}];

  return {

     // SERVICIOS DE LISTA RUTAS AUXLIIAR
     LlenarRutasAux: function(array){

      listaRutasAux=array;
    },
    getRutasAux:function(){
      return listaRutasAux;
    },
    //SERWICOS DE CHECKED
    getCheckedCondition:function(){
        return checketCondicon;
    },
    //
    // SERVICIOS DE SUPER
     LlenarSuper: function(array){

      superw=array;
    },
    getSuper:function(){
      return superw;
    },
    // SERVICIOS DE USUARIOS
    LlenarUsuario: function(array){

      usuarios=array;
    },
    getUsuario:function(){
      return usuarios;
    },
    // SERVICIOS DE RUTAS LISTA 
     LlenarRutas: function(array){

      rutasTotales=array;
    },

    getRutas:function(){
      return rutasTotales;
    },
    // SERIVICIO DE CONDICION PARA LISTAR
    LlenarCondicion:function(con){
      condicionAcutalizar=con;
    },

    getCondicion:function(){
      return condicionAcutalizar;
    },
    //SERWICIOS PARA LLAMAR A LA FECHA ACTUAL
    getFecha:function(){
      return fechas;
    },
    //
    // SERWICIOS PARA LLENAR Y TRAER PUNTAJE ACUMULADOS
    LlenarPuntajeAcumulado:function(array){
      puntajeAcumulado=array;
    },
    getPuntajeAcum:function(){
      return puntajeAcumulado;
    },
    //  SERWICIOS PARA CACHES
    getCaches:function(){
      return condicionesCache;
    },
      // SERWICIOS PARA LLENAR Y TRAER RUTAS CON QUIEBRE
    LlenarRutasQuiebre:function(array){
      rutasconQuiebre=array;
    },
    getRutasQuiebre:function(){
      return rutasconQuiebre;
    }
   
	};
});
