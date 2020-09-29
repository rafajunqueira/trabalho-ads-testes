// Rastreando o botao_calcular na DOM
const btnCalc = document.querySelector('#btnCalc')

// Quando botao_calcular sofrer onclick a seguinte função vai disparar:
btnCalc.onclick = () => {

  let qualVariavel //usada para aux. na geração de gráficos
  let nomeVariavel
  let inputDados

  // se tivermos o arquivo de descritiva > manual, então:
  if (window.location.pathname.includes('manual') == true) {
    // abaixo eu pego na DOM os valores no input:
    inputDados = document.querySelector('#coleta_de_dados').value
    inputDados = inputDados.split(';'); // Separando ';' dos dados

    nomeVariavel = document.querySelector('.nomeVariavel').value

  } else {
    //abaixo eu pego os dados processados pelo 'importa.js'
    inputDados = preInput
    nomeVariavel = preNomeVar
  }

  let arrayOriginal = inputDados

  let arrayOrdenado

  // Retorna tipo e ordena de acordo
  if (qualTipo(arrayOriginal) == 'string') {
    arrayOrdenado = arrayOriginal.sort() // Ordenando array string
  } else {
    arrayOrdenado = arrayOriginal.sort((a, b) => a - b) // Ordenando array com numero
  }

  // Desestruturando o retorno da função:
  [a, b, arrayFreq] = geraFreq(arrayOrdenado) //Gerando objeto com array usado

  /*   console.log('a :>> ', a);  //TRAZ OS VALORES!
    console.log('b :>> ', b); //TRAZ AS REPETIÇÕES DESTES VALORES!
  */

  /*acima o arrayFreq é array que tem array dentro e todos os 
  elementos com suas respectivas frequências, dê um console.log para ver*/

  // dadosInseridos é coluna1
  //  let objFrequencia = geraFrequencia(arrayOrdenado) //Gerando objeto com array usado
  //console.log('objFrequencia :>> ', objFrequencia);


  let dadosInseridos = a // aqui pegamos os numeros (sem repetição)

  // freqSimples é coluna2 da tabela 
  let freqSimples = b // aqui pegamos os numeros as repetições

  let totalCol2 = geraTotalCol2(freqSimples)

  let rogerCol1, rogerCol2


  //se +10 ELEMENTOS NUMERAIS forem inseridos geramos a tabelaContinua
  if ((dadosInseridos.length > 10) && (qualTipo(arrayOrdenado) == 'number')) {
    [corpoTbEscolhida, qtdLinhas, valoresCol1, valoresCol2] = tabelaContinua(arrayOrdenado, totalCol2)
    qualVariavel = 'qualiContinua' //gráfico qualiContinua a ser gerados..

    rogerCol1 = valoresCol1
    rogerCol2 = valoresCol2

    //senao se -10 ELEMENTOS NUMERAIS forem inseridos geramos a tabelaSimples
  } else if ((dadosInseridos.length < 10) && (qualTipo(arrayOrdenado) == 'number')) { /* [corpoTbEscolhida, qtdLinhas] é uma desestruturação */
    [corpoTbEscolhida, qtdLinhas] = tabelaSimples(dadosInseridos, freqSimples, totalCol2)
    qualVariavel = 'qualiDiscreta' //gráfico qualiDiscreta a ser gerados..


    //senao se ELEMENTOS TEXTO forem inseridos geramos a tabelaSimples
  } else if (qualTipo(arrayOrdenado) == 'string') {
    [corpoTbEscolhida, qtdLinhas] = tabelaSimples(dadosInseridos, freqSimples, totalCol2)
    qualVariavel = 'qualiOrdinal/Nominal' //gráfico qualiOrdinal/Nominal a ser gerados..
  }

  tabela = geraCabecalho(nomeVariavel) + corpoTbEscolhida


  // aqui adicionamos SOMENTE 1ª E 2ª COLUNA:
  const domTabela = document.querySelector('.tabelas')
  domTabela.innerHTML = tabela += '</table>' //fechando tabela


  // O RESTO DA TABELA SERÁ RESOLVIDO A PARTIR DO EXEC. FUNÇÃO:
  geraRestCol(qtdLinhas)

  // DEPOIS DO PROCESSAMENTO DE TUDO, GERAMOS OS GRÁFICOS
  geraGraf(qtdLinhas)


  let vetElemento = a
  let vetFrequencia = b

  let mediaModaMed = document.querySelector('.media-moda-med')

  mediaModaMed.innerHTML = `
  <br>
  A média é: ${acharMedia(vetElemento, vetFrequencia)}
  <br>
  A mediana é: ${acharMediana(vetElemento)}
  <br>
  A moda é: ${acharModa(vetElemento, vetFrequencia)}
  <br>
  O desvio padrão é: ${acharDP(vetElemento, vetFrequencia)}
  <br>
  O coeficiente de variação é: ${acharCV(vetElemento, vetFrequencia)}
  <br><br>
  `


  roger(rogerCol1, rogerCol2)
}


function roger(var1, var2) {
  console.log('var1 :>> ', var1);
  console.log('var2 :>> ', var2);
}


/******************** ÁREA DE FUNÇÕES: ********************/


let qualTipo = (arrayOrdenado) => {

  let verificador = arrayOrdenado[0]

  if (isNaN(parseFloat(verificador))) { // se for string
    return 'string'
  } else {
    return 'number' // se for number
  }
}


let wordCounter = {}; // contador de elementos (int ou string)

let geraFrequencia = (wordArray) => {
  // for que gera frequencia (gera objeto)
  for (let i = 0; i < wordArray.length; i++) {
    if (wordCounter[wordArray[i]]) {
      wordCounter[wordArray[i]] += 1;
    } else {
      wordCounter[wordArray[i]] = 1;
    }
  }
  let frequenciaFinal = wordCounter
  wordCounter = {}
  return frequenciaFinal
}


function geraFreq(arr) { // from jsfiddle.net/simevidas/bnACW/
  var a = [], b = [], prev

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i])
      b.push(1)
    } else {
      b[b.length - 1]++
    }
    prev = arr[i]
  }

  let arrayFreq = []

  for (let i = 0; i < a.length; i++) {
    arrayFreq.push([a[i], b[i]])
  }

  return [a, b, arrayFreq]
}


let qtdIndexEntre = (array, inicial, final) => {

  let indexNumInicial = array.findIndex(element => element >= inicial)
  let indexNumFinal = array.findIndex(element => element >= final)

  let qtdEntre = indexNumFinal - indexNumInicial

  return qtdEntre
}


function geraTotalCol2(freqSimples) {
  let calcTotal = (cache, currentValue) => cache + currentValue
  return freqSimples.reduce(calcTotal)
}

function acharMediana(vet) {

  let impPar
  let mediana
  let indice

  if (vet.length & 1) { //ve se a quantidade de elemento do vetor e impar ou par para saber quantas medianas teram
    impPar = 'Impar'
  }
  else {
    impPar = 'Par'
  }

  if (impPar == 'Impar') { //descobre apenas uma mediana porque e impar
    indice = vet.length / 2
    mediana = vet[Math.floor(indice)]
  }
  else { //descobre duas medianas porque e par
    indice = vet.length / 2
    mediana = vet[indice - 1]
    mediana += ' e ' + vet[indice] //separa com a conjunção e
  }

  return mediana

}

function acharMedia(vetEle, vetFre) { //entrar com o vetor de lista de elemento e de frequencia precisa fazer um if para
  //identificar qual opção o usuario escolheu ordinal, nominal ...
  var soma = parseFloat(vetEle[0]) * vetFre[0]
  var somaFre = vetFre[0]

  for (var i = 1; i < vetEle.length; i++) { //multiplica e soma os elementos do vetor com suas frequencias
    soma = soma + parseFloat(vetEle[i]) * vetFre[i]
    somaFre = somaFre + vetFre[i]
  }

  return (soma / somaFre).toFixed(1) //sai a media com apenas uma casa depois da virgula

}
/* 
function acharModa(vetProp, vetValor) { //tem que entrar com o vetor de lista de elementos e frequencia   

  let asModa = []
  let propiedade
  let maior
  let indice
  let cont = 0

  for (var i = 0; i <= vetValor.length; i++) { //Vendo se todas os elementos do vetor são iguais assim não havera MODA
    if (vetValor[0] == vetValor[i]) {
      cont++
    }
  }

  if (cont == vetValor.length) { //Retorno se todos forem iguais
    return 'Não tem moda'
  }
  else {
    propiedade = vetProp[0]
    maior = vetValor[0]
    indice = 0

    for (var i = 1; i <= vetValor.length; i++) { //Descobrindo a maior frequencia e sua posição
      if (vetValor[i] >= maior) {
        maior = vetValor[i]            // #############################  //
        propriedade = vetProp[i]       // ####  TA DANDO ERRO AQUI ####  //
        indice = i                     // #############################  //
      }
    }

    for (var j = 0; j <= indice; j++) { //Vendo se a MODA encontrada se repete
      if (vetValor[j] == maior) {
        asModa.push(vetProp[j]) // # Aqui esta saido a MODA #
      }
    }

    if (asModa.length <= 1) { //verificando se apenas um elemento e moda
      return propiedade
    }
    else {
      return asModa
    }
  }
}
 */


function acharModa(todasFreq) {

  let moda = 1
  let indexModa

  for (let i = 0; i < todasFreq.length; i++) {
    if (moda < todasFreq[i]) {
      moda = todasFreq[i]
    }
  }

  indexModa = todasFreq.find(element => element >= moda)

  if (moda == 1) {
    return 'não existe moda'
  }

  return indexModa
}


function acharDP(vetEle, vetFre) { //entrar com o vetor de lista de elemento e de frequencia precisa fazer um if para
  //identificar qual opção o usuario escolheu ordinal, nominal ...
  var soma = parseFloat(vetEle[0]) * vetFre[0]
  var somaFre = vetFre[0]
  var media
  var etapaUm = 0
  var DP

  for (var i = 1; i < vetEle.length; i++) { //multiplica e soma os elementos do vetor com suas frequencias
    soma = soma + parseFloat(vetEle[i]) * vetFre[i]
    somaFre = somaFre + vetFre[i]
  }

  media = (soma / somaFre).toFixed(1) //sai a media com apenas uma casa depois da virgula

  for (var i = 0; i < vetEle.length; i++) {
    etapaUm = etapaUm + Math.pow(parseFloat(vetEle[i]) - media, 2) * vetFre[i]
  }
  //Aplicando a formula
  DP = (Math.sqrt(etapaUm / somaFre)).toFixed(1)

  return DP
}

function acharCV(vetEle, vetFre) { //entrar com o vetor de lista de elemento e de frequencia precisa fazer um if para
  //identificar qual opção o usuario escolheu ordinal, nominal ...
  var soma = parseFloat(vetEle[0]) * vetFre[0]
  var somaFre = vetFre[0]
  var media
  var etapaUm = 0
  var DP
  var CV

  for (var i = 1; i < vetEle.length; i++) { //multiplica e soma os elementos do vetor com suas frequencias
    soma = soma + parseFloat(vetEle[i]) * vetFre[i]
    somaFre = somaFre + vetFre[i]
  }

  media = (soma / somaFre).toFixed(1) //sai a media com apenas uma casa depois da virgula

  for (var i = 0; i < vetEle.length; i++) {
    etapaUm = etapaUm + Math.pow(parseFloat(vetEle[i]) - media, 2) * vetFre[i]
  }
  //Aplicando a formula
  DP = (Math.sqrt(etapaUm / somaFre)).toFixed(1)

  CV = `${((DP / media) * 100).toFixed(0)}%`

  return CV
}





// *******************FUNÇÃO TROCAR IMAGEM ICONES************************/


var foto = 6;
var fotoPopulacao = document.getElementById('fotoPopulacao')
var fotoAmostra = document.getElementById('fotoAmostra')

function mudaFoto(foto) {
  if (document.getElementsByName('amostra_ou_populacao')[0].checked) {
    fotoAmostra.src = "../../imagens/amostraclick.png"
    fotoPopulacao.src = "../../imagens/populacao.png"
  }
  if (document.getElementsByName('amostra_ou_populacao')[1].checked) {
    fotoPopulacao.src = "../../imagens/populacaoclick.png"
    fotoAmostra.src = "../../imagens/amostra.png"
  }
}



// *******************GRÁFICOS CHART.JS***********************/



let geraCoresAleat = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};

// variaveis auxiliares nos gráficos:
let delGrafAnt
let chart

function geraGraf(qtdLinhas) {

  let valoresCol1 = []
  let valoresCol2 = []
  let paletaCores = []

  let cache // o cache é um acumulador

  for (let i = 1; i <= qtdLinhas; i++) {
    // aqui selecionamos na coluna 1 linha i os valores:
    cache = document.querySelector(`.col1_linha${i}`).innerHTML
    valoresCol1.push(cache)

    // aqui selecionamos na coluna 2 linha i os valores:
    cache = document.querySelector(`.calcFreq${i}`).innerHTML
    cache = parseFloat(cache)
    valoresCol2.push(cache)

    // aqui geramos a quantidade de cores exata para o gráfico
    paletaCores.push(geraCoresAleat())

  }

  //*********************TIPO DE GRÁFICO ************************/
  let tipodegrafico
  let titulodegrafico
  let dadosGrafico = window.document.querySelector('#coleta_de_dados').value
  dadosGrafico = dadosGrafico.split(';')
  let quantDados = dadosGrafico.length
  let tipodados = qualTipo(valoresCol1)

  if ((quantDados >= 10) && (tipodados == "number")) {
    tipodegrafico = 'line' //grafico Quantitativa Continua
    titulodegrafico = 'Quantitativa Contínua'
  } else if ((quantDados < 10) && (tipodados == "number")) {
    tipodegrafico = 'bar' //grafico Quantitativa Discreta
    titulodegrafico = 'Quantitativa Discreta'
  } else if (tipodados == "string") {
    tipodegrafico = 'pie' //grafico Qualitativa Ordinal ou Nominal
    titulodegrafico = 'Qualitativa Ordinal ou Nominal'
  }


  var ctx = document.getElementById('myChart')

  if (delGrafAnt === 'sim') {
    chart.destroy()
  }

  chart = ctx.getContext('2d') //Este comando diz que usaremos graficos 2d

  Chart.defaults.scale.ticks.beginAtZero = true; //Configuração para grafico de barras iniciar no zero

  chart = new Chart(ctx, {
    type: tipodegrafico,
    data: {
      labels: valoresCol1,
      datasets: [{
        label: '',
        backgroundColor: paletaCores,
        borderColor: ['white'],
        data: valoresCol2,
        steppedLine: true,
      }]
    },
    options: {

    }
  })

  delGrafAnt = 'sim'

}

// *******************Moda, Media e Mediana***********************/
var media = window.document.querySelector('#media')
var moda = window.document.querySelector('#moda')
var mediana = window.document.querySelector('#mediana')
var desviop = window.document.querySelector('#desviop')
var coeficiente = window.document.querySelector('#coeficiente')
var mediamodamed = window.document.querySelector('.media-moda-med')


function modmedmed() {
  moda.innerHTML = `A moda é: ${moda}`
  media.innerHTML = `A media é: ${media}`
  mediana.innerHTML = `A mediana é: ${mediana}`
  desviop.innerHTML = `O desvio padrão é: ${desviop}`
  coeficiente.innerHTML = `O coeficiente é: ${coeficiente}`
  mediamodamed.style.backgroundColor = 'rgb(204, 203, 236)'
}

