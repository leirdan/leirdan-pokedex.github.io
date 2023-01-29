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

/* COMMUNICATION WITH POKEAPI */

const endpoint = `https://pokeapi.co/api/v2/pokemon/`;

const getElementForm = (element) => {
	return document.querySelector(element);
};

const searchInput = getElementForm(".search-input");
const searchButton = getElementForm(".search-button");

let pokemonName, pokemonResult;

searchButton.addEventListener("click", (event) => {
	event.preventDefault();
	pokemonName = searchInput.value.toLowerCase();
	requestPokemon(endpoint, pokemonName);
});

const requestPokemon = (endpoint, pokemon) => {
	fetch(`${endpoint}${pokemon}`)
		.then((result) => {
			return result.json();
		})
		.then((data) => {
			pokemonResult = data;
			console.log(pokemonResult);
		})
		.catch((err) => {
			console.log(err);
		});
};
