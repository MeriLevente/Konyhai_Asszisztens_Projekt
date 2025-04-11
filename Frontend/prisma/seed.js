// seed prisma database

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.users.deleteMany({});
  await prisma.recipes.deleteMany({});
  await prisma.itemTypes.deleteMany({});
  await prisma.items.deleteMany({});
  await prisma.contains.deleteMany({});
  await prisma.stores.deleteMany({});

  await prisma.users.createMany({
    data: [{
      id: 1,
      name: 'admin',
      email: "admin@gmail.com",
      password: "$2a$11$2W2gSXeiREfcbFRJUXccN.bFDbrYPI1u9jguq1Jv7xE/suUsnnW/y",
      role: "admin",
      token: ""
    }, 
    {
      id: 2,
      name: 'Manusz Márton',
      email: "marton@gmail.com",
      password: "$2a$11$Fpy4yBz0fBvQ2hrCAJO7v.s4ALaHb6tenlQTP5yN6BxoLlojhrUv2",
      role: "user",
      token: ""
    }]
  });

  await prisma.itemTypes.createMany({
    data: [{
      id: 1,
      name: "Zöldségek",
      name_EN: "Vegetables",
      image: "https://bgs.jedlik.eu/ml/Images/Types/vegetables.jpg"
    },
    {
      id: 2,
      name: "Gyümölcsök",
      name_EN: "Fruits",
      image: "https://bgs.jedlik.eu/ml/Images/Types/fruits.jpg"
    }]
  });

  await prisma.items.createMany({
    data: [
      {
        id: 1,
        name: "Burgonya",
        name_EN: "Potato",
        typeId: 1,
        unit: "darab",
        image: "https://bgs.jedlik.eu/ml/Images/Items/potato.jfif"
      },
      {
      id: 2,
      name: "Paradicsom",
      name_EN: "Tomato",
      typeId: 1,
      unit: "darab",
      image: "https://bgs.jedlik.eu/ml/Images/Items/tomato.jfif"
    },
    {
      id: 3,
      name: "Alma",
      name_EN: "Apple",
      typeId: 2,
      unit: "darab",
      image: "https://bgs.jedlik.eu/ml/Images/Items/apple.jfif"
    }]
  });

  await prisma.recipes.createMany({
    data: [{
      id: 1,
      name: "Teszt Bolognai",
      name_EN: "Test Bolognese",
      description: "Teszt lépés#Teszt lépés 2#Teszt lépés 3#Teszt lépés 4",
      description_EN: "Test step 1#Test step 2#Test step 3#Test step 4",
      type: "ITA",
      difficulty: 5,
      time: 80,
      image: "https://bgs.jedlik.eu/ml/Images/recipes/bolognai.jpg"
    },
    {
      id: 2,
      name: "Teszt Almák",
      name_EN: "Test Apples",
      description: "Teszt lépés#Teszt lépés 2",
      description_EN: "Test step 1#Test step 2",
      type: "HUN",
      difficulty: 1,
      time: 10,
      image: "https://bgs.jedlik.eu/ml/Images/recipes/almaspite.jpg"
    }]
  });

  await prisma.contains.createMany({
    data: [{
      id: 1,
      recipeId: 1,
      itemId: 2,
      quantity: 2
    },
    {
      id: 2,
      recipeId: 2,
      itemId: 3,
      quantity: 20
    }]
  }),
  await prisma.stores.createMany({
    data: [{
      id: 1,
      userId: 2,
      itemId: 2,
      quantity: 2
    }, 
    {
      id: 2,
      userId: 2,
      itemId: 3,
      quantity: 5
    }]
  });
};

main().then(() => {
  console.log('seeded database');
  process.exit(0);
});
