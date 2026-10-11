/* ============================================================
   MULHERES NA CIÊNCIA · Jogo da Memória · Sociologia Digital
   Banco de dados do jogo. É só editar este arquivo para:
   - trocar uma foto (mude o caminho em "foto");
   - corrigir um nome ou uma área;
   - acrescentar, tirar ou reescrever "feitos".

   Cada mulher pode ter quantos feitos quiser. Na Fase 2 o jogo
   sorteia UM feito por mulher a cada rodada, dando preferência
   aos que o jogador ainda não viu. Quanto mais feitos, mais a
   rodada muda.

   "grupo" (opcional): feitos com o mesmo grupo nunca aparecem
   juntos na mesma rodada (evita duas cartas parecidas, como o
   sequenciamento do genoma da Ester e da Jaqueline).

   Dica: mantenha cada texto com até ~85 caracteres para caber
   bem na carta no celular.
   ============================================================ */

window.MULHERES = [
  {
    id: "conceicao-evaristo",
    nome: "Conceição Evaristo",
    area: "Literatura",
    foto: "img/conceicao-evaristo.jpg",
    feitos: [
      { id: "ce1", texto: "Criou o conceito de escrevivência: escrita que nasce da vivência negra." },
      { id: "ce2", texto: "Autora do romance Ponciá Vicêncio, publicado em 2003." },
      { id: "ce3", texto: "Seu livro de contos Olhos d'água ganhou o Prêmio Jabuti em 2015." },
      { id: "ce4", texto: "Doutora em Literatura Comparada pela UFF e mestre em Letras pela PUC-Rio." }
    ]
  },
  {
    id: "ester-sabino",
    nome: "Ester Sabino",
    area: "Ciência e saúde",
    foto: "img/ester-sabino.jpg",
    feitos: [
      { id: "es1", grupo: "genoma", texto: "Participou da equipe que sequenciou o genoma do coronavírus no Brasil, em 2020." },
      { id: "es2", texto: "Foi a primeira autora do estudo da revista Lancet sobre a nova onda de covid em Manaus." },
      { id: "es3", texto: "Usa o código genético de vírus para estudar zika, febre amarela e HIV." },
      { id: "es4", texto: "Médica e professora da USP, é referência em doenças infecciosas." }
    ]
  },
  {
    id: "patricia-hill-collins",
    nome: "Patricia Hill Collins",
    area: "Sociologia",
    foto: "img/patricia-hill-collins.jpg",
    feitos: [
      { id: "ph1", texto: "Autora de Pensamento Feminista Negro, livro de 1990 que virou clássico." },
      { id: "ph2", texto: "Foi a primeira mulher negra a presidir a Associação Americana de Sociologia." },
      { id: "ph3", texto: "Criou a ideia de matriz de dominação: raça, gênero e classe se cruzam." },
      { id: "ph4", texto: "Ajudou a consolidar a interseccionalidade como teoria social crítica." },
      { id: "ph5", texto: "Descreveu a posição de “forasteira de dentro” de mulheres negras na academia." }
    ]
  },
  {
    id: "sonia-guimaraes",
    nome: "Sônia Guimarães",
    area: "Física",
    foto: "img/sonia-guimaraes.jpg",
    feitos: [
      { id: "sg1", texto: "Primeira mulher negra brasileira a obter doutorado em Física." },
      { id: "sg2", texto: "Primeira professora negra do ITA, o Instituto Tecnológico de Aeronáutica." },
      { id: "sg3", texto: "Pesquisa materiais semicondutores e sensores de infravermelho." },
      { id: "sg4", texto: "Fez o doutorado na Inglaterra, na Universidade de Manchester." }
    ]
  },
  {
    id: "djamila-ribeiro",
    nome: "Djamila Ribeiro",
    area: "Filosofia",
    foto: "img/djamila-ribeiro.jpg",
    feitos: [
      { id: "dr1", texto: "Autora de Pequeno Manual Antirracista e de O que é lugar de fala?" },
      { id: "dr2", texto: "Foi secretária-adjunta de Direitos Humanos e Cidadania de São Paulo, em 2016." },
      { id: "dr3", texto: "Coordena a coleção Feminismos Plurais, sobre racismo, gênero e classe." },
      { id: "dr4", texto: "É mestra em Filosofia Política pela UNIFESP." }
    ]
  },
  {
    id: "harriet-martineau",
    nome: "Harriet Martineau",
    area: "Sociologia",
    foto: "img/harriet-martineau.jpg",
    feitos: [
      { id: "hm1", texto: "Pioneira da sociologia: estudou desigualdades, educação e a condição das mulheres." },
      { id: "hm2", texto: "Traduziu e resumiu a obra de Comte, o “pai” da sociologia, para o inglês." },
      { id: "hm3", texto: "Escreveu Society in America (1837) depois de viajar pelos Estados Unidos." },
      { id: "hm4", texto: "Escreveu um dos primeiros livros de método: Como observar costumes e moral." },
      { id: "hm5", texto: "Mesmo surda, viajou o mundo e escreveu sobre economia, política e sociedade." }
    ]
  },
  {
    id: "marianne-weber",
    nome: "Marianne Weber",
    area: "Sociologia e feminismo",
    foto: "img/marianne-weber.jpg",
    feitos: [
      { id: "mw1", texto: "Estudou a posição das mulheres na sociedade, no casamento e na família." },
      { id: "mw2", texto: "Organizou a publicação de Economia e Sociedade, de Max Weber, após a morte dele." },
      { id: "mw3", texto: "Escreveu sobre esposas e mães na história do direito, em livro de 1907." },
      { id: "mw4", texto: "Atuou no movimento feminista alemão e foi eleita ao parlamento de Baden em 1919." }
    ]
  },
  {
    id: "jaqueline-goes",
    nome: "Jaqueline Goes",
    area: "Biomedicina",
    foto: "img/jaqueline-goes.jpg",
    feitos: [
      { id: "jg1", grupo: "genoma", texto: "Liderou a equipe que sequenciou o genoma do coronavírus no Brasil, em 2020." },
      { id: "jg2", texto: "Cientista baiana, nascida em Salvador, virou símbolo de representatividade na ciência." },
      { id: "jg3", texto: "Em 2020, era pesquisadora do Instituto de Medicina Tropical da USP." }
    ]
  },
  {
    id: "lelia-gonzalez",
    nome: "Lélia Gonzalez",
    area: "Antropologia e movimento negro",
    foto: "img/lelia-gonzalez.jpg",
    feitos: [
      { id: "lg1", texto: "Criou o conceito de amefricanidade (raízes africanas e indígenas das Américas)." },
      { id: "lg2", texto: "Foi uma das fundadoras do Movimento Negro Unificado, em 1978." },
      { id: "lg3", texto: "Pioneira nos estudos sobre racismo e sexismo no Brasil." },
      { id: "lg4", texto: "Chamou de “pretuguês” o português falado no Brasil, com marcas africanas." },
      { id: "lg5", texto: "Fundou o Nzinga, coletivo de mulheres negras do Rio de Janeiro, em 1983." }
    ]
  },
  {
    id: "hedy-lamarr",
    nome: "Hedy Lamarr",
    area: "Invenção e tecnologia",
    foto: "img/hedy-lamarr.jpg",
    feitos: [
      { id: "hl1", texto: "Criou com George Antheil o salto de frequência, base de tecnologias sem fio." },
      { id: "hl2", texto: "Atriz de Hollywood, patenteou em 1942 um sistema secreto de comunicação." },
      { id: "hl3", texto: "Sua invenção foi pensada para evitar a interceptação de torpedos guiados por rádio." },
      { id: "hl4", texto: "Sua ideia de saltos de frequência inspirou tecnologias como o Bluetooth." },
      { id: "hl5", texto: "Entrou para o Hall da Fama dos Inventores dos Estados Unidos, em 2014." }
    ]
  }
];
