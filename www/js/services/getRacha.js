'use strict';

/**
 * @ngdoc service
 * @name iotutorialApp.Racha
 * @description
 * # Este servico procesa los datos y los devuelve de dos formas difrentes
 * segun se producen o bine categorizados y sumados
 */
app.factory('getRacha', function (_, NUM_JORNADAS) {

  /**
   * Api Racha, para calcular las rachas requiere dos inputs
   * resultados.push([local, rLocal, visitante, rVisitante, numeroJornada])
   * clasificacion.push[equipo, posicion]
   * return: [1,0,-1...]  o bien clasificacion
   * @type {{GetRachasCalendario: Function, GetRachasCategoria: Function}}
   */
  var RachaApi = {
    GetRachasCalendario: function (resultados) {
      return RachaApi.getResultadosCalendario(resultados);
    },
    GetRachasCategoria: function (resultados, clasificacion) {
      var rachasOrdenadas = [];
      var rachas = RachaApi.getRachasCategorizadas(resultados);

      // Ordernar las rachas segun la clasificacion actual
      for (var i = 0; i < clasificacion.length; i++) {
        var equipo = clasificacion[i];

        rachasOrdenadas[i] = {
          equipo: equipo,
          victoria: rachas[equipo][0],
          empate: rachas[equipo][2],
          derrota: rachas[equipo][1],
          ultimo: rachas[equipo][3],
          posicion: i + 1
        };
        //rachas_ordernadas[i]= [rachas[equipo][0],rachas[equipo][1],rachas[equipo][2] ];
      }
      console.log(rachasOrdenadas);

      //print rachas
//    for ( i=0; i< clasificacion.length; i++){
//        var equipo2 = clasificacion[i];
//        console.log(equipo2+";"+rachas_ordernadas[equipo2][0]+";"+rachas_ordernadas[equipo2][1]+";"+rachas_ordernadas[equipo2][2]+";");
//    }
      return rachasOrdenadas;
    }
  };

  /**
   *  Obtiene un lista con de lo equipos de la liga.
   * @param resultados
   * @returns {{equipos: Array, jornadas: Array}}
   */
  RachaApi.getListaEquiposJornadas = function (resultados) {
    var equipos = [];
    var jornadas = [];

    for (var index = 0; index < resultados.length; ++index) {
      equipos[index] = resultados [index][0];
      jornadas.push(resultados[index][4]);
    }

    equipos = _.uniq(equipos);
    jornadas = _.uniq(jornadas);

    return {equipos: equipos, jornadas: jornadas};

  };


  /**
   * Matriz de resultados en el orden en que se producen segun el calendario de la liga
   * Los resultados estan normalizados a 1, 0, -1
   * ['depor'] = '1,1,1,1,-0-.1]
   * @param resultados ggg
   * @returns {{}} fffff
   */
  RachaApi.getResultadosCalendario = function (resultados) {

    /**
     * Esta funcion unifica los resultados en 1, 0 -1 [vic,empate,derrota]
     * devuelve un 'x' si el partido no se ha jugado
     * @param num es el resultdo que se quiere convertir
     * @returns {*}
     */
    function parseResultado(num) {
      if (num > 0) {
        return 1;
      }
      else if (num < 0) {
        return -1;
      }
      else if (num === 0) {
        return 0;
      } else {
        return 'x';
      }
    }

    var calendario = {};
    var equipo, jornada;


    var equipos = RachaApi.getListaEquiposJornadas(resultados).equipos;
    var jornadas = RachaApi.getListaEquiposJornadas(resultados).jornadas;


    for (var j = 0; j < equipos.length; j++) {
      equipo = equipos[j];
      var equipoResultados = [];
      for (var m = 0; m < jornadas.length; m++) {
        jornada = jornadas [m];

        for (var i = 0; i < resultados.length; i++) {
          //Casa
          if (resultados[i][0] === equipo && resultados[i][4] === jornada) {
            equipoResultados[m] = parseResultado(resultados[i][1] - resultados[i][3]);
          }
          //Fuera
          if (resultados[i][2] === equipo && resultados[i][4] === jornada) {
            equipoResultados[m] = parseResultado(resultados[i][3] - resultados[i][1]);
          }
        }
      }


      calendario[equipo] = equipoResultados;
    }

    //console.log(calendario);
    /*
     _.chain(calendario).keys().sort().map(function (key) {
     calendario_ordenado[key]=calendario[key];
     });
     */
    return calendario;

  };


  /**
   * construye las rachas en las 3 categorias diferentes (victoria, empate, derrota)
   * @param resultados
   * @returns {{}}
   */
  RachaApi.getRachasCategorizadas = function (resultados) {

    var calendario = RachaApi.getResultadosCalendario();
    //simularRachas(calendario);


    var equipos = RachaApi.getListaEquiposJornadas(resultados).equipos;


    var rachas = {};
    var victorias = 0;
    var empates = 0;
    var derrotas = 0;


    for (var i = 0; i < equipos.length; i++) {

      var equipo = equipos [i];
      var slotVictorias = [];
      var slotDerrotas = [];
      var slotEmpates = [];
      // Toma como referecia la 'X', para deducir cual ha sido la ultima jornada
      var ULTIMA_JORNADA_JUGADA = _.indexOf(calendario[equipos[0]], 'x') - 1;

      var ultimoResultado = calendario[equipo][ULTIMA_JORNADA_JUGADA];
      for (var j = 1; j <= NUM_JORNADAS; j++) {

        if (calendario[equipo][j] === 1) {
          if (calendario[equipo][j] === calendario[equipo][j + 1]) {
            victorias++;
          } else {
            if (victorias !== 0) {
              slotVictorias.push(++victorias);
              victorias = 0;
            } else {
              slotVictorias.push(1);
            }
          }
        }

        if (calendario[equipo][j] === -1) {
          if (calendario[equipo][j] === calendario[equipo][j + 1]) {
            derrotas++;
          } else {
            if (derrotas !== 0) {
              slotDerrotas.push(++derrotas);
              derrotas = 0;
            } else {
              slotDerrotas.push(1);
            }
          }
        }

        if (calendario[equipo][j] === 0) {
          if (calendario[equipo][j] === calendario[equipo][j - 1]) {
            empates++;
          } else {
            if (empates !== 0) {
              slotEmpates.push(++empates);
              empates = 0;
            } else {
              slotEmpates.push(1);
            }
          }
        }

//      slotVictorias= _.sortBy(slotVictorias, function (name) {  return name;}).reverse();
//      slotEmpates=   _.sortBy(slotEmpates, function (name)   {  return name;}).reverse();
//      slotDerrotas=  _.sortBy(slotDerrotas, function (name) {  return name;}).reverse();

      }
      rachas[equipo] = [slotVictorias, slotDerrotas, slotEmpates, ultimoResultado];
    }

    return rachas;

  };

  return RachaApi;
});
