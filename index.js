const prompt = require('prompt-sync')();
const fs = require("fs");

function lerEntrada(textoPergunta) {
  return prompt(textoPergunta);
}

function lerRanking() {
  try {
    const data = fs.readFileSync('ranking.txt', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function salvarRanking(ranking) {
  fs.writeFileSync('ranking.txt', JSON.stringify(ranking));
}

function exibirRanking(ranking) {
  console.log("***********************************************************");
  console.log("RANKING DE PONTOS");
  console.log("***********************************************************");

  ranking.forEach((jogador, indice) => {
    console.log(`${indice + 1}º - ${jogador.nome} ${jogador.pontuacao} pontos`);
  });
}

function ordenarRanking(ranking) {
  return ranking.sort((a, b) => b.pontuacao - a.pontuacao);
}

function validarChute(chute) {
  const numero = parseInt(chute);
  return !isNaN(numero) && numero >= 1 && numero <= 100;
}

function jogarJogo() {
  console.log(`**************************************************** *
  *** ADS 2023.1 - IFPI Campus Picos ***
  ** Bem-vindo ao Jogo de Adivinhação **
  ******* Aluno: <Nome do aluno> *******
  * Recorde de pontos atual: <  > *
  **************************************
  `);

  const ranking = lerRanking();
  console.log(ranking)
  let recordeAtual = ranking && ranking.length > 0 ? ranking[0].pontuacao : 0;

  do {
    console.log("****************************************************");

    let jogador1 = {
      nome: "",
      chutes: 0,
      pontuacao: 100
    };

    let jogador2 = {
      nome: "",
      chutes: 0,
      pontuacao: 100
    };

    jogador1.nome = lerEntrada("Digite o nome do jogador 1: ");
    jogador2.nome = lerEntrada("Digite o nome do jogador 2: ");

    let numeroSecreto = Math.floor(Math.random() * 100) + 1;
    //console.log(numeroSecreto);
    let vencedor = null;

    while (!vencedor) {
      let chuteJogador1 = lerEntrada(`${jogador1.nome}, digite um número entre 1 e 100: `);

      if (!validarChute(chuteJogador1)) {
        console.log("Chute inválido! Digite um número de 1 a 100.");
        continue;
      }

      jogador1.chutes++;
      const numeroChute1 = parseInt(chuteJogador1);

      if (numeroChute1 > numeroSecreto) {
        console.log("Seu chute foi maior do que o número secreto.");
        jogador1.pontuacao -= 10;
        console.log(jogador1.pontuacao);
      } else if (numeroChute1 < numeroSecreto) {
        console.log("Seu chute foi menor do que o número secreto.");
        jogador1.pontuacao -= 10;
        console.log(jogador1.pontuacao);
      } else {
        vencedor = jogador1;
        break;
      }

      let chuteJogador2 = lerEntrada(`${jogador2.nome}, digite um número entre 1 e 100: `);

      if (!validarChute(chuteJogador2)) {
        console.log("Chute inválido! Digite um número de 1 a 100.");
        continue;
      }

      jogador2.chutes++;
      const numeroChute2 = parseInt(chuteJogador2);

      if (numeroChute2 > numeroSecreto) {
        console.log("Seu chute foi maior do que o número secreto.");
        jogador2.pontuacao -= 10;
        console.log(jogador2.pontuacao);
      } else if (numeroChute2 < numeroSecreto) {
        console.log("Seu chute foi menor do que o número secreto.");
        jogador2.pontuacao -= 10;
        console.log(jogador2.pontuacao);
      } else {
        vencedor = jogador2;
        break;
      }
    }

    if (vencedor) {
      console.log("***********************************************************");
      console.log(`Parabéns ${vencedor.nome}! Você acertou em ${vencedor.chutes} tentativas.`);
      console.log(`Sua pontuação foi ${vencedor.pontuacao} pontos.`);

      if (vencedor.pontuacao > recordeAtual) {
        console.log("Você é o novo recordista de pontos!");
        recordeAtual = vencedor.pontuacao;
      } else {
        console.log(`Sua pontuação ficou abaixo do recorde atual, que é de ${recordeAtual} pontos.`);
      }

      ranking.push({ nome: vencedor.nome, pontuacao: vencedor.pontuacao });
      ordenarRanking(ranking);
      salvarRanking(ranking);
      exibirRanking(ranking);

      console.log("***********************************************************");
    }

    console.log("***********************************************************");
    console.log("0 - Sair");
    console.log("1 - Jogar novamente");
    let opcao = parseInt(lerEntrada("Escolha uma opção: "));
    if (opcao === 0) {
      break;
    }
  } while (true);
}

jogarJogo();
