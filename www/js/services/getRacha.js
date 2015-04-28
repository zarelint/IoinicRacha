'use strict';

/**
 * @ngdoc service
 * @name iotutorialApp.getRacha
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

        GetPrediccion: function (resultados, clasificacion, jorEstimada) {
            jorEstimada = jorEstimada - 1; // Array resultados empieza jornada en la posicion cero.
            var equipo, prediccion = {};
            var Avg = {};

            //Todo desacoplar resultado y parametrizala por jonadas esto es temporal
            var resultadosFiltradosJornada = [];
            _.map(resultados, function (arra) {
                if (arra[4] <= jorEstimada) {
                    resultadosFiltradosJornada.push(arra);
                }
            }, jorEstimada);

            var rachas = RachaApi.getRachasCategorizadas(resultadosFiltradosJornada);
            var resultbyCal = RachaApi.getResultadosCalendario(resultadosFiltradosJornada);

            var  calmedia =function calmedia(arr){
                var sum= 0, mem=0;
                if (arr.length!==0) {
                    for (var i = 0; i < arr.length; i++) {
                        sum = sum + arr[i];
                    }
                    mem=sum/arr.length;
                }
                return mem;
            };

            for (var i = 0; i < clasificacion.length; i++) {
                equipo = clasificacion[i][1];

                //calcula los promedios que tienes hasta la jornada estimada
                Avg[equipo]= {calendario:  {
                    victoria:calmedia(rachas.calendario[equipo][0]),
                    empate:  calmedia(rachas.calendario[equipo][2]),
                    derrota: calmedia(rachas.calendario[equipo][1]),
                    ultimo: rachas.calendario[equipo][3],
                    posicion: i + 1
                }};
                //calcula los promedios que tienes hasta la jornada estimada
                _.extend(Avg[equipo], {casa:  {
                    victoria:  calmedia(rachas.casa[equipo][0]),
                    empate:  calmedia(rachas.casa[equipo][2]),
                    derrota:  calmedia(rachas.casa[equipo][1]),
                    ultimo: rachas.casa[equipo][3],
                    posicion: i + 1
                }});
                //calcula los promedios que tienes hasta la jornada estimada
                _.extend(Avg[equipo], {fuera:  {
                    victoria:  calmedia(rachas.fuera[equipo][0]),
                    empate: calmedia(rachas.fuera[equipo][2]),
                    derrota: calmedia(rachas.fuera[equipo][1]),
                    ultimo: rachas.fuera[equipo][3],
                    posicion: i + 1
                }});

                 var media,rachasGanados,rachasPerdidos,rachasEmpatados;
                 var corte = 0.5;
                // calcula predicciones para la jornada estimada basandose en los promedios
                 //console.log(equipo);
                // Analizo la racha de victtoria, si vuelviese a ganar
                if (resultbyCal.calendario[equipo][jorEstimada - 1] === 1) { // En la anterior jornada gano


                    if (resultbyCal.donde[equipo][jorEstimada - 1] === 'casa' ) { // anterior jorn jugaba en casa
                        // asumo que esta jugaria fuera en esta -no siempre es verdad (corregir)
                        media = Math.round(Avg[equipo].fuera.victoria);
                        rachasGanados = rachas.fuera[equipo][0];
                    }else{
                        media = Math.round(Avg[equipo].casa.victoria);
                        rachasGanados = rachas.casa[equipo][0];
                    }
                    if (rachasGanados.length ===0){ // es la primera vez que pierde
                        rachasGanados=[1]; // simulo una racha de 1 aunque seria de cero
                    }
                    //si volviese a ganar
                    //rachas=2,2,5
                    // sacar el ultimo valor de la racha victorias = 5 y sumo otra mas +1 => su media
                    // si esta por encima  de su media de victorias, pues es mas chungo que vuelva a pasar
                    if (rachasGanados[rachasGanados.length-1] + 1 > media + corte) {
                        prediccion[equipo] = [-1, 0];
                        // prediccion seria de que no vuelve a ganar otra vez
                    }
                    else if (rachasGanados[rachasGanados.length-1] + 1 <= media + corte && rachasGanados[rachasGanados.length-1] + 1 > media - corte
                    ) {
                        // Se mantiene la racha = victoria
                        prediccion[equipo] = [1];
                    }// si estoy por debajo de su media de victorias puede ser no sea un racha sino un victoria puntal/acidental
                    // esto implica que no podemos predecir basado en rachas
                    else  {
                        // no hay prediccion 1x2, excluir de la predeccion
                        prediccion[equipo] = ['x'];
                    }
                }
                // Analizo la racha de derrota
                if (resultbyCal.calendario[equipo][jorEstimada - 1] === -1) { // En la anterior jornada gano

                    if (resultbyCal.donde[equipo][jorEstimada - 1] === 'casa' ) { // anterior jorn jugaba en casa
                        // asumo que esta jugaria fuero -no siempre es verdad (corregir)
                        media = Math.round(Avg[equipo].fuera.derrota);
                        rachasPerdidos = rachas.fuera[equipo][1];
                    }else{
                        media = Math.round(Avg[equipo].casa.derrota);
                        rachasPerdidos = rachas.casa[equipo][1];
                    }
                    if (rachasPerdidos.length ===0){ // es la primera vez que pierde
                        rachasPerdidos=[1]; // simulo una racha de 1 aunque seria de cero
                    }
                    //si volviese a ganar
                    //rachas[equipo][0]=2,2,5
                    // sacar el ultimo valor de la racha victorias = 5 y sumo otra mas +1 => su media
                    // si esta por encima  de su media de victorias, pues chungo que pase
                    if (rachasPerdidos[rachasPerdidos.length-1] + 1 > media + corte) {
                        prediccion[equipo] = [1, 0];
                        // prediccion seria de que no vuelve a ganar otra vez
                    }
                    else if (rachasPerdidos[rachasPerdidos.length-1] + 1 <= media + corte  && rachasPerdidos[rachasPerdidos.length-1] + 1 > media - corte) {
                        // Se mantiene la racha = victoria
                        prediccion[equipo] = [-1];
                    }// si estoy por debajo de su media de victorias puede ser no sea un racha sino un victoria puntal/acidental
                    // esto implica que no podemos predecir basado en rachas
                    else {
                        // no hay prediccion 1x2, excluir de la predeccion
                        prediccion[equipo] = ['x'];
                    }
                }
                // Analizo la racha de Empate
                if (resultbyCal.calendario[equipo][jorEstimada - 1] === 0) { // En la anterior jornada gano
                    if (resultbyCal.donde[equipo][jorEstimada - 1] === 'casa' ) { // anterior jorn jugaba en casa
                        // asumo que esta jugaria fuero -no siempre es verdad (corregir)
                        media = Math.round(Avg[equipo].fuera.empate);
                        rachasEmpatados = rachas.fuera[equipo][2];
                    }else{
                        media = Math.round(Avg[equipo].casa.empate);
                        rachasEmpatados = rachas.casa[equipo][2];
                    }
                    if (rachasEmpatados.length ===0){ // es la primera vez que pierde
                        rachasEmpatados=[1]; // simulo una racha de 1 aunque seria de cero
                    }
                    //si volviese a ganar
                    //rachas[equipo][0]=2,2,5
                    // sacar el ultimo valor de la racha victorias = 5 y sumo otra mas +1 => su media
                    // si esta por encima  de su media de victorias, pues es mas chungo que pase
                    if (rachasEmpatados[rachasEmpatados.length-1]+ 1 > media + corte) {
                        prediccion[equipo] = [-1, 1];
                        // prediccion seria de que no vuelve a ganar otra vez
                    }
                    else if (rachasEmpatados[rachasEmpatados.length-1] + 1 <= media + corte && rachasEmpatados[rachasEmpatados.length-1] + 1 > media - corte ) {
                        // Se mantiene la racha = victoria
                        prediccion[equipo] = [0];
                    }// si estoy por debajo de su media de victorias puede ser no sea un racha sino un victoria puntal/acidental
                    // esto implica que no podemos predecir basado en rachas
                    else  {
                        // no hay prediccion 1x2, excluir de la predeccion
                        prediccion[equipo] = ['x'];
                    }
                }
            }
            return prediccion;
        },

        GetRachasCategoria: function (resultados, clasificacion) {
            var rachasOrdenadas = [];
            var rachas = RachaApi.getRachasCategorizadas(resultados);

            // Ordernar las rachas segun la clasificacion actual
            for (var i = 0; i < clasificacion.length; i++) {
                var equipo = clasificacion[i][1];

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
     * calendario['depor'] = ['1,1,1,1,-0-.1]
     * casa['depor'] = ['1,1,1,1,-0-.1]
     * fuera
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

        function parseGoles(gol) {
            // partido no juegado se contabiliza sin goles
            if (isNaN(gol)) {
                gol = 0;
            }
            return gol;
        }


        var equipo, jornada;
        var casa = {};
        var fuera = {};
        var calendario = {};
        var marcadosCasa = {};
        var marcadosFuera = {};
        var encajadosCasa = {};
        var encajadosFuera = {};
        var donde ={};
        var equipos = RachaApi.getListaEquiposJornadas(resultados).equipos;
        var jornadas = RachaApi.getListaEquiposJornadas(resultados).jornadas;


        for (var j = 0; j < equipos.length; j++) {
            equipo = equipos[j];
            //clear arrays para cada equipo
            var equipoResultados = [];
            var resultadosCasa = [];
            var resultadosFuera = [];
            var golesMarcadosCasa = [];
            var golesEncajadosCasa = [];
            var golesMarcadosFuera = [];
            var golesEncajadosFuera = [];
            var resultadosDonde = [];

            for (var m = 0; m < jornadas.length; m++) {
                jornada = jornadas [m];
                for (var i = 0; i < resultados.length; i++) {
                    //Casa
                    if (resultados[i][0] === equipo && resultados[i][4] === jornada) {
                        equipoResultados[m] = parseResultado(resultados[i][1] - resultados[i][3]);
                        resultadosCasa.push(parseResultado(resultados[i][1] - resultados[i][3]));
                        golesEncajadosCasa.push(parseGoles(resultados[i][3]));
                        golesMarcadosCasa.push(parseGoles(resultados[i][1]));
                        resultadosDonde.push('casa');
                    }
                    //Fuera
                    if (resultados[i][2] === equipo && resultados[i][4] === jornada) {
                        equipoResultados[m] = parseResultado(resultados[i][3] - resultados[i][1]);
                        resultadosFuera.push(parseResultado(resultados[i][3] - resultados[i][1]));
                        golesEncajadosFuera.push(parseGoles(resultados[i][1]));
                        golesMarcadosFuera.push(parseGoles(resultados[i][3]));
                        resultadosDonde.push('fuera');
                    }
                }
            }
            donde[equipo]= resultadosDonde;
            fuera[equipo] = resultadosFuera;
            casa[equipo] = resultadosCasa;
            calendario[equipo] = equipoResultados;
            marcadosCasa[equipo] = golesMarcadosCasa;
            marcadosFuera[equipo] = golesMarcadosFuera;
            encajadosCasa[equipo] = golesEncajadosCasa;
            encajadosFuera[equipo] = golesEncajadosFuera;

        }


        /*
         _.chain(calendario).keys().sort().map(function (key) {
         calendario_ordenado[key]=calendario[key];
         });
         */

        return {
            calendario: calendario,
            casa: casa,
            fuera: fuera,
            donde: donde,
            marcadosCasa: marcadosCasa,
            marcadosFuera: marcadosFuera,
            encajadosCasa: encajadosCasa,
            encajadosFuera: encajadosFuera

        };

    };


    /**
     * construye las rachas en las 3 categorias diferentes (victoria, empate, derrota)
     * @param resultados
     * @returns {{}}
     */
    RachaApi.getRachasCategorizadas = function (resultados) {

        var rachas = RachaApi.getResultadosCalendario(resultados);
        var equipos = RachaApi.getListaEquiposJornadas(resultados).equipos;
        var calendario = rachas.calendario;
        var casa = rachas.casa;
        var fuera = rachas.fuera;

        var rachasOut = {};


        function getSlots(calendario) {
            var rachasOut = {};
            var victorias = 0;
            var empates = 0;
            var derrotas = 0;


            for (var i = 0; i < equipos.length; i++) {

                var equipo = equipos [i];
                var slotVictorias = [];
                var slotDerrotas = [];
                var slotEmpates = [];

                // Toma como referecia la 'X', para deducir cual ha sido la ultima jornada
                //var ULTIMA_JORNADA_JUGADA = _.indexOf(calendario[equipos[0]], 'x') - 1;
                var ULTIMA_JORNADA_JUGADA = _.size(_.toArray(calendario)[0]) - 1;
                var ultimoResultado = calendario[equipo][ULTIMA_JORNADA_JUGADA];


                for (var j = 0; j <= NUM_JORNADAS; j++) {
                    //slot victorias
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

                //slotVictorias= _.sortBy(slotVictorias, function (name) {  return name;}).reverse();
                //slotEmpates=   _.sortBy(slotEmpates, function (name)   {  return name;}).reverse();
                //slotDerrotas=  _.sortBy(slotDerrotas, function (name) {  return name;}).reverse();

                }

                rachasOut[equipo] = [slotVictorias, slotDerrotas, slotEmpates, ultimoResultado];
                //console.log(rachasOut[equipo]);
            }

            return rachasOut;
        }



        _.extend(rachasOut, {calendario: getSlots(calendario)});
        _.extend(rachasOut, {casa: getSlots(casa)});
        _.extend(rachasOut, {fuera: getSlots( fuera)});

        return rachasOut;
    };

    return RachaApi;
});
