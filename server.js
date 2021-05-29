const { response, json } = require("express");

const express = require("express");
const app = express();

//load the quotes JSON
var orders = require("./orders.json");
var restaurants = require("./restaurants.json");
var foods = [];

app.get("/", function (request, response) {
    response.send("Welcome to migracode-small-glovo service! Ask me for add/remove with id parameter");
});

app.get("/restaurant", function (req, res) {
    res.send(restaurants);
});

// "id": 1,
// "name": "indian-chilli",
// "position": [1, 2],
// "averageProductionTime": 1.5,
// "supportedFoodTypes": ["pizza", "sushi"],
// "averageTimePerUnitOfDistance": 1

app.use(express.json())

app.delete("/restaurants/:id", (req, res) => {
    let id = Number(req.params.id);
    restaurants = restaurants.filter(item => item.id !== id)
    res.send(restaurants);
});

app.post("/restaurants", (req, res) => {
    let body = req.body;
    let nextId = Math.max(...restaurants.map(item => item.id)) + 1;
    restaurants.push({ "id": nextId, ...body });
    res.send(restaurants);
});


app.get("/restaurant/:id/:food", (req, res) => {
    let id = Number(req.params.id);
    let food = req.params.food;
    let index = restaurants.findIndex(item => item.id === id);

    if (restaurants[index].supportedFoodTypes.indexOf(food) === -1) {
        restaurants[index].supportedFoodTypes.push(food);
        console.log('New food collection in ' + restaurants[index].name + ' is : ' + food);
    } else if (restaurants[index].supportedFoodTypes.indexOf(food) > -1) {
        console.log(food + ' already exists in the veggies collection of ' + restaurants[index].name);
    }
    console.log(restaurants[index]);

    res.send(restaurants);
});

app.delete("/restaurant/:id/:food", (req, res) => {
    let id = Number(req.params.id);
    let food = req.params.food;
    let index = restaurants.findIndex(item => item.id === id);

    var indexFood = restaurants[index].supportedFoodTypes.indexOf(food);
    if (indexFood !== -1) {
        restaurants[index].supportedFoodTypes.splice(indexFood, 1);
        console.log('The food ' + food + ' was deleted from ' + restaurants[index].name + ' collection.');
    } else {
        console.log('The food ' + food + '  is not exists in ' + restaurants[index].name + ' collection.');
    }
    console.log(restaurants[index]);

    res.send(restaurants);
});

app.post("/food", (req, res) => {
    let body = req.body;
    let nextId = Math.max(...restaurants.map(item => item.id)) + 1;
    console.log(nextId);
    restaurants.push({ "id": nextId, ...body });
    res.send(restaurants);
});

//Start our server so that it listens for HTTP requests!
let port = 3000;

app.listen(port, function () {
    console.log("Your app is listening on port " + port);
});