const div = document.getElementById("root");
const title = document.createElement("h1");
title.textContent = `WELCOME TO THE VIRTUAL POKEDEX!`;

/* HTML FORM */

const divForm = document.getElementById("form");
divForm.appendChild(title);

const form = document.createElement("form");
form.className = "search-form";

const input = document.createElement("input");
input.type = "text";
input.className = "search-input";

const button = document.createElement("button");
button.textContent = `Search your pokemon!`;
button.className = "search-button";

form.appendChild(input);
form.appendChild(button);

divForm.appendChild(form);

const divError = document.getElementById("error");

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
		text = `an error occurred!`;
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
		createCard(pokemon);
	} else {
		text = `an error occurred!`;
		divError.innerHTML = text;
	}
}

// 3. the function below create the html which contains the pokemon's info that will be rendered.
async function createCard(pokemon) {
	const pokeName = `${pokemon.name}`;
	const divResult = document.createElement("div");
	divResult.classList.add("pokemon");
	divResult.innerHTML = pokeName;
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
			divError.innerHTML = `insert something!`;
		} else {
			getOnePokemon(poke);
		}
	} catch (err) {
		divError.innerHTML = err;
	}
});
