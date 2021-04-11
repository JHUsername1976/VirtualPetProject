var dog,sadDog,happyDog;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  
  database = firebase.database();

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("feed the dog");
  feed.position (700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton(" add food");
  addFood.position (800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87);

  foodObj.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill("blue");
  textSize(15);
  if(lastFed >= 12){
    text("last feed: " + lastFed%12 + "PM", 350, 30);
  }else if(lastFed == 0){
    text("last feed: 12AM", 350, 30);
  }else{
    text("last feed: " + lastFed + "AM", 350, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foods = data.val();
  foodObj.updateFoodStock(foods);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0)
  }else{
    foodObj.updateFoodStock(food_stock_val * -1)
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    FeedTime: hour()
  })
}


//function to add food in stock
function addFoods(){
  foods = foods + 1;
  database.ref('/').update({
    Food: foods
  })
}


