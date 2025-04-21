// Contains definitions for crafted food items
export const foodRecipes = {
    'рыбные_консервы': {
        name_ru: 'Рыбные консервы',
        name_uk: 'Рибні консерви',
        name_en: 'Canned Fish',
        craftable: true,
        yield: 4,
        energyCost: 500,
        avgPrice: 0,
        ingredients: [
            { itemId: 'консервная_банка', quantity: 1 },
            { itemId: 'рыбное_филе', quantity: 1 },
            { itemId: 'бутылка_чистой_воды', quantity: 1 },
        ]
    },
    'шпроты': {
        name_ru: 'Шпроты',
        name_uk: 'Шпроти',
        name_en: 'Sprats',
        craftable: true,
        yield: 7,
        energyCost: 600,
        avgPrice: 0,
        ingredients: [
            { itemId: 'консервная_банка', quantity: 2 },
            { itemId: 'набор_специй', quantity: 5 },
            { itemId: 'кислотная_крапива', quantity: 10 },
            { itemId: 'рыбные_консервы', quantity: 1 },
        ]
    },
    'фасолевый_суп': {
        name_ru: 'Фасолевый суп',
        name_uk: 'Квасолевий суп',
        name_en: 'Bean Soup',
        craftable: true,
        yield: 2,
        energyCost: 800,
        avgPrice: 0,
        ingredients: [
            { itemId: 'бутылка_чистой_воды', quantity: 2 },
            { itemId: 'термическая_смесь', quantity: 1 },
            { itemId: 'консервированная_фасоль', quantity: 3 },
            { itemId: 'шпроты', quantity: 2 },
        ]
    },
    'мясная_консерва': {
        name_ru: 'Мясная консерва',
        name_uk: 'М\'ясна консерва',
        name_en: 'Canned Meat',
        craftable: true,
        yield: 7,
        energyCost: 400,
        avgPrice: 0,
        ingredients: [
            { itemId: 'консервная_банка', quantity: 5 },
            { itemId: 'фарш_из_собаки', quantity: 1 },
            { itemId: 'фарш_из_хрюши', quantity: 1 },
        ]
    },
    'колбасная_нарезка': {
        name_ru: 'Колбасная нарезка',
        name_uk: 'Ковбасна нарізка',
        name_en: 'Sliced Sausage',
        craftable: true,
        yield: 24,
        energyCost: 500,
        avgPrice: 0,
        ingredients: [
            { itemId: 'фарш_из_собаки', quantity: 2 },
            { itemId: 'фарш_из_хрюши', quantity: 2 },
            { itemId: 'фарш_из_кабана', quantity: 2 },
            { itemId: 'набор_специй', quantity: 1 },
            { itemId: 'животный_жир', quantity: 1 }
        ]
    },
    'отличная_тушенка': {
        name_ru: 'Отличная тушенка',
        name_uk: 'Відмінна тушонка',
        name_en: 'Excellent Stew',
        craftable: true,
        yield: 5,
        energyCost: 600,
        avgPrice: 0,
        ingredients: [
            { itemId: 'консервная_банка', quantity: 3 },
            { itemId: 'набор_специй', quantity: 1 },
            { itemId: 'животный_жир', quantity: 1 },
            { itemId: 'мясная_консерва', quantity: 1 },
            { itemId: 'колбасная_нарезка', quantity: 1 },
        ]
    },
    'жаркое_из_мутанта': {
        name_ru: 'Жаркое из мутанта',
        name_uk: 'Печеня з мутанта',
        name_en: 'Mutant Roast',
        craftable: true,
        yield: 15,
        energyCost: 800,
        avgPrice: 0,
        ingredients: [
            { itemId: 'протертые_овощи', quantity: 6 },
            { itemId: 'термическая_смесь', quantity: 1 },
            { itemId: 'отличная_тушенка', quantity: 1 },
            { itemId: 'гипофиз_мертвеца', quantity: 1 },
        ]
    },
    'хорог': {
        name_ru: 'Хорог',
        name_uk: 'Хорог',
        name_en: 'Horog',
        craftable: true,
        yield: 2,
        energyCost: 1000,
        avgPrice: 0,
        ingredients: [
            { itemId: 'консервная_банка', quantity: 1 },
            { itemId: 'животный_жир', quantity: 1 },
            { itemId: 'фасолевый_суп', quantity: 1 },
            { itemId: 'жаркое_из_мутанта', quantity: 1 },
        ]
    },
    'чесночный_суп': {
        name_ru: 'Чесночный суп',
        name_uk: 'Часниковий суп',
        name_en: 'Garlic Soup',
        craftable: true,
        yield: 6,
        energyCost: 1100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'чеснок', quantity: 6 },
            { itemId: 'термическая_смесь', quantity: 1 },
            { itemId: 'фасолевый_суп', quantity: 3 },
            { itemId: 'хорог', quantity: 4 },
        ]
    },
    'армейские_галеты': {
        name_ru: 'Армейские галеты',
        name_uk: 'Армійські галети',
        name_en: 'Army Biscuits',
        craftable: true,
        yield: 4,
        energyCost: 500,
        avgPrice: 0,
        ingredients: [
            { itemId: 'молоко', quantity: 2 },
            { itemId: 'дрожжи', quantity: 1 },
            { itemId: 'тесто', quantity: 2 },
            { itemId: 'набор_специй', quantity: 1 },
            { itemId: 'кислотная_крапива', quantity: 5 },
        ]
    },
    'боевой_горох': {
        name_ru: 'Боевой горох',
        name_uk: 'Бойовий горох',
        name_en: 'Combat Peas',
        craftable: true,
        yield: 6,
        energyCost: 500,
        avgPrice: 0,
        ingredients: [
            { itemId: 'банка_с_горохом', quantity: 3 },
            { itemId: 'порох', quantity: 1 },
            { itemId: 'набор_специй', quantity: 2 },
            { itemId: 'кислотная_крапива', quantity: 15 },
        ]
    },
    'каша_гороховая_с_мясом': {
        name_ru: 'Каша гороховая с мясом',
        name_uk: 'Каша горохова з м\'ясом',
        name_en: 'Pea Porridge with Meat',
        craftable: true,
        yield: 2,
        energyCost: 1000,
        avgPrice: 0,
        ingredients: [
            { itemId: 'набор_специй', quantity: 1 },
            { itemId: 'боевой_горох', quantity: 2 },
            { itemId: 'отличная_тушенка', quantity: 2 },
        ]
    },
    'гороховый_суп': {
        name_ru: 'Гороховый суп',
        name_uk: 'Гороховий суп',
        name_en: 'Pea Soup',
        craftable: true,
        yield: 5,
        energyCost: 1100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'бутылка_чистой_воды', quantity: 4 },
            { itemId: 'протертые_овощи', quantity: 4 },
            { itemId: 'термическая_смесь', quantity: 1 },
            { itemId: 'каша_гороховая_с_мясом', quantity: 4 },
        ]
    },
    'солянка': {
        name_ru: 'Солянка',
        name_uk: 'Солянка',
        name_en: 'Solyanka',
        craftable: true,
        yield: 5,
        energyCost: 1100,
        avgPrice: 0,
        ingredients: [
            { itemId: 'банка_с_пшеном', quantity: 4 },
            { itemId: 'термическая_смесь', quantity: 1 },
            { itemId: 'животный_жир', quantity: 2 },
            { itemId: 'колбасная_нарезка', quantity: 4 },
            { itemId: 'хорог', quantity: 3 },
        ]
    },
};