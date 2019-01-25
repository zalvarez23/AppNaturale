angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var rutasNature=[];
  var historialNature;
  var config = [
    { text: "Activar Galeria", checked: false },
  
  ];
  

  return{
    // FIN DE SERWICIOS
 // SERVICIOS PARA LA LISTA RUTAS -  - - - -- - - - - - - - - - - - - - - - - - - - - - - - 
    
    //Llenado de Array a valor Rutas 
    llenarRutas: function(array){
      rutasNature=array;
      
      },
     // TRAER EL ARRAY DE RUTAS
     allRutas: function(){
      return rutasNature;
     },
     // FILTRAR POR ID O NOMBRE LA LISTA RUTAS
       getRutas: function(cod) {
    
      for (var i = 0; i < rutasNature.length; i++) {
   
        if (rutasNature[i].no_cana == cod) {

          return rutasNature[i];
        }
      }
      return null;
    },

 // FIN DE SERVICIOS LISTA RUTAS

  // SERVICIOS PARA LA LISTA HISTORIAL -  - - - -- - - - - - - - - - - - - - - - - - - - - - - - 
    
    //Llenado de Array a valor HISTORIAL 
    llenarHisto: function(array){
      historialNature=array;

      },
     // TRAER EL ARRAY DE historial
     allHisto: function(){
  
      return historialNature;
     },
     // FILTRAR POR ID O NOMBRE LA LISTA HISTORIAL
    getHisto: function(cod) {
    
      for (var i = 0; i < historialNature.length; i++) {
   
        if (historialNature[i].no_cana == cod) {

          return historialNature[i];
        }
      }
      return null;
    },

 // FIN DE SERVICIOS LISTA HISTORIAL

 // OTROS SERVICIOS -  - - - -- - - - - - - - - - - - - - - - - - - - - - - - 

    all: function() {
      return config;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
