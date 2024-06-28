document.addEventListener("DOMContentLoaded", function () {
  const namePokemonElement = document.querySelector(".main__nome-pokemon");
  const abilityPokemonElement = document.querySelector(
    ".main__habilidade-pokemon"
  );
  const typePokemonElement = document.querySelector(".main__tipo-pokemon");
  const searchBtn = document.querySelector(".main__search-btn");
  const imagePokemonElement = document.querySelector(".main__imagem-pokemon");

  // modal referencia
  const logoPokebola = document.querySelector(".main__logo-pokebola");
  const modal = document.querySelector(".modal-container");
  const fecharModal = document.querySelector(".modal-container__fechar-modal");
  const listaModal = document.querySelector(".modal-container__lista-pokemon");
  const contadorPokemon = document.querySelector(".main__contador-Pokemon");

  let listaPokemon = JSON.parse(localStorage.getItem("listaPokemon")) ?? [];

  // Erros referencia

  let mensagemErro = "";
  let mensagemErroElement = document.querySelector(
    ".container-erro__message-erro"
  );
  const campSearch = document.querySelector("#main__campo-pesquisa");
  const containerErro = document.querySelector(".container-erro");

  async function clickHandlerCapture() {
    try {
      avaliableCamp();
      let url = `https://pokeapi.co/api/v2/pokemon/${campSearch.value.toLocaleLowerCase()}`;
      const response = await fetch(url);
      error404(response);
      const data = await response.json();
      adicionaItemALista(data);
      fillingInInformation(data);
      console.log(response.statusCode);
    } catch (error) {
      mensagemErroElement.textContent = mensagemErro;
      console.log(error);
    }
  }

  function fillingInInformation(data) {
    imagePokemonElement.src = data.sprites.front_default;
    namePokemonElement.textContent = data.name;

    data.types.forEach(function (element) {
      typePokemonElement.textContent = element.type.name;
    });

    data.abilities.forEach(function (element) {
      abilityPokemonElement.textContent = element.ability.name;
    });
  }

  // Tratamento de Erros

  function error404(response) {
    if (response.status !== 200) {
      containerErro.style.display = "block";
      mensagemErro = "Pokemon não encontrado";
      mensagemErroElement.textContent = mensagemErro;
      setTimeout(fechaContainerErro, 4000);
      console.log("capturando erro");
      throw new Error("Pokemon não encontrado");
    }
  }

  function fechaContainerErro() {
    containerErro.style.display = "none";
  }

  function avaliableCamp() {
    if (campSearch.value === "") {
      containerErro.style.display = "block";
      mensagemErro = "Digite o nome do pokemon";
      mensagemErroElement.textContent = mensagemErro;
      setTimeout(fechaContainerErro, 4000);
      throw new Error("Digite o nome do pokemon");
    }
  }

  //  Inteligencia modal

  function devoAbrirModalOuFechar() {
    const controle = true;

    if (listaPokemon.length === 0) {
      containerErro.style.display = "block";
      mensagemErro = "Sua lista esta vazia";
      mensagemErroElement.textContent = mensagemErro;
      setTimeout(fechaContainerErro, 4000);
      controle = false;
    }

    return controle;
  }

  function mostrarModal() {
    if (devoAbrirModalOuFechar()) {
      modal.style.visibility = "visible";
    }
  }

  function desaparecerModal() {
    modal.style.visibility = "hidden";
  }

  function createModal(data) {
    const itemLista = document.createElement("div");
    itemLista.setAttribute("class", "modal-container__item-lista");

    const nome = document.createElement("p");
    nome.setAttribute("class", "modal-container__nome-Pokemon");
    nome.textContent = data.name;

    const img = document.createElement("img");
    img.setAttribute("class", "modal-container__imagem-pokemon");
    img.src = data.sprites.front_default;

    const btn = document.createElement("button");
    btn.setAttribute("class", "modal-container__removeBtn");
    btn.textContent = "Apagar pokemon da lista";

    btn.addEventListener("click", () => {
      const id = data.id;
      const pokemonApagar = listaPokemon.find((pokemon) => pokemon.id === id);
      listaPokemon = listaPokemon.filter(
        (pokemon) => pokemon !== pokemonApagar
      );
      itemLista.remove();
      atualizaLocalStorage();
      contagempokemon();
    });

    itemLista.appendChild(nome);
    itemLista.appendChild(img);
    itemLista.appendChild(btn);

    listaModal.appendChild(itemLista);
  }

  function jaEstaNaLista(data) {
    if (listaPokemon.length === "") {
      return;
    }

    listaPokemon.forEach((dados) => {
      const id = dados.id;

      if (id === data.id) {
        containerErro.style.display = "block";
        mensagemErro = "pokemon ja registrado";
        setTimeout(fechaContainerErro, 4000);
        throw new Error("pokemon ja registrado");
      }
    });
  }

  function atualizaLocalStorage() {
    localStorage.setItem("listaPokemon", JSON.stringify(listaPokemon));
  }

  function adicionaALista(data) {
    listaPokemon.push(data);
    contagempokemon();
  }

  function adicionaItemALista(data) {
    jaEstaNaLista(data);
    createModal(data);
    adicionaALista(data);
    atualizaLocalStorage();
  }

  for (lista of listaPokemon) {
    createModal(lista);
  }

  //  contabiliza os numeros de pokemons na lista
  function contagempokemon() {
    contadorPokemon.textContent = listaPokemon.length;
  }

  contagempokemon();

  logoPokebola.addEventListener("click", mostrarModal);
  fecharModal.addEventListener("click", desaparecerModal);
  searchBtn.addEventListener("click", clickHandlerCapture);
});
