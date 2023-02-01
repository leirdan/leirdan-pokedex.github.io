// TODO: FAZER UM BOTÃO DE "MAIS DETALHES" PRA VISUALIZAR TODOS OS DADOS DO POKEMON EM UMA ABA SEPARADA?

const div = document.getElementById("root");
const title = document.createElement("h1");
title.textContent = `BEM VINDO À POKEDEX VIRTUAL!`;

/* HTML FORM */

const divForm = document.getElementById("form");
divForm.appendChild(title);

const form = document.createElement("form");
form.className = "search-form";

const label = document.createElement("label");
label.textContent = `Pesquise por um pokémon.`;
label.className = "search-label";

const input = document.createElement("input");
input.type = "text";
input.className = "search-input";
input.placeholder = "ex.: wartortle.";

const button = document.createElement("button");
button.textContent = `Procure seu pokémon!`;
button.className = "search-button";

form.appendChild(label);
form.appendChild(input);
form.appendChild(button);

divForm.appendChild(form);

const divError = document.getElementById("error");
divError.className = "error-div";

const message = document.createElement("h4");
let text;

/* COMMUNICATION WITH POKEAPI */

const endpoint = `https://pokeapi.co/api/v2/pokemon?limit=151`;
const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

const getElementForm = (element) => {
	return document.querySelector(element);
};

// here, we get the elements from html.
const searchInput = getElementForm(".search-input");
const searchButton = getElementForm(".search-button");
const backButton = document.createElement("button");
backButton.textContent = `Voltar ao início`;
backButton.className = "back-button";

let pokemonName, pokemonResult;

/******** FUNCTIONS *********/

// 1. the function below calls the API, gets all the pokemons, make them a json object and, for every pokemon in the list, execute the 'requestPokemon' function
async function fetchAllPokemon() {
	fetch(endpoint)
		.then((pokemons) => {
			return pokemons.json();
		})
		.then((allPokemons) => {
			allPokemons.results.forEach((pokemon) => {
				requestPokemon(pokemon);
			});
		});
}

// 2. the function below is the one that make the request in pokeApi and return an error or the pokemon data!
async function requestPokemon(pokemon) {
	const url = pokemon.url;
	const res = await fetch(url);
	if (res.status === 200) {
		const pokemon = await res.json();
		createCard(pokemon);
	} else {
		text = `um erro ocorreu :(.`;
		divError.innerHTML = text;
	}
}

// 2.1. this function is used to get only 1 pokemon
async function getOnePokemon(pokemon) {
	div.innerHTML = "";
	divError.innerHTML = "";
	const url = `${baseUrl}${pokemon}`;
	const res = await fetch(url);
	if (res.status === 200) {
		const pokemon = await res.json();
		form.removeChild(button);
		form.appendChild(backButton);
		createCard(pokemon);
	} else {
		text = `um erro ocorreu. insira o nome correto dessa vez.`;
		divError.innerHTML = text;
	}
}

// 3. the function below create the html which contains the pokemon's info that will be rendered.
async function createCard(pokemon) {
	const divResult = document.createElement("div");
	const { id, name, sprites, types, abilities } = pokemon;
	const type = types[0].type.name;
	const ability = abilities[0].ability.url;
	let abilityName, abilityDescription;
	await fetch(ability)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			abilityName = data.name;
			if (pokemon.id == 1 || pokemon.id == 2 || pokemon.id == 3) {
				// this if-else is necessary because the first 3 pokemons have effect_entries[1] written in german, so i need to change the slot to [0] to get the text in english!
				abilityDescription = data.effect_entries[0].short_effect;
			} else {
				abilityDescription = data.effect_entries[1].short_effect;
			}
			console.log(data);
		});
	const card = `
	<div class="card-div"> 
		<div class="img-div"> 
			<img src="${sprites.front_default}" alt="${name}" />
		</div>
		<div class="body-div">
			<span class="span"> ${id} </span>
			<h3 class="title"> ${name[0].toUpperCase() + name.substring(1)} </h3>
			<button class="details-button"> Ver detalhes </button>
		</div>
	</div>

	`;
	divResult.className = "result-div";
	divResult.classList.add("pokemon");
	divResult.innerHTML = card;
	div.appendChild(divResult);
}

// 4. as soon as the page is loaded, the request will be made and functions will be executed!
window.onload = fetchAllPokemon();

// 5. the event that is activated by a click in the submit button. gets the value in search input and returns only 1 pokemon
searchButton.addEventListener("click", async (event) => {
	event.preventDefault();
	try {
		const poke = searchInput.value.toLowerCase();
		if (searchInput.value == "") {
			div.innerHTML = "";
			divError.innerHTML = `pesquise por um pokémon, amigo.`;
			form.appendChild(backButton);
		} else {
			getOnePokemon(poke);
		}
	} catch (err) {
		divError.innerHTML = err;
	}
});

// 6. this function is activated when the user presses the "return button", which returns him/her to the homepage with all the pokemons
backButton.addEventListener("click", (event) => {
	event.preventDefault();
	div.innerHTML = "";
	searchInput.value = "";
	form.removeChild(backButton);
	form.appendChild(button);
	fetchAllPokemon();
});
