require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('./models/Pizza');
const Ingredient = require('./models/Ingredient');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzeria';

const pizzas = [
  {
    name: 'Paneer Tikka',
    description: 'This is a popular Italian pizza flavoured with marinated tikka sauce and paneer',
    price: 290,
    image: 'assets/images/pizzas/paneer-tikka.jpg',
    ingredients: 'dough/flour, pizza sauce, pizza sauce seasoning, cheese',
    toppings: 'Paneer, Fried Onion, Green olive, Capsicum, Red paprika',
    isVeg: true
  },
  {
    name: 'Chicken Italiaona',
    description: 'This is a popular Italian pizza flavour with light sugary taste and creamy touch',
    price: 350,
    image: 'assets/images/pizzas/chicken-italiaona.jpg',
    ingredients: 'deep dish pizza mix, pizza sauce, pizza sauce seasoning, cheese, sugar and cinnamon blend, plain butter',
    toppings: 'Pepperoni, Chicken Sausage, Mushroom, Capsicum, Black olive',
    isVeg: false
  },
  {
    name: 'Veggie Supreme',
    description: 'This is a popular Italian pizza flavoured with crushed garlic, multiple herbs topped up with sweet corn',
    price: 310,
    image: 'assets/images/pizzas/veggie-supreme.jpg',
    ingredients: 'deep dish pizza mix, pizza sauce, pizza sauce seasoning, cheese, garlic herbs, flavored butter',
    toppings: 'Fried Onion, Sweet corn, Mushroom, Capsicum, Black olive',
    isVeg: true
  },
  {
    name: 'Tripple Chicken Feast',
    description: 'This is a popular Italian pizza flavoured with unique greek dressing topped up with keema and meat ball',
    price: 400,
    image: 'assets/images/pizzas/tripple-chicken-feast.jpg',
    ingredients: 'low carb pizza dough, pizza sauce, pizza sauce seasoning, cheese, greek dressing, cajun',
    toppings: 'Chicken keema, Fried Onion, Chicken Meat ball, Capsicum, Sweet corn',
    isVeg: false
  },
  {
    name: 'Ultimate Chicken',
    description: 'This is a popular Italian pizza flavoured with BBQ sauce, flavored butter, it has spongy base which gives unique taste with multiple toppings',
    price: 625,
    image: 'assets/images/pizzas/ultimate-chicken.jpg',
    ingredients: 'Deep dish pizza mix, pizza sauce, pizza sauce seasoning, cheese, BBQ sauce, cajun, flavored butter',
    toppings: 'Pepperoni, Fried Onion, Chicken Meat ball, Chicken Sausage, Chicken keema',
    isVeg: false
  },
  {
    name: 'Mushroom Maniac',
    description: 'This is a pizza that is made only for people who are crazy about mushrooms.',
    price: 325,
    image: 'assets/images/pizzas/mushroom-maniac.jpg',
    ingredients: 'Sauted mushrooms, onions, capsicum, cheese, pizza sauce, seasonings',
    toppings: 'Pepproni, Mushrooms, Parsley, Chilli flakes',
    isVeg: true
  }
];

const ingredients = [
  { name: 'Pepperoni', price: 110, image: 'assets/images/ingredients/pepperoni.jpg' },
  { name: 'Mushroom', price: 35, image: 'assets/images/ingredients/mushroom.jpg' },
  { name: 'Black beans', price: 45, image: 'assets/images/ingredients/black-beans.jpg' },
  { name: 'Black olive', price: 50, image: 'assets/images/ingredients/black-olive.jpg' },
  { name: 'Green olive', price: 50, image: 'assets/images/ingredients/green-olive.jpg' },
  { name: 'Jalapeno', price: 45, image: 'assets/images/ingredients/jalapeno.jpg' },
  { name: 'Chicken', price: 60, image: 'assets/images/ingredients/chicken.jpg' },
  { name: 'Tomato', price: 20, image: 'assets/images/ingredients/tomato.jpg' },
  { name: 'Red preprika', price: 30, image: 'assets/images/ingredients/red-paprika.jpg' },
  { name: 'Paneer', price: 45, image: 'assets/images/ingredients/paneer.jpg' },
  { name: 'Fried Onion', price: 18, image: 'assets/images/ingredients/fried-onion.jpg' },
  { name: 'Capsicum', price: 15, image: 'assets/images/ingredients/capsicum.jpg' },
  { name: 'Sweet corn', price: 38, image: 'assets/images/ingredients/sweet-corn.jpg' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await Pizza.deleteMany({});
    await Ingredient.deleteMany({});

    await Pizza.insertMany(pizzas);
    await Ingredient.insertMany(ingredients);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
