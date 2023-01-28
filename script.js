const div = document.getElementById("root");
const title = document.createElement("h3");
title.textContent = `welcome to the virtual pokedex!`;
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
button.onclick = "";

form.appendChild(input);
form.appendChild(button);

div.appendChild(form);
