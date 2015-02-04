'use strict';

module.exports = function temporadaActual2() {


    var cheerio = require('cheerio');
    var resultados = [], clasificacion = [];
    var request = require('request');
    //var sys = require('sys');

    request({
        uri: 'http://www.marca.com/futbol/primera/clasificacion.html',
        encoding: 'binary'
    }, function (error, response, body) {
        if (error && response.statusCode !== 200) {
            console.log('Error when contacting google.com');
        }
        loadClasificacion(error, body);
        // Print the google web page.
       // sys.puts(body);

    });

    request({
        uri: 'http://www.marca.com/futbol/primera/calendario.html',
        encoding: 'binary'
    }, function (error, response, body) {
        if (error && response.statusCode !== 200) {
            console.log('Error when contacting google.com');
        }
        loadCalendario(error, body);
        // Print the google web page.
        //sys.puts(body);
    });

    function loadClasificacion(err, data) {
        var $ = cheerio.load(data);
        $(data).find('table#calsificacion_completa tbody tr').each(function () {
            var posicion = this.children[0].innerText;
            var equipo = this.children[1].innerText.replace('.', '');
            clasificacion.push([posicion, equipo]);
        });
    }

    function loadCalendario(err, data) {
        console.log('dentro');
        var $ = cheerio.load(data);
        var ultimaJornada = 1;

        /**
         * Este sistema para detectar la ultima jornada disputada
         * dependen enteramente que en las joranada sin jugar lleven
         * asociado la clase 'proximaJornada'
         */
        $(data).find('div.jornadaCalendario.proximaJornada h2').each(function () {
            ultimaJornada = this.children[0].data.substr(8) - 1;
            return false;
        });

        $(data).find('div.jornadaCalendario').each(function () {

            var numeroJornada = $(this).find('div>h2').text().substr(8);
            if (numeroJornada <= ultimaJornada) {// solo leemos jornadas jugadas
                $(this).find('a').each(function () {
                    var local = $(this).find('span.local').text().replace('.', '');
                    var visitante = $(this).find('span.visitante').text().replace('.', '');
                    var rVisitante, rLocal;

                    if (this.href === '') { // Partido anulado y pendiente de jugarse
                        rVisitante = 'x';
                        rLocal = 'x';
                    } else {
                        // numeroJornada = this.href.split('/')[8].split('_')[1];
                        var resultado = $(this).find('span.resultado').text();
                        rVisitante = resultado.split('-')[1]; //.replace(/Real/g, "");
                        rLocal = resultado.split('-')[0];
                    }
                    resultados.push([local, rLocal, visitante, rVisitante, numeroJornada]);

                });
            }
        });

        /*    var rachas = getRachas(getCalendario(myTableArray));

         // Ordernar las rachas segun la clasificacion actual
         for (var i=0; i< clasificacion.length; i++){
         var equipo = clasificacion[i];

         rachas_ordernadas[i]= { equipo: equipo, victoria:rachas[equipo][0],empate:rachas[equipo][2],
         derrota:rachas[equipo][1] ,ultimo:rachas[equipo][3], posicion: i+1};
         //rachas_ordernadas[i]= [rachas[equipo][0],rachas[equipo][1],rachas[equipo][2] ];
         }*/
       // console.log(resultados);

        //print rachas
//    for ( i=0; i< clasificacion.length; i++){
//        var equipo2 = clasificacion[i];
//        console.log(equipo2+";"+rachas_ordernadas[equipo2][0]+";"+rachas_ordernadas[equipo2][1]+";"+rachas_ordernadas[equipo2][2]+";");
//    }


    }

    return  {resultados:resultados,clasificacion:clasificacion };
};