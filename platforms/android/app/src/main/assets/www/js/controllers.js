
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
    var generatePdf = function(dataResult){
      var data = [];
      var result = dataResult;
      
      // SEPARAMOS QR Y LISTA
      var qrImagen;
      result.forEach(function(item,index){
        if (index == 0) {
          qrImagen = item.qr;
        }else{
          data.push(item);
        }
      })
      var dataCount = data.length;
      
      var altoSize = 265;
      altoSize += (8 * dataCount)
      var doc = new jsPDF('p', 'mm', [110,altoSize]);
      console.log(data);
      // CARGAMOS EL REPORTE . . .
      var imgBase64 = 'data:image/png;base64,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';
    
    
      var imageQR = qrImagen;
    
      doc.addImage(imgBase64, 'png', 25, 5, 53, 23)
      doc.setFont('helvetica')
      doc.setFontType('bold')
      doc.setFontSize(12)
      doc.text(19, 33, 'PROCESADORA CATALINA S.A.C')
      doc.setFontType('normal')
      doc.text(32, 39, 'RUC 20506223394')	
      doc.setFontSize(11)
      doc.text(10, 45, 'Av. La Arboleda 371. Urb. Santa Raquel II Etapa')
      doc.text(39, 51, 'Ate - Lima - Lima')
      doc.text(29, 57, 'Telf. 349-6586 / 349-6566')
      doc.setFontSize(12)
      doc.setFontType('bold')
      doc.text(24, 68, 'FACTURA ELECTRÓNICA')
      doc.setFontSize(10)	
      // HORA/FECHA/DOCUMENTO
      doc.setFontType('normal')
      doc.text(9, 76, String(data[0].FECHADOC))
      doc.text(44, 76, String(data[0].HORADOC))
      doc.text(79, 76, String(data[0].NRODOC))
      //RUC / COD. VEND.
      doc.setFontType('bold')
      doc.text(9, 83, 'RUC :')
      doc.setFontType('normal')
      doc.text(23, 83, String(data[0].ruc))
      doc.setFontType('bold')
      doc.text(70, 83, 'Cod. Vend.')
      doc.setFontType('normal')
      doc.text(95, 83, String(data[0].vendedor))
    
      // SERES
      doc.setFontType('bold')
      doc.text(9, 89, 'Sres :')
        doc.setFontType('normal')
        doc.setFontSize(10)
      doc.text(23, 89, data[0].razon)
      
      // LOCAL
      var x = 0;
      var y = 0;
      y = -7;
      doc.setFontType('bold')
      doc.text(x + 9, y + 102, 'Local :')
        doc.setFontType('normal')
        doc.setFontSize(10)
      doc.text(x + 23, y + 102, String(data[0].Tienda))
      //doc.text(x + 24, y + 111, String(data[0].NO_DIST))
    
      // DETALLE CABECERA
      doc.text(x + 6, y + 109, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
      doc.text(x + 6, y + 112, 'CANT.')
      doc.text(x + 23, y + 112, 'DESCRIPCIÓN.')
      doc.text(x + 70, y + 112, 'V.U.')
      doc.text(x + 86, y + 112, 'TOTAL')
    
      doc.text(x + 6, y + 114, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
      for (var i = 0; i < 3 ; i++) {
      
      }
      doc.setFontSize(9)
      data.forEach(function(item,index){
      // DETALLE MATERIALES
        var prod = item.producto;
        doc.setFontType('bold')
        // CANTIDAD
        doc.text(x + 11, y + 119, String(item.cantidad))
        // V.U
        doc.text(x + 71, y + 119, String(item.precio))
        // TOTAL
        doc.text(x + 87, y + 119, String(item.T_VENTA))
        doc.setFontType('normal')
        
    
        // ARRAY DE NOMBRE DE PRODUCTO
        var caracMax = 22;
        var caracInit = 0;
        var caracFinal = 22;
    
        for (var i = 0; i < prod.length / caracMax; i++) {		
          doc.text(x + 23, y + 117, String(prod).substring(caracInit,caracFinal))
          caracInit += caracMax;
          caracFinal += caracMax;
          y +=3;
        }
        y += 2;
        //
      })
      doc.setFontSize(10)
      doc.text(x + 6, y + 115, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
      doc.text(x + 10, y + 118, 'Total Descuento')
      doc.text(x + 10, y + 122, 'Operación Gravada')
      doc.text(x + 10, y + 126, 'ISC:')
      doc.text(x + 10, y + 130, 'IGV (18%):')
      doc.text(x + 10, y + 134, 'Total a Pagar')
      doc.text(x + 10, y + 138, 'Operación Gratuita')
      doc.setFontSize(9)
      doc.text(x + 87, y + 118, String(data[0].TO_DESCUENTO))	
      doc.text(x + 87, y + 122, String(data[0].OP_GRABADAS))	
      doc.text(x + 87, y + 126, String(data[0].TO_ISC))
      doc.text(x + 87, y + 130, String(data[0].TO_IGV))
      doc.setFontType('bold')
      doc.text(x + 87, y + 134, String(data[0].TOTAL_PAGAR))
      doc.setFontType('normal')
      doc.text(x + 87, y + 138, String(data[0].OP_GRATUITAS))
    
      doc.setFontSize(10)
      doc.text(x + 10, y + 144, 'Forma De Pago : ')
      doc.setFontType('bold')
      doc.setFontSize(9)
      doc.text(x + 40, y + 144, 'EFECTIVO')
      doc.setFontType('normal')
      doc.setFontSize(8)
      doc.text(x + 13, y + 148, 'Son: ')
      doc.setFontType('bold')
      doc.text(x + 23, y + 148, data[0].LETRAS)
      doc.setFontType('normal')
      doc.text(x + 23, y + 154, 'VENTA REALIZADA POR EMISOR ITINERANTE')
      doc.text(x + 32, y + 157, 'TRANSFERENCIA GRATUITA')
      doc.setFontSize(10)
      doc.text(x + 6, y + 159, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
      
    
      doc.addImage(imageQR, 'png', 29, y + 164, 50, 50)
      doc.setFontSize(13)
      doc.text(x + 22, y + 225, '!GRACIAS POR SU COMPRA!')
      doc.setFontSize(11)
      doc.text(x + 28, y + 230, 'Autorizado mediante R.I. Nro.')
      doc.text(x + 32, y + 235, '0320050000367/SUNAT')
      doc.text(x + 19, y + 240, 'Repr. Impresa del Documento Electrónico')
      doc.text(x + 22, y + 245, 'Consultar en: www.naturale.com.pe')
    
    
      //doc.output('dataurlnewwindow');
        doc.output('save', 'report.pdf');
    }

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
        $scope.listResultFinal = data;
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
    $scope.MessageConfirm2 = function (message) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirmación',
        template: '<p style="font:menu; font-size:11px;">' + message + '</p>'
      });

      confirmPopup.then(function (res) {
        if (res) {          
          GenerarComprobante()
        } else {
          return false
        }
      });
    };

    var GenerarComprobante = function () {

      $ionicLoading.show({
        template: 'Generando Comprobante . ',


      })
      var params = {
        nu_pedi: $scope.listResultFinal[0].nuPedi,
        co_usua_vend: dataUser.usuario
      }
     
      $http({
        url: urlNaturale + 'GenerarFactura',
        method: 'GET',
        params: params
      }).success(function (data) {
        $ionicLoading.show({
          template: 'Comprobante generado correctamente. . ',
          duration: 2000
        })
        console.log(data)
        generatePdf(data);

      })
      .error(function(err){
        $ionicLoading.hide();
        console.log(err)
      })
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

    $scope.PopAddCabConfirm2 = function () {
      // VALIDAMOS SI TIENE SELECCIONAR UN ITEM O MAS .
      //if ($scope.productosAgregados.length == 0) {
        //$scope.AlertMessage('Error', 'No ha seleccionado ningun producto para generar un pedido.')
        //return;
      //};
      // ABRIMOS POPUP PARA CONFIRMA EL PEDIDO
      $scope.MessageConfirm2('Esta por generar un comprobante, desea confirmar ?')

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
        usuario: dataUser.usuario,
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

