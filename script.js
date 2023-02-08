const container = document.getElementById("container");

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
divError.id = "error-div";

// use this to send messages to user
const message = document.createElement("h4");
let text;
const getElementForm = (element) => {
	return document.querySelector(element);
};

// here, we get the elements from html.
const searchInput = getElementForm(".search-input");
const searchButton = getElementForm(".search-button");
const backButton = document.createElement("button");
backButton.className = "back-button";
backButton.textContent = `Voltar ao início`;

/* COMMUNICATION WITH POKEAPI */

const endpoint = `https://pokeapi.co/api/v2/pokemon?limit=151`;
const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

let pokemonName, pokemonResult;

/******** FUNCTIONS TO GET AND CREATE DATA *********/

// 1. the function below calls the API, gets all the pokemons, make them a json object and, for every pokemon in the list, execute the 'requestPokemon' function
async function fetchAllPokemon() {
	// if there is anything printed before, delete it.
	const divError = document.getElementById("error-div");
	divError.innerHTML = "";
	const divSelect = document.getElementsByClassName("select-div");
	divSelect.innerHTML = "";

	// fetch all the pokemons from the api, turn them into json objects and execute the requestPokemon function
	await fetch(endpoint)
		.then((pokemons) => {
			return pokemons.json();
		})
		.then((allPokemons) => {
			allPokemons.results.forEach((pokemon) => {
				requestPokemon(pokemon);
			});
		});
}

// 2. this function makes an amount of requests in pokeApi and generates an error or the pokemons data by calling createCard function!
async function requestPokemon(pokemon) {
	const url = pokemon.url;
	const res = await fetch(url);
	form.appendChild(label);
	form.appendChild(input);
	form.appendChild(button);
	if (res.status === 200) {
		const pokemon = await res.json();
		createCard(pokemon);
	} else {
		text = `um erro ocorreu :(.`;
		divError.innerHTML = text;
	}
}

// 3. the function below create the html which contains the pokemon's info that will be rendered.
async function createCard(pokemon) {
	const { id, name, sprites } = pokemon;
	const card = `
	<div class="card-div"> 
		<div class="img-div"> 
			<img src="${sprites.front_default}" alt="${name}" title=${name.toUpperCase()} />
		</div>
		<div class="body-div">
			<span class="span" id="id-pokemon"> ${id} </span>
			<h3 class="title"> ${name[0].toUpperCase() + name.substring(1)} </h3>
			<button class="details-button" onclick="cardDetailsPokemon(${id})"> Ver detalhes </button>
		</div>
	</div>
	`;

	// this div will render the card
	const divResult = document.createElement("div");
	divResult.className = "result-div";
	divResult.classList.add("pokemon");
	divResult.id = "result-div";
	// insert card into div
	divResult.innerHTML = card;

	// insert div with a card into the main div
	div.appendChild(divResult);
}

// 4. this function is used when the user wants to search for a unique pokemon
async function getOnePokemon(pokemon) {
	// deletes everything in the screen before (except the form)
	div.innerHTML = "";
	divError.innerHTML = "";

	// the function parameter is the id of the pokemon, and it's used to compose the url
	const url = `${baseUrl}${pokemon}`;
	const res = await fetch(url);
	if (res.status === 200) {
		const pokemon = await res.json();
		form.removeChild(button);
		form.removeChild(input);
		form.removeChild(label);
		form.appendChild(backButton);
		createCard(pokemon);
	} else {
		text = `um erro ocorreu. insira o nome correto dessa vez.`;
		divError.innerHTML = text;
		form.appendChild(backButton);
	}
}

// 5. creates the card with the details that wasn't visible on the homepage
async function cardDetailsPokemon(id) {
	await fetch(baseUrl + id)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			pokemon = data;
		});

	// TODO: get more data from the API, like characteristics, moves, natures, habitats and more.
	const { name, sprites, types, abilities, base_experience } = pokemon;
	const type = types[0].type.name;
	let mainAbility = abilities[0].ability.url;
	let mainAbilityName, mainAbilityDescription;

	await fetch(mainAbility)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			mainAbilityName = data.name;
			if (pokemon.id == 1 || pokemon.id == 2 || pokemon.id == 3) {
				// this if-else is necessary because the first 3 pokemons have effect_entries[1] written in german, so i need to change the slot to [0] to get the text in english!
				mainAbilityDescription = data.effect_entries[0].effect;
			} else {
				mainAbilityDescription = data.effect_entries[1].effect;
			}
		});

	const card = `
	<div class="card-details"> 
		<div class="header-details"> 
			<h2> ${name.toUpperCase()} </h2>
			<div class="img-details">
				<img src=${sprites.front_default} title=${name.toUpperCase()} /> 
			</div>
			<h3 class="type-details" id="${type}"> ${type} </h3>
			<h4> Libera <strong> ${base_experience} </strong> xp quando derrotado. </h4>
			<div class="abilities-details">
				<h4 class="ability"> 
					<span class="label-details">
						HABILIDADE 
					</span> 
					${mainAbilityName[0].toUpperCase() + mainAbilityName.substring(1)} 
					<details>
					${mainAbilityDescription}
					</details>
				</h4>
			</div>
		</div>
	</div>
	`;

	// this is the div that will store and render the card
	const divSelect = document.createElement("div");
	divSelect.className = "select-div";
	divSelect.id = "select-div";

	// reset the screen and show the divSelect on screen
	div.innerHTML = "";
	form.removeChild(input);
	form.removeChild(label);
	form.removeChild(button);
	form.appendChild(backButton);
	divSelect.innerHTML = card;
	container.appendChild(divSelect);
}

/********* FUNCTIONS TO LOAD DATA *********/

// 6. as soon as the page is loaded, the request will be made and the functions cascade will be executed!
window.onload = fetchAllPokemon();

// 7. the event that is activated by a click in the submit button. gets the value in search input and returns only 1 pokemon
searchButton.addEventListener("click", async (event) => {
	event.preventDefault();
	try {
		const poke = searchInput.value.toLowerCase();
		if (searchInput.value == "") {
			div.innerHTML = "";
			form.removeChild(label);
			divError.innerHTML = `pesquise por um pokémon, amigo.`;
			form.appendChild(backButton);
		} else {
			getOnePokemon(poke);
		}
	} catch (err) {
		divError.innerHTML = err;
	}
});

// 8. this function is activated when the user presses the "return button", which returns him/her to the homepage with all the pokemons
backButton.addEventListener("click", async (event) => {
	event.preventDefault();

	div.innerHTML = "";
	searchInput.value = "";
	form.removeChild(backButton);
	form.appendChild(button);

	// remove the pokemon card that's result of the "ver detalhes" button off the screen
	const divSelect = document.getElementById("select-div");
	if (divSelect) {
		const container = document.getElementById("container");
		container.removeChild(divSelect);
	}

	// run the program again
	fetchAllPokemon();
});
