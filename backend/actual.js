

module.exports = function temporadaActual(){


        var cheerio = require('cheerio'), fs = require('fs'), _ = require('underscore');
        var NUM_JORNADAS = 38;
        var lista_equipos = [], jornadas = [], clasificacion = [];
        var request = require('request'),sys = require('sys');


        var rachas_ordernadas = [];
 /*
        request({ uri:'http://www.marca.com/futbol/primera/clasificacion.html' ,  encoding: 'binary'}, function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('Error when contacting google.com');
            }
            dataLoaded2( error, body);
            // Print the google web page.
            //sys.puts(body);
        });

        request({ uri:'http://www.marca.com/futbol/primera/calendario.html',  encoding: 'binary' }, function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('Error when contacting google.com');
            }
            dataLoaded( error, body);
            // Print the google web page.
            //sys.puts(body);
        });

*/


       //statico
        var fich2 = fs.readFileSync('./calendario.html','binary');
        var fich = fs.readFileSync('./clasificacion.html','binary');

        dataLoaded2({}, fich);
        dataLoaded({}, fich2);
        // fin statico
        var modelo = {id:1, nombre:'primerabbva'};
         _.extend ( modelo, {rachas: rachas_ordernadas});
        return  modelo;


    function dataLoaded2(err, data) {

        var $ = cheerio.load(data);

        $("table#calsificacion_completa").find("tr").each(function () {
            var arrayOfThisRow = [];
            var tableData = $(this).find('.equipo');
            if (tableData.length > 0) {
                tableData.each(function () {
                    var texto = $(this).text();
                    texto = texto.replace(/Real/g, "");
                    texto = texto.replace(/(\r\n|\n|\r)/gm, "");
                    texto = texto.replace(/\s+/g, " ");
                    arrayOfThisRow.push(texto.trim());
                });
                clasificacion = arrayOfThisRow;
            }

        });
    }

function dataLoaded(err, data) {

//    if ( err !== null ){
//        console.log(err.log('error'));
//    }
    var $ = cheerio.load(data);
    var myTableArray = [];

        // array con 38 jornadas
        $('div.jornadaCalendario').each(function () {
            var arrayOfThisRow = [];

            /* hay 10 lineas en cada jornada
                <a class="final" title="Valencia vs Málaga"
                href="http://www.marca.com/eventos/marcador/futbol/2014_15/primera/jornada_2/val_mga/">
                    <span class="local">Valencia</span>
                    <span class="visitante">Málaga</span>
                    <span class="resultado">3-0</span>
                </a>
            */
            var formateado = [];
            var tableData = $(this).find('a');

            // Procesa los 10 partidos de cada jornada
            if (tableData.length > 0) {
                tableData.each(function () {

                    if (this.attribs["href"] != null) {
                        //console.log(this.attribs["href"].split("/")[8]);
                        var numero_jornada = this.attribs["href"].split("/")[8].split("_")[1];
                        // console.log(this.attribs["href"].split("/")[8]);

                        var visitante = $(this).find("span.visitante").text();
                        var local = $(this).find("span.local").text();

                        if ($(this).find("span.resultado").text().length == 3) {
                            var rVisitante = $(this).find("span.resultado").text().split("-")[1].replace(/Real/g, "");
                            var rLocal = $(this).find("span.resultado").text().split("-")[0].replace(/Real/g, "");
                        } else {
                            var rVisitante = "previa";
                            var visitante = "previa";
                        }

                        var local = $(this).find("span.local").text();

                        arrayOfThisRow.push(local);
                        arrayOfThisRow.push(rLocal);
                        arrayOfThisRow.push(visitante);
                        arrayOfThisRow.push(rVisitante);
                        arrayOfThisRow.push(numero_jornada);
                        formateado = [local, rLocal, visitante, rVisitante, numero_jornada, 'S-30/08-20:00'];
                        myTableArray.push(formateado);
                    }
                });
            }
        });



    var rachas = getRachas(getCalendario(myTableArray));

        // Ordernar las rachas segun la clasificacion actual
    for (var i=0; i< clasificacion.length; i++){
        var equipo = clasificacion[i];

        rachas_ordernadas[i]= { equipo: equipo, victoria:rachas[equipo][0],empate:rachas[equipo][2],
            derrota:rachas[equipo][1] ,ultimo:rachas[equipo][3], posicion: i+1};
        //rachas_ordernadas[i]= [rachas[equipo][0],rachas[equipo][1],rachas[equipo][2] ];
    }
    console.log(rachas_ordernadas) ;

    //print rachas
//    for ( i=0; i< clasificacion.length; i++){
//        var equipo2 = clasificacion[i];
//        console.log(equipo2+";"+rachas_ordernadas[equipo2][0]+";"+rachas_ordernadas[equipo2][1]+";"+rachas_ordernadas[equipo2][2]+";");
//    }


    return rachas_ordernadas;



}


    function simularRachas(calendario) {
        var ULTIMA_JORNADA_JUGADA = _.indexOf(calendario[lista_equipos[0]], 'x')-1;
        for (var i = 0; i < lista_equipos.length; i++) {
            var equipo = lista_equipos[i];
            calendario[equipo][ULTIMA_JORNADA_JUGADA+1]= calendario[equipo][ULTIMA_JORNADA_JUGADA]

        }
    }

function getRachas(calendario) {

    //simularRachas(calendario);


    var rachas = {};
    var victorias = 0;
    var empates = 0;
    var derrotas = 0;


    for (var i = 0; i < lista_equipos.length; i++) {

        var equipo = lista_equipos [i];
        var slot_victorias = [];
        var slot_derrotas = [];
        var slot_empates = [];
        var ULTIMA_JORNADA_JUGADA = _.indexOf(calendario[lista_equipos[0]], 'x')-1;

        var ultimo_resultado = calendario[equipo][ULTIMA_JORNADA_JUGADA]
        for (var j = 1; j <= NUM_JORNADAS; j++) {

            if ( calendario[equipo][j] === 1) {
                if (calendario[equipo][j] === calendario[equipo][j + 1]){
                    victorias++;
                } else {
                    if (victorias !== 0) {
                        slot_victorias.push(++victorias);
                        victorias = 0;
                    }else{
                        slot_victorias.push(1);
                    }
                }
            }

            if (  calendario[equipo][j] === -1) {
                if (calendario[equipo][j] === calendario[equipo][j + 1]){
                    derrotas++;
                }else {
                    if (derrotas !== 0) {
                        slot_derrotas.push(++derrotas);
                        derrotas = 0;
                    }else{
                        slot_derrotas.push(1);
                    }
                }
            }

            if (  calendario[equipo][j] === 0)   {
                if ( calendario[equipo][j] === calendario[equipo][j - 1]  ) {
                    empates++;
                }else {
                    if (empates !== 0) {
                        slot_empates.push(++empates);
                        empates = 0;
                    }else{
                        slot_empates.push(1);
                    }
                }
            }


//            slot_victorias= _.sortBy(slot_victorias, function (name) {  return name;}).reverse();
//            slot_empates=   _.sortBy(slot_empates, function (name) {  return name;}).reverse();
//            slot_derrotas=  _.sortBy(slot_derrotas, function (name) {  return name;}).reverse();

        }
        rachas[equipo] = [slot_victorias, slot_derrotas, slot_empates,ultimo_resultado];
    }

    return rachas;


}


function getListaEquiposJornadas(myTableArray) {
    var lista_equipos = [];

    var jornadas = [];
    for (var index = 0; index < myTableArray.length; ++index) {
        lista_equipos[index] = myTableArray [index][0];
        jornadas.push(myTableArray[index][5]);
    }

    lista_equipos = _.uniq(lista_equipos);
    jornadas = _.uniq(jornadas);

    return { equipos: lista_equipos, jornadas: jornadas};

}

/*
 Esta funcion crea un array por equipo con los resultados convertidos por jornada a 1,0,-1
 myTableArray: lista de resultados sin convertir
 */
function getCalendario(myTableArray) {

    var calendario = {};
    var equipo, jornada;
    var equipoJornada = getListaEquiposJornadas(myTableArray);

    lista_equipos = equipoJornada.equipos;
    jornadas = equipoJornada.jornadas;

    for (var j = 0; j < lista_equipos.length; j++) {
        equipo = lista_equipos[j];
        var equipo_res = [];
        for (var m = 0; m < jornadas.length; m++) {
            jornada = jornadas [m];

            for (var i = 0; i < myTableArray.length; i++) {
                //Casa
                if (myTableArray[i][0] === equipo && myTableArray[i][5] === jornada) {
                    equipo_res[jornada] = res(myTableArray[i][1] - myTableArray[i][3]);
                }
                //Fuera
                if (myTableArray[i][2] === equipo && myTableArray[i][5] === jornada) {
                    equipo_res[jornada] = res(myTableArray[i][3] - myTableArray[i][1]);
                }
            }
        }
        calendario[equipo] = equipo_res;
    }


    //console.log(calendario);

    return calendario;

    /*
     _.chain(calendario).keys().sort().map(function (key) {
     calendario_ordenado[key]=calendario[key];
     });
     */

    /*
     Esta funcion unifica los resultados en 1, 0 -1
     num: resultado a convetir
     */
    function res(num) {
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
}

};