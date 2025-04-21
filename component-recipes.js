export const componentRecipes = {
    'пластиковая_бутылка': {
        name_ru: 'Пластиковая бутылка',
        name_uk: 'Пластикова пляшка',
        name_en: 'Plastic Bottle',
        craftable: true,
        yield: 4,
        energyCost: 100,
        avgPrice: 50,
        ingredients: [
            { itemId: 'полимер', quantity: 1 },
        ]
    },
    'полимер': {
        name_ru: 'Полимер',
        name_uk: 'Полімер',
        name_en: 'Polymer',
        craftable: true,
        yield: 19,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'копыто_сильного_кабана', quantity: 5 },
        ]
    },
    'термическая_смесь': {
        name_ru: 'Термическая смесь',
        name_uk: 'Термічна суміш',
        name_en: 'Thermite Mixture',
        craftable: true,
        yield: 21,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'огромный_артефактный_фрагмент', quantity: 1 },
            { itemId: 'странный_артефакт', quantity: 1 },
        ]
    },
    'бутылка_чистой_воды': {
        name_ru: 'Бутылка чистой воды',
        name_uk: 'Пляшка чистої води',
        name_en: 'Bottle of Clean Water',
        craftable: true,
        yield: 5,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'пластиковая_бутылка', quantity: 5 },
            { itemId: 'водонос', quantity: 10 },
        ]
    },
    'железо': {
        name_ru: 'Железо',
        name_uk: 'Залізо',
        name_en: 'Iron',
        craftable: true,
        yield: 50,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'прибор_шепота', quantity: 1 },
            { itemId: 'реагент', quantity: 1 },
        ]
    },
    'консервная_банка': {
        name_ru: 'Консервная банка',
        name_uk: 'Консервна банка',
        name_en: 'Tin Can',
        craftable: true,
        yield: 3,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'железо', quantity: 1 },
        ]
    },
    'набор_специй': {
        name_ru: 'Набор специй',
        name_uk: 'Набір спецій',
        name_en: 'Spice Set',
        craftable: true,
        yield: 10,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'солевик', quantity: 6 },
            { itemId: 'сластена', quantity: 6 },
            { itemId: 'бледнолист', quantity: 10 },
            { itemId: 'кислотная_крапива', quantity: 7 },
        ]
    },
    'рыбное_филе': {
        name_ru: 'Рыбное филе',
        name_uk: 'Рибне філе',
        name_en: 'Fish Fillet',
        craftable: true,
        yield: 4,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'полутухлая_рыба', quantity: 1 },
            { itemId: 'водонос', quantity: 10 },
        ]
    },
    'животный_жир': {
        name_ru: 'Животный жир',
        name_uk: 'Тваринний жир',
        name_en: 'Animal Fat',
        craftable: true,
        yield: 3,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'мясо_хрюши', quantity: 1 },
        ]
    },
    'протертые_овощи': {
        name_ru: 'Протертые овощи',
        name_uk: 'Протерті овочі',
        name_en: 'Grated Vegetables',
        craftable: true,
        yield: 5,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'помидор', quantity: 10 },
            { itemId: 'чеснок', quantity: 2 },
            { itemId: 'бледнолист', quantity: 10 },
            { itemId: 'кислотная_крапива', quantity: 10 },
        ]
    },
    'фарш_из_собаки': {
        name_ru: 'Фарш из собаки',
        name_uk: 'Фарш із собаки',
        name_en: 'Minced Dog Meat',
        craftable: true,
        yield: 5,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'мясо_шавки', quantity: 2 },
            { itemId: 'набор_специй', quantity: 3 },
        ]
    },
    'фарш_из_хрюши': {
        name_ru: 'Фарш из хрюши',
        name_uk: 'Фарш із хрюші',
        name_en: 'Minced Grunt Meat',
        craftable: true,
        yield: 5,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'мясо_хрюши', quantity: 2 },
            { itemId: 'набор_специй', quantity: 3 },
        ]
    },
    'фарш_из_кабана': {
        name_ru: 'Фарш из кабана',
        name_uk: 'Фарш із кабана',
        name_en: 'Minced Boar Meat',
        craftable: true,
        yield: 5,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'мясо_кабана', quantity: 2 },
            { itemId: 'набор_специй', quantity: 3 },
        ]
    },
    'мука': {
        name_ru: 'Мука',
        name_uk: 'Мука',
        name_en: 'Flour',
        craftable: true,
        yield: 8,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'бледнолист', quantity: 5 },
        ]
    },
    'тесто': {
        name_ru: 'Тесто',
        name_uk: 'Тісто',
        name_en: 'Dough',
        craftable: true,
        yield: 3,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'дрожжи', quantity: 5 },
            { itemId: 'мука', quantity: 3 },
            { itemId: 'бутылка_чистой_воды', quantity: 3 },
        ]
    },
    'древесный_уголь': {
        name_ru: 'Древесный уголь',
        name_uk: 'Деревне вугілля',
        name_en: 'Charcoal',
        craftable: true,
        yield: 5,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'гнилая_доска', quantity: 3 },
            { itemId: 'термическая_смесь', quantity: 1 },
        ]
    },
    'защитное_снаряжение': {
        name_ru: 'Защитное снаряжение',
        name_uk: 'Захисне спорядження',
        name_en: 'Protective Gear',
        craftable: true,
        yield: 25,
        energyCost: 200,
        avgPrice: 0,
        ingredients: [
            { itemId: 'ткань', quantity: 5 },
            { itemId: 'термическая_смесь', quantity: 10 },
            { itemId: 'темный_лимб', quantity: 1 },
        ]
    },
    'аммиак': {
        name_ru: 'Аммиак',
        name_uk: 'Аміак',
        name_en: 'Ammonia',
        craftable: true,
        yield: 1,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'полутухлая_рыба', quantity: 3 },
        ]
    },
    'азотная_кислота': {
        name_ru: 'Азотная кислота',
        name_uk: 'Азотна кислота',
        name_en: 'Nitric Acid',
        craftable: true,
        yield: 8,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'аммиак', quantity: 5 },
            { itemId: 'бутылка_чистой_воды', quantity: 5 },
            { itemId: 'железо', quantity: 2 },
            { itemId: 'защитное_снаряжение', quantity: 1 },
        ]
    },
    'порох': {
        name_ru: 'Порох',
        name_uk: 'Порох',
        name_en: 'Gunpowder',
        craftable: true,
        yield: 8,
        energyCost: 500,
        avgPrice: 0,
        ingredients: [
            { itemId: 'азотная_кислота', quantity: 3 },
            { itemId: 'древесный_уголь', quantity: 3 },
            { itemId: 'термическая_смесь', quantity: 1 },
        ]
    },
    'электросмесь': {
        name_ru: 'Электросмесь',
        name_uk: 'Електросуміш',
        name_en: 'Electro Compound',
        craftable: true,
        yield: 64,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'реагент', quantity: 1 },
            { itemId: 'очищенное_вещество', quantity: 1 },
        ]
    },
    'водород': {
        name_ru: 'Водород',
        name_uk: 'Водень',
        name_en: 'Hydrogen',
        craftable: true,
        yield: 7,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'солевик', quantity: 50 },
            { itemId: 'электросмесь', quantity: 1 },
            { itemId: 'бутылка_чистой_воды', quantity: 1 },
        ]
    },
    'нефтяной_кокс': {
        name_ru: 'Нефтяной кокс',
        name_uk: 'Нафтовий кокс',
        name_en: 'Petroleum Coke',
        craftable: true,
        yield: 12,
        energyCost: 100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'нефть', quantity: 1 },
            { itemId: 'реагент', quantity: 3 },
        ]
    },
    'углекислый_газ': {
        name_ru: 'Углекислый газ',
        name_uk: 'Вуглекислий газ',
        name_en: 'Carbon Dioxide',
        craftable: true,
        yield: 8,
        energyCost: 300,
        avgPrice: 0,
        ingredients: [
            { itemId: 'нефтяной_кокс', quantity: 1 },
            { itemId: 'термическая_смесь', quantity: 1 },
        ]
    },
    'метан': {
        name_ru: 'Метан',
        name_uk: 'Метан',
        name_en: 'Methane',
        craftable: true,
        yield: 6,
        energyCost: 600,
        avgPrice: 0,
        ingredients: [
            { itemId: 'углекислый_газ', quantity: 5 },
            { itemId: 'реагент', quantity: 2 },
            { itemId: 'водород', quantity: 3 },
        ]
    },
    'газовый_балон': {
        name_ru: 'Газовый балон',
        name_uk: 'Газовий балон',
        name_en: 'Gas Canister',
        craftable: true,
        yield: 5,
        energyCost: 400,
        avgPrice: 0,
        ingredients: [
            { itemId: 'железо', quantity: 5 },
            { itemId: 'метан', quantity: 2 },
        ]
    },
};