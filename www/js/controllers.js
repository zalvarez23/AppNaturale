
// VARIABLE RUTA
//var urlNaturale = "http://200.110.43.43/ContentServicesNaturale.asmx/";
var urlNaturale = "http://192.168.0.33:8099/ContentServicesNaturale.asmx/";
//
function getDateNow() {
  var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
  var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
  var f = new Date();
  return diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
}

function getDateHoy() {
  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1; //hoy es 0!
  var yyyy = hoy.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  hoy = yyyy + '-' + mm + '-' + dd;
  return hoy;
}
var usuario;
var rutas;
var usunick, fechahoy;
var condicion = '1';
var walidarFoto = '0'
var fecha1, fecha2;
var filesArch;
fecha1 = getDateHoy();
fecha2 = getDateHoy();
angular.module('starter.controllers', ['firebase'])
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
            filesArch = element[0].files[0];
          });
        });
      }
    };
  }])

  .controller("backControl", function ($scope, $ionicHistory, $ionicSideMenuDelegate) {
    $scope.myGoBack = function () {

      $ionicHistory.goBack();
    };
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

  })
  .controller("FotosCtrl", function ($rootScope, $scope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, $ionicLoading, $http, $stateParams, $window, $location, Chats, $ionicModal, $ionicPopup, $timeout) {

    // parametros de la pagina

    $scope.itemRuta = JSON.parse(localStorage.getItem('dataRuta'));    
    var dataUser = JSON.parse(localStorage.getItem('userData'));
    var paramsSendPedido = {
      i_local : $scope.itemRuta.idTienda,
      ti_docu : 'B',
      nro_seguimiento : $scope.itemRuta.id,
      usuario : dataUser.usuario,
      nu_serie : '',
      listDetalle : []
    }


    var execSavePedido = function(){
      var listDetail = [];
      for (var i = 0; i < $scope.productosAgregados.length; i++) {
        listDetail.push({
          i_producto : $scope.productosAgregados[i].id,
          nu_cant : $scope.productosAgregados[i].cantidad,
          im_prec_vent : $scope.productosAgregados[i].precProducto,
          nu_pedi : 0,
          de_obse : ''
        });
      }
      paramsSendPedido.listDetalle = listDetail;
      console.log(JSON.stringify(paramsSendPedido));
      
      $http({
        url: urlNaturale + 'GuardarPedidoCabDet',
        method: 'GET',
        params: { objPedidoCabDet : JSON.stringify(paramsSendPedido)}
      }).success(function (data) {
        console.log(data);
      }).error(function (err) {
        console.log(err);
      });

    }



    var parameters = $stateParams.fotoId;
    parameters = parameters.split("|");


    //VALIDAMOS SI EL TIPO DE RUTA ES VENTA O NORMAL
    var contentVenta = document.getElementById("contentVenta");

    if (parameters[1] == "si" || parameters[1] == "SI") {
      // SI ES VENTA

      $scope.titleRutaFoto = "VENTA Y TOMA DE FOTOS";
      contentVenta.style.display = "";

    } else {
      // SOLO FOTO
      $scope.titleRutaFoto = "TOMA DE FOTOS";
      contentVenta.style.display = "none";
    };


    //

    // PARAMETROS Y FUNCIONES PARA EL MODAL DE PRODUCTOS 
    $ionicModal.fromTemplateUrl('productos.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.ListaProductos(0);
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
    $scope.changeTxt = function (check, id) {
      var txt = document.getElementById('txt' + id);
      if (check == true) {

        txt.focus();
        txt.value = '';
      } else {
        txt.value = '0';
      };
    }
    //
    $scope.productos = [];

    // funcion PARA LLENAR LOS PRODUCTOS
    $scope.ListaProductos = function (con) {

      $scope.modal.show();
      var loader = document.getElementById('divCargandoProductos');
      if (con == 0) { loader.style.display = ""; };


      var params = {
        idCanal: parameters[2]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaProductos',
        method: 'GET',
        params: params
      }).success(function (data) {

        $scope.productos = data;
        console.log($scope.productos);
        var items = $scope.productosAgregados;

        for (var i = 0; i < items.length; i++) {
          if (items[i].check == true) {

            for (var x = 0; x < $scope.productos.length; x++) {
              if ($scope.productos[x].id == items[i].id) {
                $scope.productos[x].check = true;
                $scope.productos[x].cantidad = items[i].cantidad;

              };
            }
          };
        }

        if (con == 0) { loader.style.display = "none"; };
      }).finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
      //

    }

    $scope.ListaBonificacion = function (con) {


      var params = {
        idLocal: parameters[2]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaBeneficios',
        method: 'GET',
        params: params
      }).success(function (data) {

        $scope.beneficios = data;

      })
      //

    }

    $scope.productosAgregados = [];
    $scope.agregarProducto = function () {
      $scope.productosAgregados = [];
      var items = $scope.productos;
      for (var i = 0; i < items.length; i++) {
        if (items[i].check == true) {
          $scope.productosAgregados.push(
            {
              id: items[i].id,
              desProducto: items[i].desProducto,
              precProducto: items[i].precProducto,
              check: true,
              cantidad: items[i].cantidad
            })

        };
      }
    }

    $scope.calculoTotal = function () {
      var items = $scope.productosAgregados;
      if (items.length == 0) {
        return 0.0;
      } else {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
          total += parseFloat(items[i].cantidad) * parseFloat(items[i].precProducto)
        };

        return "SubTotal : " + (total * 1.18).toFixed(3) + " S/."
      };

    }
    $scope.deleteProductoAgregado = function (item) {

      var index = $scope.productosAgregados.indexOf(item);
      $scope.productosAgregados.splice(index, 1);


    }
    // SCOPE PARA CAMTURAR EL TIPO DE DOCUMENTO
    $scope.MessageConfirm = function (message) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmación',
        template: '<p style="font:menu;">' + message + '</p>'
      });

      confirmPopup.then(function (res) {
        if (res) {          
          execSavePedido();
          $scope.AddCabPedido();
        } else {
          return false
        }
      });
    };
    // SCOPE PARA CAMTURAR EL TIPO DE DOCUMENTO
    $scope.MessageConfirmFoto = function (message) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmación',
        template: '<p style="font:menu;">' + message + '</p>'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.AddMultiFoto();
        } else {
          return false
        }
      });
    };
    // An alert dialog
    $scope.AlertMessage = function (tittle, message) {
      var alertPopup = $ionicPopup.alert({
        title: tittle,
        template: '<p style="font: menu;color: rgb(234, 75, 57);">' + message + '</p>'
      });

      alertPopup.then(function (res) {

      });
    };
    $scope.checkedTipo = false;
    // FUNCION PARA REGISTRAR EL PEDIDO
    $scope.PopAddCabConfirm = function () {
      // VALIDAMOS SI TIENE SELECCIONAR UN ITEM O MAS .
      if ($scope.productosAgregados.length == 0) {
        $scope.AlertMessage('Error', 'No ha seleccionado ningun producto para generar un pedido.')
        return;
      };
      // ABRIMOS POPUP PARA CONFIRMA EL PEDIDO
      $scope.MessageConfirm('Esta por generar un pedido , desea confirmar ?')

    }
    //

    $scope.AddCabPedido = function () {
      $ionicLoading.show({
        template: 'Generando Pedido. . ',


      })

      var params = {
        local: parameters[3],
        tipoDocumento: 'F',
        nroSeguimiento: parameters[0],
        usuario: usunick
      }


      $http({
        url: urlNaturale + 'SaveCabPedido',
        method: 'GET',
        params: params
      }).success(function (data) {
        var id = data;
        $scope.AddDetPedido(id)

      }).error(function () {
        $ionicLoading.hide();
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')

      });

    }


    // FUNCION PARA REGISTRAR EL PEDIDO
    $scope.AddDetPedido = function (idPed) {

      for (var i = 0; i < $scope.productosAgregados.length; i++) {

        var params = {
          idProducto: $scope.productosAgregados[i].id,
          cantidad: $scope.productosAgregados[i].cantidad,
          precUnit: $scope.productosAgregados[i].precProducto,
          idPedido: idPed
        }
        var x = 0;


        $http({
          url: urlNaturale + 'SaveDetPedido',
          method: 'GET',
          params: params
        }).success(function (data) {
          x += 1;

          if (x == $scope.productosAgregados.length) {

            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Pedido Generado Correctamente . . ',
              duration: 1000


            })
            //BLOQUEAMOS LOS BOTONES PARA NO GENERAR NUEVAMENTE UN PEDIDO
            document.getElementById("btnSeleccionaProductos").style.display = 'none';
            document.getElementById("btnGenerarPedido").style.display = 'none';
          };

        }).error(function () {
          $ionicLoading.hide();
          alert('Ocurrio un problema con la conexion, vuelva a intentar.')
          return;
        });

      }


    }


    var tifotosube;
    var FotoMultiple = 0;
    var server = "http://peruvending.com/naturale/adm/uploader2.php",
      filePath,
      namePhoto,
      idphoto;
    idphoto = parameters[0];
    namePhoto = idphoto + '.jpg';

    $scope.usuariologer = usuario;
    $scope.idtxt = idphoto;
    //POPUP //
    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Subió la foto correctamente !',
        template: 'Deseas subir otra fotografía?'
      });
      confirmPopup.then(function (res) {
        if (res) {

          FotoMultiple += 1;
          namePhoto = $stateParams.fotoId + '-' + FotoMultiple + '.jpg';

        } else {
          FotoMultiple = 0;
          location.href = "#/tab/rutas";
        }
      });
    };

    //

    $scope.viewPhoto = function (img) {
      $scope.imgURI = img;

    }
    // $scope.pictures=[{src: 'img/adam.jpg'},{src: 'img/300.png'},{src: 'img/emoliente.jpg'},{src: 'img/chichamorada.jpg'}];
    $scope.pictures = [];

    $scope.takePicture = function () {
      var config = Chats.all()
      if ($scope.pictures.length == 4) {
        alert('Ya llego al maximo de fotos tomadas .');
        return;
      };

      if (config[0].checked == false) {
        tifotosube = 'cam'

        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 250,
          targetHeight: 324,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        }
      } else {
        tifotosube = 'gal'
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 250,
          targetHeight: 324,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        }
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        // LLENAMOS AL OBJETO CON UN PUSH POR CADA FOTO QUE ESCOGAMOS COMO MAXIMO 4 REGISTROS
        var coment = document.getElementById(idphoto);
        $scope.pictures.push(
          {
            nrosegui: idphoto,
            src: "data:image/jpeg;base64," + imageData,
            tipofoto: tifotosube,
            comentario: coment.value
          }
        );
        coment.value = '';
        //var image = document.getElementById('tempImage');
        //         image.src = imageData;  
        $scope.imgURI = "data:image/jpeg;base64," + imageData;

        server = "http://peruvending.com/naturale/adm/uploader2.php";
        filePath = "data:image/jpeg;base64," + imageData;
        walidarFoto = '1';

      }, function (error) {

      });
    };

    // FUNCION PARA SUBIR FOTO
    $scope.send = function () {

      if (walidarFoto == '1') {
        walidarFoto = '0';
      } else {
        $scope.AlertMessage('Error', 'No ha relizado ninguna una toma de fotos.')
        return;
      };
      //   if (comentfoto.value=='') {
      //    alert('Ingresar un comentario a la foto.')
      //  return;
      //}
      $ionicLoading.show({
        template: 'Subiendo Foto. . ',
      })

      var count = 0;
      for (var i = 0; i < $scope.pictures.length; i++) {

        var options = {
          fileKey: "file",
          fileName: idphoto + '_' + i + '.jpg',
          chunkedMode: false,
          mimeType: "image/jpg"
        };
        var filePathR = $scope.pictures[i].src;

        $cordovaFileTransfer.upload(server, filePathR, options).then(function (result) {

          count += 1;

          if (count == $scope.pictures.length) {
            $ionicLoading.hide();
            $scope.AddMultiFoto();
          };
        }, function (err) {
          $ionicLoading.hide();
          alert('Ocurrio un error con la conexion !')
          //alert(JSON.stringify(err));
        }, function (progress) {
          // constant progress updates
        });

      }

    }

    $scope.deleteFoto = function (item) {

      var index = $scope.pictures.indexOf(item);
      $scope.pictures.splice(index, 1);


    }
    $scope.AddMultiFoto = function () {

      $ionicLoading.show({
        template: 'Guardando Información. . ',
      })
      var count = 0;
      for (var i = 0; i < $scope.pictures.length; i++) {

        var params = {
          idSeguimiento: $scope.pictures[i].nrosegui,
          nomFoto: $scope.pictures[i].nrosegui + '_' + i + '.jpg',
          comentario: $scope.pictures[i].comentario,
          tipFoto: $scope.pictures[i].tipofoto,
          usuario: usunick
        }

        $http({
          url: urlNaturale + 'NewAddMultiFotoss',
          method: 'GET',
          params: params
        }).success(function (data) {

          count += 1;
          if (count == $scope.pictures.length) {
            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Proceso de fotos generada correctamente . . ',
              duration: 1000

            })
            var limpiar = [];
            Chats.llenarRutas(limpiar);
            location.href = "#/tab/rutas";

          };
        }).error(function () {
          $ionicLoading.hide();
          alert('Ocurrio un problema con la conexion, vuelva a intentar.')
          return;
        });

      }

    }


  })


  .controller('RutasCtrl', function ($scope, $http, $timeout, $ionicLoading, Chats, $location, $ionicModal, $ionicPopup, $cordovaGeolocation) {

    $scope.saveItem = function(item){
      localStorage.setItem('dataRuta',JSON.stringify(item))
    }
    $scope.paramsCheck = {
      check1: true,
      check2: false
    }
    $scope.changeCheck = function (value) {
      if (value == 1) {
        $scope.paramsCheck.check1 = true;
        $scope.paramsCheck.check2 = false;
      } else {
        $scope.paramsCheck.check1 = false;
        $scope.paramsCheck.check2 = true;
      }
    }
    $scope.paramsSearchRuc = {
      ruc: ''
    }
    $scope.ListaRutasRc2 = function () {
      $scope.loadingDis = ''
      $http({
        url: urlNaturale + 'ListaRutaPorRuc',
        method: 'GET',
        params: $scope.paramsSearchRuc
      }).success(function (data) {
        $scope.canales2 = [];
        console.log(data)
        data.forEach(item => {
          $scope.canales2.
            push({
              id: 1,
              idTienda: item.I_local,
              nomTienda: item.LOCAL,
              direccion: item.direccion,
              count: '1',
              fecha: item.fechaSupe,
              ruc: item.ruc
            })
        });

        $scope.loadingDis = 'none';
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        return;
      });
    }
    $ionicLoading.hide();
    $scope.usuariologer = usuario;

    var loading = document.getElementById('divCargandoRutas');

    $scope.fechaini = fecha1;
    $scope.listCuadrante = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // MODAL PARA ACTUALIZAR AL CLIENTE
    var alertPop = function (title, template, css, $scope) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template,
        cssClass: css,
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Generar</b>',
            type: 'button-positive',
            onTap: function (e) {
              return 'success'
            }
          }
        ]
      });
      return alertPopup;
    }
    var paramsAct = {
      idLocal: 0,
      Gps: '',
      Cuadrante: ''
    }
    $scope.openModalActualizar = function (item) {
      var cabecera, template;

      cabecera = "Actualizar Informacion";
      template = '<div class="modalStyle">' +
        '<div class="card-panel grey lighten-5 z-depth-1 cardP" id="item{{item}}" ng-repeat="item in listCuadrante" ng-click="selectCuadrante(item)">' +
        '<div class="row valign-wrapper contentPlantilla">' +
        '<div class="col"><span class="black-text">{{item}}</span>' +
        '</div></div></div></div>';
      var alertPopAux = alertPop(cabecera, template, '', $scope);
      paramsAct.idLocal = item.idTienda;
      alertPopAux.then(function (res) {

        if (res != 'success') {
          return;
        }
        $ionicLoading.show({
          template: 'Actualizando Informacion . . ',
        })
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var latLong = position.coords.latitude + '/' + position.coords.longitude;
            paramsAct.Gps = latLong;
            $http({
              url: urlNaturale + 'ActualizarGpsCuadranteLocales',
              method: 'GET',
              params: paramsAct
            }).success(function (data) {
              $ionicLoading.show({
                template: 'Proceso Realizado Correctamente . . ',
                duration: 2000
              })
            }).error(function () {
              $ionicLoading.hide();
              alert('Ocurrio un problema con la conexion, vuelva a intentar.')
              return;
            });
          }, function (err) {
            $ionicLoading.hide();
            alert('Ocurrio un problema con la conexion, vuelva a intentar.')

            // error
          });

      })
    }

    var getUsuariosAuto = function () {
      $http({
        url: urlNaturale + 'ListaUsuariosAUTO',
        method: 'GET'
      }).success(function (data) {
        $scope.listUsuariosAuto = data;
        console.log(data)
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        return;
      });
    }
    // Inicializamos
    getUsuariosAuto();
    //
    var paramsTransferir = {
      nro_seguimiento: '228382',
      co_usua_supe: 'RV2'
    }
    var executeTrans = function () {

      $http({
        url: urlNaturale + 'TransferirRuta',
        method: 'GET',
        params: paramsTransferir
      }).success(function (data) {
        $ionicLoading.show({
          template: 'Proceso Realizado Correctamente . . ',
          duration: 2000
        })
        paramsTransferir.co_usua_supe = '';
        $timeout(function () {

          $scope.ListaRutasRc(0);
        }, 1500)
      }).error(function () {
        $ionicLoading.hide();
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        return;
      });
    }
    $scope.openModalTransferir = function (item) {
      paramsTransferir.nro_seguimiento = String(item.id);
      var cabecera, template;

      cabecera = "Transferir Ruta";
      template = '<div class="modalStyle">' +
        '<div class="card-panel grey lighten-5 z-depth-1 cardP" id="item{{item.co_usua}}" ng-repeat="item in listUsuariosAuto" ng-click="selecUsuarios(item)">' +
        '<div class="row valign-wrapper contentPlantilla">' +
        '<div class="col"><span class="black-text">{{item.co_usua}}</span>' +
        '</div></div></div></div>';
      var alertPopAux = alertPop(cabecera, template, '', $scope);
      paramsAct.idLocal = item.idTienda;
      alertPopAux.then(function (res) {

        if (res != 'success') {
          return;
        };
        if (paramsTransferir.co_usua_supe == '') {
          $ionicLoading.show({
            template: 'Seleccionar un usuario . . ',
            duration: 2000
          });
          return;
        }
        console.log(paramsTransferir)

        $ionicLoading.show({
          template: 'Transfiriendo Ruta . . ',
        });
        executeTrans();
      })
    }
    $scope.selectCuadrante = function (item) {
      paramsAct.Cuadrante = item;
      for (var i = 0; i < $scope.listCuadrante.length; i++) {
        var element = document.getElementById('item' + $scope.listCuadrante[i]);
        element.classList.remove("cardP2");
      }
      var id = 'item' + item;
      var item = document.getElementById(id);

      item.classList.add("cardP2");
    }
    $scope.selecUsuarios = function (item) {
      paramsTransferir.co_usua_supe = item.co_usua;

      for (var i = 0; i < $scope.listUsuariosAuto.length; i++) {
        var id = 'item' + $scope.listUsuariosAuto[i].co_usua;
        var element = document.getElementById(id);
        element.classList.remove("cardP2");
      }
      var id = 'item' + item.co_usua;
      var item = document.getElementById(id);
      item.classList.add("cardP2");
    }
    //

    //$scope.chats = Chats.all();
    $scope.canales = [];

    $scope.ListaRutasRc = function (loadingcon) {
      if (loadingcon == 0) { $scope.loadingDis = '' };

      var fechaini = document.getElementById("txtfechaini")
      var fechafin = document.getElementById("txtfechafin")

      fechaini = fechaini.value.split("-").reverse().join("/");
      // Valores para traer Rutas
      var params = {
        usuario: usunick,
        fecha: fechaini,
        tomofoto: 'NO'
      }

      params = { usuario: "SV4", fecha: "04/01/2019", tomofoto: "SI" }
      console.log(params)
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaRutas',
        method: 'GET',
        params: params
      }).success(function (data) {
        console.log(data)
        $scope.canales = [];
        Chats.llenarRutas(data);
        var id = "";
        var count = 0;
        var condicion = -1;
        for (var i = 0; i < data.length; i++) {

          // VARIABLE QUE HARA EL CONTEO EN CADA RECORRIDO
          count += 1;
          // CONDICION PARA QUE SOLO LLENE CON UN PUSH LOS DATOS QUE NO SE REPITEN.
          // ALGORITMO PARA HACER UN DISTINC PRACTICAMENTE .
          if (data[i].idTienda != id) {
            condicion += 1;
            $scope.canales.
              push({
                id: data[i].id,
                idTienda: data[i].idTienda,
                nomTienda: data[i].nomTienda,
                direccion: data[i].direccion,
                count: '1',
                fecha: data[i].fechaSupe,
                ruc: data[i].ruc
              })
            id = data[i].idTienda;
          } else {
            $scope.canales[condicion].count = count;
          };
          //
        }

        if (data.length == 0) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'No tiene rutas pendientes  . . ',
            duration: 1000

          })

          $scope.canales = null;

          if (loadingcon == 0) { $scope.loadingDis = 'none'; };
          return;
        }

        if (loadingcon == 0) { $scope.loadingDis = 'none'; };
        $ionicLoading.hide();
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        if (loadingcon == 0) { $scope.loadingDis = 'none'; };
      }).finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
        $scope.loadingDis = 'none';
      });
    }

    var dataTem = Chats.allRutas();

    if (dataTem.length != 0) {
      var id = "";
      var count = 0;
      var condicion = -1;
      for (var i = 0; i < dataTem.length; i++) {

        // VARIABLE QUE HARA EL CONTEO EN CADA RECORRIDO
        count += 1;
        // CONDICION PARA QUE SOLO LLENE CON UN PUSH LOS DATOS QUE NO SE REPITEN.
        // ALGORITMO PARA HACER UN DISTINC PRACTICAMENTE .
        if (dataTem[i].idTienda != id) {
          condicion += 1;
          $scope.canales.
            push({
              id: dataTem[i].id,
              idTienda: dataTem[i].idTienda,
              nomTienda: dataTem[i].nomTienda,
              direccion: dataTem[i].direccion,
              count: '1',
              fecha: dataTem[i].fechaSupe,
              ruc: dataTem[i].ruc
            })
          id = dataTem[i].idTienda;
        } else {
          $scope.canales[condicion].count = count;
        };
        //
      }
      $scope.loadingDis = 'none';
      return;

    };
    setTimeout(function () { $scope.ListaRutasRc(0) }, 1000);


    // FUNCION LISTAR DIRECCIONES
  })
  .controller('CerrarSesion', function ($scope, $ionicLoading, $timeout, Chats) {

    function callAtTimeout() {
      location.href = "#/login";
    }
    $scope.close = function () {
      var data = [];
      Chats.llenarRutas(data);

      $ionicLoading.show({
        template: 'Cerrando sesión . . ',
        duration: 2000

      })
      $timeout(callAtTimeout, 2000);
    };


  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, $http, Chats) {

    //alert('Entro lista tiendas')

    var parameters = $stateParams.rutaId
    parameters = parameters.split('|');
    $scope.tiendas = Chats.allRutas();

    $scope.search = function (item) {

      if (parameters[1] == item.idTienda) {

        return true

      } else {
        return false;
      };


    }

  })

  .controller('AccountCtrl', function ($scope, Chats, $http) {
    $scope.config = Chats.all();

    $scope.settings = {
      enableFriends: true
    };
    var fechaDesde = document.getElementById("txtDesdeRecord");
    var fechaHasta = document.getElementById("txtHastaRecord");
    var loader = document.getElementById('divCargandoRecord');
    //

    fechaDesde.value = getDateHoy();
    fechaHasta.value = getDateHoy();

    $scope.fechaNow = getDateNow();

    $scope.listaRecordUsuarios = function () {
      loader.style.display = '';

      var params = {
        usuario: usunick,
        fechaini: fechaDesde.value,
        fechafin: fechaHasta.value
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaRecordUsuariosR',
        method: 'GET',
        params: params
      }).success(function (data) {
        $scope.ListaReport = data;

        loader.style.display = 'none';
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')

        loader.style.display = 'none';
      });

    }


    $scope.listaRecordUsuarios();


  })

  .controller('loginCtrl', function ($scope, $http, $ionicLoading, $location, Chats, $firebaseArray, $firebaseObject) {


    var ref = new Firebase('https://appchatalvarez.firebaseio.com/');

    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.nroserie = 0;
    ref.on("value", function (snapshot) {
      configSerie = snapshot.val();
      $scope.nroserie = configSerie.alerta.value;


    }, function (errorObject) {
      $scope.nroserie = 1;
    });

    $scope.listCanSwipe = true
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    hoy = yyyy + '-' + mm + '-' + dd;

    var usu, pass;

    // FUNCION INICIO DE SESION
    $scope.InicioSesion = function () {

      if ($scope.nroserie != 1) {
        alert('Ocurrio un problema con la conexion, Consulte al administrador de Sistema .');
        return;
      };
      // LOADING CARGANDO . . . INICIA
      condicion = '1';
      $ionicLoading.show({
        template: 'Iniciando Sesión. .'
      });
      // Capturamos las wariables de usuario y password
      usu = document.getElementById('txtusu');
      pass = document.getElementById('txtpass');

      //

      // Damos walores a los parametros para realizar nuestra llamada ajax POST

      var params = {
        usuario: usu.value,
        pass: pass.value
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'InicioSesion',
        method: 'GET',
        params: params
      }).success(function (data) {


        if (data == '"error"') {
          alert('Usuario y/o Password Incorrectos .');
          $ionicLoading.hide();
          return;
        }
        else {

          if (data[0].tipo == 'GERE' || data[0].tipo == 'GEZO') {
            usuario = data[0].nombres;
            usunick = data[0].usuario;            
            $ionicLoading.hide();
            location.href = "indexAdm.html#/adm/perfil/" + usuario + '&' + usunick;
          } else {
            usuario = data[0].nombres;
            usunick = data[0].usuario;
            $ionicLoading.hide();
            location.href = "#/tab/rutas";
          };
          localStorage.setItem('userData',JSON.stringify(data[0]));
        };


        // location.replace('/#/tab/fotos');
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        $ionicLoading.hide();
      });

    }


  })

  .controller("listaCtrl", function ($scope, $ionicHistory, Chats, $http, $ionicLoading, $location, $ionicActionSheet, $ionicPopup, $ionicModal) {
    $scope.usuariologer = usuario;
    var cargandoH = document.getElementById("divCargandoH");

    var fechainiL = document.getElementById("txtfechainiL");
    var fechafinL = document.getElementById("txtfechafinL");

    fechainiL.value = getDateHoy();
    fechafinL.value = getDateHoy();

    $scope.listaPedidosRealizados = function () {
      cargandoH.style.display = '';
      var fechaini, fechafin;

      fechaini = fechainiL.value
      fechafin = fechafinL.value

      // Valores para traer Rutas
      var params = {
        fechaini: fechaini,
        fechafin: fechafin,
        usuario: usunick
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaDePedidosRealizados',
        method: 'GET',
        params: params
      }).success(function (data) {
        console.log(data)
        $scope.listaHistorialPedidos = data;
        cargandoH.style.display = 'none';
      }).error(function () {
        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        cargandoH.style.display = 'none';
      })
    }



  })
  .controller("ListaDetCtrl", function ($scope, $http, $stateParams, $ionicModal, $ionicPopup, $ionicLoading) {
    var loading = document.getElementById('LoadingHistorial');
    $scope.titleRutaFoto = 'DETALLE DE PEDIDO'
    $scope.checkedTipo = true;

    var parameters = $stateParams.pedId;
    parameters = parameters.split("|");


    var contentHistorialVenta = document.getElementById('contentVentaHis')
    if (parameters[3] == 'si') {
      contentHistorialVenta.style.display = '';
    } else {
      contentHistorialVenta.style.display = 'none';
    };
    if (parameters[6] == "F") {
      $scope.checkedTipo = false;
    } else {
      $scope.checkedTipo = true;
    };
    $scope.getTipoDoc = function (tip) {
      if (tip == true) {

        return 'Boleta'
      } else {

        return 'Factura'
      };
    }
    // LISTADO DE BONIFICACIONES SI ES VENTA
    $scope.ListaBonificacion = function (con) {
      // SI FLAG DE VENTAS ESTA ACTIVADO , LISTAR BONIFICACIONESOFICICACIONES
      if (parameters[2] != 'si') { return; };

      var params = {
        idLocal: parameters[1]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaBeneficios',
        method: 'GET',
        params: params
      }).success(function (data) {
        $scope.beneficios = data;

      })
      //

    }
    $scope.productosAgregados = [];
    $scope.calculoTotal = function () {
      var items = $scope.productosAgregados;
      if (items.length == 0) {
        return 0.0;
      } else {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
          total += parseFloat(items[i].cantidad) * parseFloat(items[i].precProducto)
        };

        return "SubTotal : " + (total * 1.18).toFixed(3) + " S/."
      };

    }
    $scope.ListaDetallePedido = function (con) {
      // SI FLAG DE FOTOS ESTA ACTIVADO , LISTAR MULTIFOTOS
      if (parameters[3] != 'si') { return; };

      var params = {
        idsupe: parameters[0],
        idcanal: parameters[1]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaDetallePedido',
        method: 'GET',
        params: params
      }).success(function (data) {

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
    $scope.agregarProducto = function () {
      $scope.productosAgregados = [];
      var items = $scope.productos;
      for (var i = 0; i < items.length; i++) {
        if (items[i].check == true) {
          $scope.productosAgregados.push(
            {
              id: items[i].id,
              desProducto: items[i].desProducto,
              precProducto: items[i].precProducto,
              check: true,
              cantidad: items[i].cantidad
            })

        };
      }
    }
    $scope.deleteProductoAgregado = function (item) {

      var index = $scope.productosAgregados.indexOf(item);
      $scope.productosAgregados.splice(index, 1);


    }
    // PARAMETROS Y FUNCIONES PARA EL MODAL DE PRODUCTOS 
    $ionicModal.fromTemplateUrl('productosHis.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.ListaProductos(0);
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    //
    $scope.openModal = function () {
      $scope.ListaProductos();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // funcion PARA LLENAR LOS PRODUCTOS
    $scope.ListaProductos = function () {
      alert('Entro')
      $scope.modal.show();
      var loader = document.getElementById('divCargandoProductosHis');
      loader.style.display = "";


      var params = {
        idCanal: parameters[1]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaProductos',
        method: 'GET',
        params: params
      }).success(function (data) {

        $scope.productos = data;

        var items = $scope.productosAgregados;

        for (var i = 0; i < items.length; i++) {
          if (items[i].check == true) {

            for (var x = 0; x < $scope.productos.length; x++) {
              if ($scope.productos[x].id == items[i].id) {
                $scope.productos[x].check = true;
                $scope.productos[x].cantidad = items[i].cantidad;

              };
            }
          };
        }

        loader.style.display = "none";
      })
      //

    }
    $scope.valuesFoto = [];
    $scope.viewPhoto = function (item) {
      $scope.valuesFoto = {
        imgURI: item.urlfoto,
        coment: item.coment,
        fecha: item.fecha,
        tipofoto: item.tipfoto
      }

    }
    $scope.ListaMultiFotos = function (con) {
      // SI FLAG DE FOTOS ESTA ACTIVADO , LISTAR MULTIFOTOS
      if (parameters[4] != 'si') { return; };

      var params = {
        id: parameters[0]
      }
      // FUNCION HTTPS PARA LOGEAR RUTAS POST . .

      $http({
        url: urlNaturale + 'ListaMultiFotos',
        method: 'GET',
        params: params
      }).success(function (data) {
        $scope.valuesFoto = {
          imgURI: data[0].urlfoto,
          coment: data[0].coment,
          fecha: data[0].fecha,
          tipofoto: data[0].tipfoto
        }
        $scope.pictures = data;

        loading.style.display = 'none';
      })
      //

    }

    // FUNCION PARA REGISTRAR EL PEDIDO
    $scope.AddDetPedido = function (idPed) {


      for (var i = 0; i < $scope.productosAgregados.length; i++) {

        var params = {
          idProducto: $scope.productosAgregados[i].id,
          cantidad: $scope.productosAgregados[i].cantidad,
          precUnit: $scope.productosAgregados[i].precProducto,
          idPedido: parameters[5]
        }
        var x = 0;


        $http({
          url: urlNaturale + 'SaveDetPedido',
          method: 'GET',
          params: params
        }).success(function (data) {
          x += 1;

          if (x == $scope.productosAgregados.length) {

            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Pedido Actualizado Correctamente . . ',
              duration: 1000


            })
            //BLOQUEAMOS LOS BOTONES PARA NO GENERAR NUEVAMENTE UN PEDIDO
          };

        }).error(function () {
          $ionicLoading.hide();
          alert('Ocurrio un problema con la conexion, vuelva a intentar.')
          return;
        });

      }


    }
    // FUNCION PARA ELIMINAR DETALLE PEDIDO
    $scope.DeleteDetailsPedido = function () {
      $ionicLoading.show({
        template: 'Actualizando Pedido. . ',
      })

      var params = {
        idPedido: parameters[5]
      }

      $http({
        url: urlNaturale + 'DeleteDetallePedido',
        method: 'GET',
        params: params
      }).success(function (data) {

        $scope.AddDetPedido();

      }).error(function () {

        alert('Ocurrio un problema con la conexion, vuelva a intentar.')
        return;
      });


    }

    // SCOPE PARA CAMTURAR EL TIPO DE DOCUMENTO
    $scope.MessageConfirm = function (message) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmación',
        template: '<p style="font:menu; font-size:11px;">' + message + '</p>'
      });

      confirmPopup.then(function (res) {
        if (res) {          
          $scope.DeleteDetailsPedido();
        } else {
          return false
        }
      });
    };
    $scope.PopAddCabConfirm = function () {
      // VALIDAMOS SI TIENE SELECCIONAR UN ITEM O MAS .
      if ($scope.productosAgregados.length == 0) {
        $scope.AlertMessage('Error', 'No ha seleccionado ningun producto para generar un pedido.')
        return;
      };
      // ABRIMOS POPUP PARA CONFIRMA EL PEDIDO
      $scope.MessageConfirm('Esta por actualizar este pedido , desea confirmar ?')

    }


  });

