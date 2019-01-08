angular.module('starterAdm', ['ionic','ngCordova', 'starter.controllers','starter.services'])


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
.state('adm', {
    url: "/adm",
    abstract:true,
    templateUrl: "indexAdm.html"
  })

  // Each tab has its own nav history stack:

.state('adm.perfil', {
      url: '/perfil/:idperfil',
      cache: 'false',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-perfil.html',
          controller: 'ctrlListaRutas'
        }
      }
    })
.state('adm.perfil-puntuacion', {
      url: '/punt/:idpun',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-puntuperfil.html',
          controller: 'ctrlPuntu'
        }
      }
    })
.state('adm.perfil-acumPuntaje',{
      url: '/puntacumulado',
      cache: 'true',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-puntacumulado.html',
          controller:'ctrlPunAcum'
        }
      }

    })
  .state('adm.perfil-quiebre',{
      url: '/quiebre',
      cache: 'true',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-rutasquiebre.html',
          controller:'ctrlQuiebres'
        }
      }

    })
   .state('adm.perfil-mantenimiento',{
      url: '/mantenimiento',
      cache: 'true',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-mantenimientoRutas.html',
          controller:'ctrlMantenimiento'
        }
      }

    })
    .state('adm.perfil-updateruta',{
      url: '/updateruta/:iddet',
      cache: 'true',
      views: {
        'tab-perfil': {
          templateUrl: 'templatesAdm/adm-updateRuta.html',
          controller:'ctrlUpdateRuta'
        }
      }

    })
     // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('adm/perfil');

});

