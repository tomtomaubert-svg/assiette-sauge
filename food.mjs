export const mealTypes = ['Petit-déjeuner', 'Déjeuner', 'Dîner'];

export const foods = {
  whiteRice: ['Riz blanc cuit', 131, 2.7, 28, 0.3],
  regularPasta: ['Pâtes cuites', 146, 5, 28, 0.8],
  greenBeans: ['Haricots verts cuits', 31, 1.8, 3.5, 0.3],
  pepper: ['Poivron', 27, 0.9, 4.6, 0.3],
  redCabbage: ['Chou rouge', 31, 1.4, 5, 0.2],
  sweetPotato: ['Patate douce cuite', 79, 1.7, 16, 0.2],
  friedEgg: ['Œuf au plat', 165, 12.5, 0.5, 12.6],
  plainBread: ['Pain grillé', 282, 9, 54, 2],
  strawberry: ['Fraise', 39, 0.6, 6, 0.5],
  blueberry: ['Myrtille', 57, 0.8, 10.6, 0.3],
  oats: ['Flocons d’avoine', 372, 13, 59, 7],
  yogurt: ['Yaourt nature', 57, 3.7, 4.7, 2.4],
  skyr: ['Skyr nature', 59, 10, 3.7, 0.2],
  banana: ['Banane', 90, 1.1, 20, 0.3],
  apple: ['Pomme', 52, 0.3, 11.6, 0.3],
  berries: ['Fruits rouges', 46, 1, 7.1, 0.5],
  nuts: ['Noix', 698, 15, 7, 67],
  bread: ['Pain complet', 250, 9, 43, 3.4],
  egg: ['Œuf cuit', 144, 13, 0.5, 10],
  avocado: ['Avocat', 165, 1.8, 2, 16],
  chickpea: ['Pois chiches cuits', 147, 8.3, 18, 3],
  lentil: ['Lentilles cuites', 127, 10, 17, 0.6],
  bean: ['Haricots rouges cuits', 115, 8.5, 14, 0.7],
  rice: ['Riz complet cuit', 150, 3.2, 30, 1.1],
  quinoa: ['Quinoa cuit', 137, 5, 23, 2],
  pasta: ['Pâtes complètes cuites', 133, 5, 24, 1.2],
  potato: ['Pomme de terre cuite', 85, 1.8, 18, 0.2],
  carrot: ['Carotte', 38, 0.8, 7, 0.3],
  tomato: ['Tomate', 20, 0.9, 3, 0.3],
  cucumber: ['Concombre', 15, 0.6, 2.3, 0.1],
  greens: ['Salade verte', 17, 1.3, 1.8, 0.3],
  broccoli: ['Brocoli cuit', 28, 2.1, 2.5, 0.8],
  courgette: ['Courgette cuite', 17, 1, 2.5, 0.3],
  chicken: ['Poulet cuit', 165, 31, 0, 3.6],
  salmon: ['Saumon cuit', 205, 23, 0, 12],
  tuna: ['Thon au naturel', 117, 26, 0, 1],
  tofu: ['Tofu nature', 145, 15, 2, 8],
  feta: ['Feta', 285, 15, 1, 24],
  oil: ['Huile d’olive', 900, 0, 0, 100],
  butter: ['Beurre', 744, 0.7, 0.5, 82],
  sauce: ['Sauce tomate', 45, 1.4, 5.7, 1.4],
  pizza: ['Pizza au fromage', 255, 11, 30, 10],
  fries: ['Frites', 270, 3.5, 37, 12],
  burger: ['Hamburger', 260, 13, 25, 12],
  sushi: ['Sushi assortis', 155, 7, 25, 3],
  falafel: ['Falafels', 290, 12, 27, 14],
  hummus: ['Houmous', 210, 7, 14, 14],
  omelette: ['Omelette', 155, 11, 1, 12],
  caesar: ['Salade César garnie', 175, 10, 8, 11],
  pancakes: ['Pancakes nature', 228, 6, 33, 8],
  croissant: ['Croissant', 420, 8, 46, 22],
  bolognese: ['Spaghetti bolognaise', 137, 7, 18, 4],
  ratatouille: ['Ratatouille', 49, 1, 5, 2.5],
  icecream: ['Crème glacée', 210, 4, 24, 11],
  steak: ['Steak grillé', 205, 27, 0, 10],
  soup: ['Soupe de légumes', 36, 1.4, 5.1, 1]
};

const recipe = (name, minutes, photo, ingredients, instruction) => ({name,minutes,photo,ingredients,instruction});

export const recipes = [
 [
  recipe('Bol de skyr aux fruits rouges', 5, 'breakfast', {skyr:170,berries:110,oats:45,nuts:15}, 'Verse le skyr dans un bol. Ajoute les flocons, les fruits rouges et les noix.'),
  recipe('Tartines avocat et œuf', 12, 'toast', {bread:80,avocado:80,egg:100,tomato:90}, 'Fais cuire les œufs. Écrase l’avocat sur le pain grillé et ajoute les tomates.'),
  recipe('Porridge banane et noix', 8, 'breakfast', {oats:55,banana:110,nuts:18,yogurt:100}, 'Fais cuire les flocons avec de l’eau. Ajoute le yaourt, la banane et les noix.'),
  recipe('Tartines au houmous et concombre', 8, 'toast', {bread:90,hummus:75,cucumber:100,apple:130}, 'Tartine le pain de houmous et garnis de concombre. Sers avec la pomme.'),
  recipe('Omelette aux tomates et pain complet', 12, 'toast', {egg:120,tomato:130,bread:70,oil:5}, 'Fais revenir les tomates dans l’huile. Verse les œufs battus et sers avec le pain.'),
  recipe('Muesli pomme et fruits rouges', 5, 'breakfast', {oats:50,apple:120,berries:80,skyr:160}, 'Découpe la pomme. Mélange le skyr et les flocons, puis ajoute les fruits.'),
  recipe('Bol yaourt, banane et avoine', 5, 'breakfast', {yogurt:180,banana:130,oats:55,nuts:15}, 'Coupe la banane, puis assemble le tout dans un bol.'),
  recipe('Tartines à l’œuf et pomme croquante', 10, 'toast', {egg:120,bread:80,yogurt:100,apple:125}, 'Prépare des œufs brouillés, grille le pain et accompagne de yaourt et de pomme.'),
  recipe('Porridge pomme et cannelle', 10, 'breakfast', {oats:55,apple:150,skyr:140,nuts:16}, 'Fais chauffer les flocons avec de l’eau et de la cannelle. Ajoute la pomme, le skyr et les noix.')
 ], [
  recipe('Bol de quinoa et pois chiches', 18, 'hero', {quinoa:150,chickpea:130,tomato:95,cucumber:95,oil:10}, 'Mélange le quinoa cuit, les pois chiches et les crudités. Assaisonne avec l’huile et du citron.'),
  recipe('Salade de lentilles et feta', 15, 'hero', {lentil:170,feta:45,carrot:100,greens:50,oil:10,bread:50}, 'Râpe la carotte, mélange avec les lentilles et la salade. Émiette la feta et sers avec le pain.'),
  recipe('Poulet, riz complet et brocoli', 25, 'hero', {chicken:135,rice:155,broccoli:170,oil:10}, 'Fais cuire le poulet à cœur. Accompagne de riz complet et de brocoli vapeur.'),
  recipe('Pâtes complètes tomate et haricots', 20, 'pasta', {pasta:160,bean:140,sauce:120,courgette:100,oil:8}, 'Fais revenir la courgette. Ajoute les haricots, la tomate et les pâtes cuites.'),
  recipe('Salade de pois chiches et pommes de terre', 20, 'hero', {chickpea:130,potato:160,cucumber:90,tomato:110,oil:10}, 'Fais cuire les pommes de terre. Mélange avec les pois chiches, le concombre et les tomates.'),
  recipe('Bol riz complet, tofu et carottes', 20, 'hero', {rice:160,tofu:135,carrot:120,greens:40,oil:9}, 'Dore le tofu à la poêle. Sers sur le riz avec les carottes râpées et la salade.'),
  recipe('Salade de thon, œuf et pommes de terre', 20, 'hero', {tuna:100,egg:60,potato:175,greens:70,tomato:90,oil:10}, 'Fais cuire l’œuf et les pommes de terre. Assemble avec le thon, la salade et les tomates.'),
  recipe('Bol de lentilles aux tomates et à l’avocat', 12, 'hero', {lentil:175,tomato:120,avocado:70,bread:65,oil:5}, 'Mélange les lentilles avec les tomates et l’avocat. Ajoute l’huile et sers avec le pain.'),
  recipe('Pâtes brocoli, pois chiches et feta', 20, 'pasta', {pasta:160,broccoli:130,chickpea:100,feta:40,oil:9}, 'Ajoute le brocoli vapeur, les pois chiches et la feta aux pâtes égouttées.')
 ], [
  recipe('Saumon rôti et légumes verts', 25, 'dinner', {salmon:145,broccoli:160,potato:170,oil:9}, 'Rôtis le saumon avec un filet d’huile. Accompagne de pommes de terre et de brocoli.'),
  recipe('Soupe de lentilles et carottes', 30, 'soup', {lentil:175,carrot:125,potato:125,oil:9,bread:60}, 'Fais mijoter pommes de terre et carottes dans du bouillon. Ajoute les lentilles cuites et sers avec le pain.'),
  recipe('Tofu doré et quinoa aux courgettes', 24, 'hero', {tofu:145,quinoa:170,courgette:170,oil:9}, 'Dore le tofu, puis poêle la courgette. Sers avec le quinoa et des herbes.'),
  recipe('Œufs à la tomate et haricots rouges', 22, 'soup', {egg:110,bean:120,sauce:140,bread:65,oil:7}, 'Laisse mijoter les haricots avec la tomate, casse les œufs dans la sauce et couvre jusqu’à cuisson.'),
  recipe('Poulet citronné et légumes rôtis', 30, 'hero', {chicken:145,carrot:115,potato:180,courgette:120,oil:10}, 'Rôtis les légumes et le poulet avec de l’huile et du citron, jusqu’à cuisson à cœur.'),
  recipe('Curry de pois chiches et brocoli', 24, 'soup', {chickpea:145,broccoli:150,rice:160,sauce:100,oil:9}, 'Fais mijoter les pois chiches et le brocoli dans la tomate avec du curry. Sers sur le riz.'),
  recipe('Pâtes au thon et courgettes', 18, 'pasta', {pasta:180,tuna:110,courgette:160,sauce:110,oil:8}, 'Poêle les courgettes puis ajoute la sauce, le thon égoutté et les pâtes cuites.'),
  recipe('Chili de haricots au riz complet', 25, 'soup', {bean:170,rice:145,tomato:110,carrot:100,oil:9}, 'Fais mijoter les haricots, les tomates et les carottes avec paprika et cumin. Sers avec le riz.'),
  recipe('Quinoa aux haricots et courgettes', 20, 'hero', {quinoa:170,bean:155,courgette:170,sauce:100,oil:9}, 'Poêle les courgettes, puis ajoute les haricots et la sauce. Sers sur le quinoa.'),
  recipe('Bol chaud de lentilles, œuf et brocoli', 15, 'hero', {lentil:160,egg:100,broccoli:160,bread:65,oil:9}, 'Réchauffe les lentilles et le brocoli. Ajoute les œufs cuits et accompagne de pain.')
 ]
];

export function nutrition(items) {
  return items.reduce((totals, [id, grams]) => totals.map((amount, index) =>
    amount + foods[id][index + 1] * grams / 100
  ), [0, 0, 0, 0]).map(Math.round);
}

export function suitableMeals(slot, profile) {
  const menu = recipes[slot].filter(({ingredients}) => profile?.diet !== 'vegetarien' ||
    ['salmon','tuna','chicken'].every(id => !ingredients[id])
  );
  const quick = profile?.time === 'rapide';
  const weightLoss = profile?.goal === 'perte';
  const active = profile?.activity === 'elevee';
  if (!quick && !weightLoss && !active) return menu;
  const score = ({ingredients, minutes}) => (quick ? Math.max(0, minutes - 15) * 3 : 0) -
    (weightLoss ? (['oats','chickpea','lentil','bean','broccoli','carrot'].filter(id => ingredients[id]).length * 4) : 0) -
    (active ? nutrition(Object.entries(ingredients))[0] / 125 : 0);
  return menu.sort((a,b) => score(a) - score(b));
}

export function generateWeek(profile) {
  return Array.from({length:7}, (_, day) => mealTypes.map((_, slot) => {
    const options = suitableMeals(slot, profile);
    return recipes[slot].indexOf(options[day % options.length]);
  }));
}

export function allowsWeightGoal(profile) {
  const bmi = weight => weight / ((profile.height / 100) ** 2);
  return profile.age >= 18 && !profile.special && bmi(profile.weight) >= 25 &&
    profile.target < profile.weight && bmi(profile.target) >= 18.5;
}
