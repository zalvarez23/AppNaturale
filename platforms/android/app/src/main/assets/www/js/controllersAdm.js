var urlNaturale = "http://200.110.43.43/ContentServicesNaturale.asmx/";
//var urlNaturale = "http://192.168.0.10:8093/ContentServicesNaturale.asmx/";

function getDateNow(){
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
var f=new Date();
return diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
}


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
var fecha1,fecha2;
var con=0;
fecha1=getDateHoy();
fecha2=getDateHoy();
fecha1M=getDateHoy();
fecha2M=getDateHoy();

angular.module('starter.controllers', [])

.controller("ctrlhome",function($scope,$ionicHistory,$ionicSideMenuDelegate,Adms,$element,$location,$timeout,$ionicLoading){ 


  $scope.sorting = [{score: 0, name : 'Lista de rutas',icon:'ion-clipboard',hreff:'perfil'}, 
                    {score: 1, name : 'Reporte Tiendas',icon:'ion-ios-home',hreff:'puntacumulado'}, 
                    {score: 2, name : 'Reporte Productos',icon:'ion-ios-cart',hreff:'quiebre'}, 
                    {score: 3, name : 'Reporte Fotos',icon:'ion-camera',hreff:'mantenimiento'}, 
                    {score: 4, name : 'Cerrar Sesión',icon:'ion-power',hreff:''}];  
                      
          var content=document.getElementById("contentPanel")    


  $scope.openMenu = function () {
     $ionicSideMenuDelegate.toggleLeft();
  };  
  $scope.$watch(
   function () {
      return $ionicSideMenuDelegate.getOpenRatio();
   },
   function (ratio) {
     $scope.sidemenuopened = (ratio == 1);
      if (Math.abs(ratio)>0.001) {
     

            content.style['opacity']=0.9-Math.abs(ratio/2);
        // .style.opacity = $scope.opa;
        } else {
          content.style['opacity']='';
        }

   });
  $scope.redirectWiew= function(id){
    
    if (id=='0') {
      
    location.href="indexAdm.html#/adm/perfil/" + Adms.getUsuario()[0].nombre + '&' + Adms.getUsuario()[0].usunick;
    }else if (id=='1') {
      $location.path('/adm/puntacumulado')
    
    }else if (id=='2'){
      $location.path('/adm/quiebre')
    }else if(id=='3'){
      $location.path('/adm/mantenimiento')
    }else if(id=='4'){
 
      cerrarSesion();
    };
  };
  
   function callAtTimeout() {
   location.href="index.html#/login" ;
}
  function cerrarSesion(){

    $ionicLoading.show({
    template: 'Cerrando sesión . . ',
    duration: 2000
  
  })
   $timeout(callAtTimeout, 2000);
  };
  
})
.controller("ctrlListaRutas",function($scope,$http,$ionicPopup,$stateParams,Adms,$timeout){

    $scope.fechaNow=getDateNow();
$scope.usuSuper=[{cosupe:'Todos'}];

var parameters= $stateParams.idperfil
document.getElementById('txtnomusu').innerHTML = 'test';
 parameters=parameters.split("&") 
var dataUsuario=[{nombre: parameters[0], usunick: parameters[1]}];
//LLENAMOS FACTORIA CON DATOS DE USUARIO
Adms.LlenarUsuario(dataUsuario);
$scope.nombreUsu=Adms.getUsuario()[0].nombre;
//

$scope.checkeds = Adms.getCheckedCondition();  
                    
 $scope.HabilitarCheck = function(chk){
   var chkR = document.getElementById(chk);
  if (chk == "Pendientes") {
    if (chkR.checked== true) {
    $scope.checkeds[2].check = false;
    };
  }else if (chk == "Puntuadas"){
      if (chkR.checked== true) {
        $scope.checkeds[0].check = false;
        $scope.checkeds[1].check = true;
      }
  };
}
  var fechaini,fechafini;
  fechaini= document.getElementById("fechaini")
  fechaini.value=fecha1;
  fechafini=document.getElementById("fechafin")
  fechafini.value=fecha2
// WALORES PARA PETICIÓN HTTP.

// PETICIÓN HTTP ANGULAR .
$scope.ListarTotal=function(){
  // CONDICIÓN PARA FILTRAR GREEN O RED , QUIERE DECIR , PUNTUADOS O NO PUNTUADOS
  if ($scope.checkeds[2].check==true) {
    $scope.checkeds[2].auxiliar='green'
  }else{
    $scope.checkeds[2].auxiliar='red'
  };
  //
$scope.colorsis=''
fecha1=fechaini.value;
fecha2=fechafini.value;
var walor=0;
  for (var i = 0; i < $scope.checkeds.length; i++) {
   
        if ($scope.checkeds[i].check == true) {
          walor+=$scope.checkeds[i].num;
                    
        }
      }
   var supePar;
  if ($scope.usuSuper[0].cosupe=="Todos") {
      supePar = "";
  }else{
    supePar = $scope.usuSuper[0].cosupe;
  };
 
  // VALIDAMOS CONDICIONES
  var fotosino;
  var flagpunt;
  
  if (walor==1) {
    fotosino = 'SI'; flagpunt='NO'
  }else if (walor == 2){
    fotosino = 'NO'; flagpunt='NO'
  }else if (walor == 3){
    fotosino = ''; flagpunt='NO'
  }else if (walor == 4){
    fotosino='SI'; flagpunt='SI'
  }else if (walor == 5){
    fotosino='NO'; flagpunt='SI'
  }else if (walor == 6){
    fotosino = ''; flagpunt='SI'
  };
  var params = 
  {       
          fechaini: fechaini.value,
          fechafin: fechafini.value,
          usuario: supePar,
          fotosino: fotosino,
          flagpunt:flagpunt

  }
  

 document.getElementById("divCargandoH").style.display="";
$http({url: urlNaturale + 'ListaRutasTotal',
        method: 'GET',
        params: params
       }).success(function(data){
      
    if (data=='error') {
     
  
    $scope.listaTotales=null;     
    document.getElementById("divCargandoH").style.display="none";
   //location.href="#/tab/rutas" 
    return;
    }else{

    Adms.LlenarRutas(data);
    $scope.listaTotales=Adms.getRutas();
    Adms.LlenarCondicion('1') 
        
        document.getElementById("divCargandoH").style.display="none";
    };
        }).error(function(){
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        
    });
}

//TRAER USUARIOS 


  $scope.getUsuarios=function(){
  $http({url: urlNaturale + 'ListaUsuariosR',
        method: 'GET',
       }).success(function(data){
    
    Adms.LlenarSuper(data);
    $scope.ListaSuper=Adms.getSuper();
    con = 1;
        }).error(function(){
              
    });
  }  
//
// WALORES INICIALES ! ! !
//CONDICION PARA LISTAR FACTORIAS O REALIZAR NUEVA CONSULTA

  if (Adms.getCondicion()=='0') {
     $scope.ListarTotal();
  }else{
    $scope.listaTotales=Adms.getRutas();
  };
   if (Adms.getCondicion()=='0') {
     $scope.getUsuarios();
  }else{
    $scope.ListaSuper=Adms.getSuper();
  };
  
 


})
.controller("ctrlPuntu",function($scope,$http,$ionicPopup,$stateParams,$ionicSlideBoxDelegate,Adms,$ionicLoading,$timeout,$ionicModal,$ionicSlideBoxDelegate,$ionicScrollDelegate, Adms){

var loading = document.getElementById('LoadingHistorial');

$scope.titleRutaFoto = 'DETALLE DE PEDIDO'
$scope.checkedTipo = true;
$scope.checkedPunt = true;

var parameters=$stateParams.idpun;
parameters = parameters.split("|");

  $scope.puntajes = [parameters[9],parameters[10]];
var contentHistorialVenta = document.getElementById('contentVentaHis')

if (parameters[2]=='si') {
  contentHistorialVenta.style.display='';
}else{
  contentHistorialVenta.style.display='none';
}; 

// TIPO DOCUMENTO
if (parameters[6]=="F") {
$scope.checkedTipo = false;
}else {
  $scope.checkedTipo = true;
};
// MOSTRAMOS PUNTUTADOS
if (parameters[7]=="SI") {
  document.getElementById('btnPuntuar').style.display = "none" ;
  document.getElementById('checkPunt').style.display = "none";


  if (parameters[8] == parameters[9]) {
    $scope.checkedPunt = true;
  }else{
    $scope.checkedPunt = false;
  };

};
var tipoDocN;
$scope.getTipoDoc=function(tip){
  if (tip==true) {
    tipoDocN="B"
    return 'Boleta'
  }else{
    tipoDocN="F"
    return 'Factura'
  };
}
var puntFoto = 0;
$scope.getPuntuacion=function(tip){
  if (tip==true) {
    puntFoto = $scope.puntajes[0];
    return puntFoto
  }else{
    puntFoto = $scope.puntajes[1];
    return puntFoto
  };
}
$scope.redirect = function(){

}
$scope.productosAgregados = [];
$scope.calculoTotal=function(){
  var items = $scope.productosAgregados;
  if (items.length==0) {
    return 0.0;
  }else{
    var total=0;
     for (var i = 0; i < items.length; i++) {
      total += parseFloat(items[i].cantidad) * parseFloat(items[i].precProducto)
    };
 
    return "SubTotal : " + (total * 1.18).toFixed(3) + " S/."
  };
  
}
  $scope.ListaDetallePedido = function(con){
  // SI FLAG DE FOTOS ESTA ACTIVADO , LISTAR MULTIFOTOS
  if (parameters[3] !='si') { return ; };

   var params = {
                idsupe: parameters[0],
                idcanal: parameters[1]
            }
// FUNCION HTTPS PARA LOGEAR RUTAS POST . .

$http({url: urlNaturale + 'ListaDetallePedido',
        method: 'GET',
        params: params
       }).success(function(data){
     var items = data;
     for (var i = 0; i < items.length; i++) {

       $scope.productosAgregados.push(
        {
          id: items[i].idProducto,
          desProducto: items[i].desProducto,
          precProducto: items[i].precProducto,
          check: true,
          cantidad: items[i].cantidad,
          flagReg: 1

        })
        
     }
       
       })
//
  
 }

  $scope.ListaMultiFotos = function(con){
  // SI FLAG DE FOTOS ESTA ACTIVADO , LISTAR MULTIFOTOS
  if (parameters[4] !='si') { return ; };

   var params = {
                id: parameters[0]
            }
// FUNCION HTTPS PARA LOGEAR RUTAS POST . .

$http({url: urlNaturale + 'ListaMultiFotos',
        method: 'GET',
        params: params
       }).success(function(data){
        $scope.valuesFoto = {
                          imgURI : data[0].urlfoto,
                          coment : data[0].coment,
                          fecha : data[0].fecha,
                          tipofoto: data[0].tipfoto
                        }
        $scope.pictures = data;
        
        loading.style.display='none';
       })
//
  
 }
$scope.PuntuacionFotos = function(){

 $ionicLoading.show({
    template: 'Generando Puntuación . . '
  
  })
  var usunick = Adms.getUsuario()[0].usunick;
   var params = {
                punt: puntFoto,
                cousua: usunick,
                nuregi: parameters[0]
            }


$http({url: urlNaturale + 'PuntuacionFotos',
        method: 'GET',
        params: params
       }).success(function(data){
       
        $ionicLoading.hide();
  $ionicLoading.show({
    template: 'Puntuación Generada Correctamente. . ',
    duration: 1000
    
  })

    Adms.LlenarCondicion('0'); 
       })
//
  
 }
  //
}).controller("ctrlPunAcum",function($scope,$http,Adms){
  // CAPTURAMOS WALORES DE FECHAS CON JAWASCRIPT
    var fechaDesde=document.getElementById("txtDesde11");
    var fechaHasta=document.getElementById("txtHasta11");
    var loading = document.getElementById("divCargandoP");
  //
    
    fechaDesde.value=Adms.getFecha()[0].valor;
    fechaHasta.value=Adms.getFecha()[1].valor;
  //LLENAMOS SCOPE PARA CARGAR FECHA ACTUAL EN LOS CONTROLES 
    $scope.fechaNow=getDateNow();
  //

  //FUNCTION LISTAR PUNTUAJE ACUMULADO

    $scope.ListaReportTiendas = function(){
   loading.style.display = '' ;

         var params = {
                fechaini: fechaDesde.value,
                fechafin: fechaHasta.value
            }
// FUNCION HTTPS PARA LOGEAR RUTAS POST . .

$http({url: urlNaturale + 'ReporteTiendasCantidad',
        method: 'GET',
        params: params
       }).success(function(data){
       
       $scope.ListaReport = data;
        
        loading.style.display='none';
       })
//
    }
  
  //
}).controller("ctrlQuiebres",function($scope,$http,Adms,$filter,$ionicPopup){
  $scope.fechaNow=getDateNow();

// CAPTURAMOS WALORES DE FECHAS CON JAWASCRIPT
    var fechaDesde=document.getElementById("txtDesde1");
    var fechaHasta=document.getElementById("txtHasta1");
    var loading = document.getElementById("divCargandoPQ");
  //
    
    fechaDesde.value=Adms.getFecha()[0].valor;
    fechaHasta.value=Adms.getFecha()[1].valor;
  //LLENAMOS SCOPE PARA CARGAR FECHA ACTUAL EN LOS CONTROLES 
    $scope.fechaNow=getDateNow();
 
  //
  //FUNCTION LISTAR PUNTUAJE ACUMULADO
   $scope.ListaReportProductos = function(){
    loading.style.display="";
       var params = {
                fechaini: fechaDesde.value,
                fechafin: fechaHasta.value
            }
// FUNCION HTTPS PARA LOGEAR RUTAS POST . .

$http({url: urlNaturale + 'ReporteProductosCantidad',
        method: 'GET',
        params: params
       }).success(function(data){
       
       $scope.ListaReport = data;
        
        loading.style.display='none';
       })

     
      
    }

   
}).controller("ctrlMantenimiento",function($scope,$http,$ionicPopup,Adms,$ionicActionSheet,$ionicLoading,$location){
   $scope.fechaNow=getDateNow();
  var fechaini,fechafini;
  var loading = document.getElementById('divCargandoM');
  fechaini= document.getElementById("fechainii")
  fechaini.value=fecha1M;
  fechafini=document.getElementById("fechafinn")
  fechafini.value=fecha2M;
// WALORES PARA PETICIÓN HTTP.
  
     $scope.ListaReportFotos = function(){
    loading.style.display="";
       var params = {
                fechaini: fechaini.value,
                fechafin: fechafini.value
            }
// FUNCION HTTPS PARA LOGEAR RUTAS POST . .

$http({url: urlNaturale + 'ReporteFotosCantidad',
        method: 'GET',
        params: params
       }).success(function(data){
       
       $scope.ListaReport = data;
        
        loading.style.display='none';
       })

     
      
    }
 
  
}).controller("ctrlUpdateRuta",function($scope,$http,Adms,$ionicLoading,$stateParams){
  $scope.fechaNow=getDateNow();
  var parameters= $stateParams.iddet
  var fechaUpdate;
  parameters=parameters.split("&") 

  //LLENAMOS COMBO DE LAS RUTAS A CAMBIAR
  
  $scope.LlenarRutas=function(){

     $http.get('http://peruvending.com/naturale/adm/Controladores/ListaRutasAux.php').
  success(function(data) {
    Adms.LlenarRutasAux(data);
    $scope.ListaRutasAux=Adms.getRutasAux();
    
  });
  }
 // LLENAMOS REGISTROS UPDATE
  $scope.listDet=[{co_usua_supe: parameters[1],
                  fe_supe: parameters[2],
                  no_cana: parameters[3],
                  no_clie: parameters[4],
                  no_area: parameters[5],
                  co_ruta: parameters[6]}];



  // LLENAMOS SUPERWISORES
 fechaUpdate=document.getElementById('txtfesupe')
 fechaUpdate.value=$scope.listDet[0].fe_supe;
  $scope.usuSuper=[{cosupe:$scope.listDet[0].co_usua_supe}];
  $scope.ListaSuper=Adms.getSuper();
  //LLENAMOS RUTAS LISTA
  if (Adms.getRutasAux()=='') {
  $scope.LlenarRutas();
  }else{
      $scope.ListaRutasAux=Adms.getRutasAux();
  };
  
  // WALORES PARA MANDAR A UPDATE

  $scope.ruta=[{coruta:$scope.listDet[0].co_ruta}];
  //LLENAMOS WALORES POR DEFECTO SEGUN RUTA REGISTRADA

  //
  $scope.UpdateRuta=function(){
   $ionicLoading.show({
    template: 'Actualizando Ruta. . ',


  })
    $scope.listDet[0].co_usua_supe=$scope.usuSuper[0].cosupe;
    $scope.listDet[0].fe_supe=fechaUpdate.value;
    $scope.listDet[0].co_ruta=$scope.ruta[0].coruta
    var supeS,fechaS,rutaN,usuarioS,idS;
    supeS=$scope.listDet[0].co_usua_supe;
    fechaS=$scope.listDet[0].fe_supe;
    rutaN=$scope.listDet[0].co_ruta;
    usuarioS=Adms.getUsuario()[0].usunick;
    idS=parameters[0]

    
    var reqCanal = { 
  method: 'POST',
  url: 'http://peruvending.com/naturale/adm/Controladores/UpdateRuta.php',
  headers: {   'Content-Type': undefined },
  data: { supe: supeS,
          ruta: rutaN,
          fecha:fechaS,
          usuario: usuarioS,
          id:idS}

}
 $http(reqCanal).success(function(data){
      
    if (data=='realizado') {
       $ionicLoading.hide();
                  $ionicLoading.show({
    template: 'Ruta Actualizada correctamente . . ',
    duration: 1000
    
  })
      };
        }).error(function(){
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        
    });
  }


})
