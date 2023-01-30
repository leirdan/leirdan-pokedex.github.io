const div = document.getElementById("root");
const title = document.createElement("h3");
title.textContent = `Welcome to the virtual Pokedex!`;
div.appendChild(title);

/* HTML FORM */

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

div.appendChild(form);

const divResult = document.getElementById("result");
const divError = document.getElementById("error");

const message = document.createElement("h4");
let text;

/* COMMUNICATION WITH POKEAPI */

const endpoint = `https://pokeapi.co/api/v2/pokemon?limit=151`;

const getElementForm = (element) => {
	return document.querySelector(element);
};

// here, we get the elements from html.
const searchInput = getElementForm(".search-input");
const searchButton = getElementForm(".search-button");

let pokemonName, pokemonResult;

/******** FUNCTIONS *********/

async function fetchAllPokemon() {
	fetch(endpoint)
		.then((pokemons) => {
			return pokemons.json();
		})
		.then((allPokemons) => {
			allPokemons.results.forEach((element) => {
				requestPokemon(element);
			});
		});
}

fetchAllPokemon();

// 1. the function below is the one that make the request in pokeApi and return an error or the pokemon data!
async function requestPokemon(pokemon) {
	const requestResult = await fetch(pokemon.url);
	if (requestResult.status === 200) {
		const data = await requestResult.json();
		pokemonResult = data;
		console.log(pokemonResult);
		return pokemonResult;
	} else {
		text = document.createTextNode(`insert a pokemon that exists!`);
		message.appendChild(text);
		divError.appendChild(message);
	}
}

// 2. the function below create the html which contains the pokemon's info that will be rendered.
async function createCard(pokemon) {
	return `
    <div> 
    <h1 class="name"> Name: ${pokemon.name} </h1>
    </div>
    `;
}

// 3. this is the function that calls the request API function and print the pokemon's data in the screen
async function startApp(pokemon) {
	await requestPokemon(endpoint, pokemon)
		.then((pokemon) => {
			divResult.innerHTML = createCard(pokemon);
		})
		.catch((err) => {
			text = document.createTextNode(err);
			message.appendChild(text);
			divError.appendChild(message);
		});
}

// 4. the event that is activated by a click in the submit button. gets the value in search input and execute the startApp function with the value of 	parameter.
searchButton.addEventListener("click", async (event) => {
	event.preventDefault();
	pokemonName = searchInput.value.toLowerCase();
	startApp(pokemonName);
});
