/**
 * MEANLY - Demo Data
 * Демо-данные для локального режима без базы данных
 */

import type { Word, WordExample, ContextProfile } from '../types/word';

// Helper function to create examples
const createExample = (sentence: string, isCorrect: boolean, explanation: string): WordExample => ({
  sentence,
  isCorrect,
  explanation,
});

// Helper function to create context
const createContext = (id: string, situation: string, example: string): ContextProfile => ({
  id,
  situation,
  example,
  tone: 'neutral',
});

// Демо слова для Word of the Day и каталога
export const DEMO_WORDS: Word[] = [
  {
    id: 'word_1',
    word: 'Великолепный',
    baseWord: 'Хороший',
    definition: 'Превосходящий обычный уровень, выдающийся по своим качествам, вызывающий восхищение.',
    partOfSpeech: 'adjective',
    level: 'intermediate',
    categoryId: 'everyday',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Сегодня был великолепный закат — небо переливалось оттенками розового и золотого.',
      true,
      'Слово используется для описания чего-то действительно впечатляющего.'
    ),
    badExample: createExample(
      'Великолепный бутерброд был съеден за минуту.',
      false,
      'Слишком сильное слово для обычного бутерброда.'
    ),
    beforeSentence: 'Вчера был хороший день.',
    afterSentence: 'Вчера был великолепный день.',
    contexts: [
      createContext('ctx_1_1', 'В деловом общении', 'Великолепная презентация произвела впечатление на инвесторов.'),
      createContext('ctx_1_2', 'В искусстве', 'Художник создал великолепное полотно в стиле импрессионизма.'),
      createContext('ctx_1_3', 'В повседневной жизни', 'Великолепный ужин стал завершением нашего юбилея.'),
    ],
    mnemonic: 'Вели-КОЛЕП-ный = как колепа (купола) - возвышенно и красиво',
    synonyms: ['превосходный', 'восхитительный', 'прекрасный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_2',
    word: 'Изысканный',
    baseWord: 'Красивый',
    definition: 'Отличающийся тонким вкусом, утончённый, элегантный.',
    partOfSpeech: 'adjective',
    level: 'advanced',
    categoryId: 'everyday',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'В ресторане подавали изысканные блюда французской кухни.',
      true,
      'Описывает утончённый вкус и качество.'
    ),
    badExample: createExample(
      'Изысканный пластиковый стаканчик.',
      false,
      'Слово не подходит для простых предметов.'
    ),
    beforeSentence: 'Она выбрала красивое платье для вечера.',
    afterSentence: 'Она выбрала изысканное платье для вечера.',
    contexts: [
      createContext('ctx_2_1', 'В моде', 'Её изысканный стиль одежды всегда привлекал внимание.'),
      createContext('ctx_2_2', 'В кулинарии', 'Шеф-повар приготовил изысканный десерт с клубникой.'),
    ],
    mnemonic: 'ИЗ-ЫСК-анный = найденный (изысканный) среди тысяч',
    synonyms: ['утончённый', 'элегантный', 'рафинированный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_3',
    word: 'Превосходный',
    baseWord: 'Хороший',
    definition: 'Исключительно хороший, выделяющийся среди других.',
    partOfSpeech: 'adjective',
    level: 'intermediate',
    categoryId: 'business',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Команда показала превосходный результат в этом квартале.',
      true,
      'Подчёркивает выдающееся достижение.'
    ),
    badExample: createExample(
      'Превосходная погода сегодня, градусов 15.',
      false,
      'Слово избыточно для описания обычной погоды.'
    ),
    beforeSentence: 'У него хорошие навыки программирования.',
    afterSentence: 'У него превосходные навыки программирования.',
    contexts: [
      createContext('ctx_3_1', 'На работе', 'Превосходная работа всей команды привела к успеху проекта.'),
      createContext('ctx_3_2', 'В образовании', 'Студент показал превосходные знания на экзамене.'),
    ],
    mnemonic: 'ПРЕВОС-ходный = переходит других (превосходит)',
    synonyms: ['отличный', 'великолепный', 'блестящий'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_4',
    word: 'Восхитительный',
    baseWord: 'Приятный',
    definition: 'Вызывающий восхищение, приводящий в восторг.',
    partOfSpeech: 'adjective',
    level: 'intermediate',
    categoryId: 'everyday',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Концерт был восхитительным — музыка тронула сердца всех присутствующих.',
      true,
      'Выражает сильную эмоциональную реакцию.'
    ),
    badExample: createExample(
      'Восхитительный обед в столовой.',
      false,
      'Слишком сильное слово для будничного приёма пищи.'
    ),
    beforeSentence: 'Вид из окна был приятным.',
    afterSentence: 'Вид из окна был восхитительным.',
    contexts: [
      createContext('ctx_4_1', 'В путешествиях', 'Восхитительный пейзаж открылся с вершины горы.'),
      createContext('ctx_4_2', 'В искусстве', 'Балет был восхитительным, каждое движение было совершенным.'),
    ],
    mnemonic: 'Вос-ХИТ-ительный = хитит (восхищает) душу',
    synonyms: ['прелестный', 'чудесный', 'дивный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_5',
    word: 'Блистательный',
    baseWord: 'Умный',
    definition: 'Выдающийся, поражающий своими талантами или достижениями.',
    partOfSpeech: 'adjective',
    level: 'advanced',
    categoryId: 'business',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Блистательная карьера учёного началась с открытия нового элемента.',
      true,
      'Подчёркивает выдающиеся достижения.'
    ),
    badExample: createExample(
      'Блистательно почистил зубы сегодня.',
      false,
      'Слово неуместно для простых повседневных действий.'
    ),
    beforeSentence: 'Он дал умный ответ на сложный вопрос.',
    afterSentence: 'Он дал блистательный ответ на сложный вопрос.',
    contexts: [
      createContext('ctx_5_1', 'В карьере', 'Его блистательная речь на конференции запомнилась всем.'),
      createContext('ctx_5_2', 'В науке', 'Блистательное открытие изменило наше понимание физики.'),
    ],
    mnemonic: 'БЛИСТательный = как блеск (блистать)',
    synonyms: ['выдающийся', 'замечательный', 'яркий'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_6',
    word: 'Утончённый',
    baseWord: 'Тонкий',
    definition: 'Отличающийся изяществом, деликатностью, высоким вкусом.',
    partOfSpeech: 'adjective',
    level: 'advanced',
    categoryId: 'art',
    isPro: true,
    isPackWord: false,
    goodExample: createExample(
      'Её утончённые манеры выдавали аристократическое воспитание.',
      true,
      'Подчёркивает изысканность и культуру.'
    ),
    badExample: createExample(
      'Утончённый молоток для забивания гвоздей.',
      false,
      'Слово не применимо к грубым инструментам.'
    ),
    beforeSentence: 'У неё тонкий вкус в музыке.',
    afterSentence: 'У неё утончённый вкус в музыке.',
    contexts: [
      createContext('ctx_6_1', 'В искусстве', 'Утончённая игра актрисы покорила зрителей.'),
      createContext('ctx_6_2', 'В общении', 'Его утончённый юмор понимали не все.'),
    ],
    mnemonic: 'У-ТОНЧ-ённый = как тонкая работа мастера',
    synonyms: ['изящный', 'деликатный', 'рафинированный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_7',
    word: 'Грандиозный',
    baseWord: 'Большой',
    definition: 'Огромный по масштабу, величественный, впечатляющий.',
    partOfSpeech: 'adjective',
    level: 'intermediate',
    categoryId: 'business',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Грандиозный проект потребовал участия сотен специалистов.',
      true,
      'Подчёркивает масштаб и значимость.'
    ),
    badExample: createExample(
      'Грандиозный бутерброд с колбасой.',
      false,
      'Несоразмерное использование слова.'
    ),
    beforeSentence: 'Компания запланировала большое мероприятие.',
    afterSentence: 'Компания запланировала грандиозное мероприятие.',
    contexts: [
      createContext('ctx_7_1', 'В бизнесе', 'Грандиозный запуск продукта привлёк внимание СМИ.'),
      createContext('ctx_7_2', 'В истории', 'Грандиозное строительство пирамид заняло десятилетия.'),
    ],
    mnemonic: 'ГРАНД-иозный = как grand (великий) в других языках',
    synonyms: ['масштабный', 'величественный', 'колоссальный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_8',
    word: 'Феноменальный',
    baseWord: 'Удивительный',
    definition: 'Исключительный, выходящий за рамки обычного, поразительный.',
    partOfSpeech: 'adjective',
    level: 'advanced',
    categoryId: 'science',
    isPro: true,
    isPackWord: false,
    goodExample: createExample(
      'Спортсмен показал феноменальный результат, побив мировой рекорд.',
      true,
      'Используется для действительно исключительных достижений.'
    ),
    badExample: createExample(
      'Феноменальный суп в столовой.',
      false,
      'Слишком сильное слово для обычной еды.'
    ),
    beforeSentence: 'Учёный сделал удивительное открытие.',
    afterSentence: 'Учёный сделал феноменальное открытие.',
    contexts: [
      createContext('ctx_8_1', 'В спорте', 'Феноменальная скорость бегуна поразила зрителей.'),
      createContext('ctx_8_2', 'В науке', 'Феноменальная точность эксперимента подтвердила теорию.'),
    ],
    mnemonic: 'ФЕНОМЕН-альный = как феномен (необычное явление)',
    synonyms: ['поразительный', 'невероятный', 'уникальный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_9',
    word: 'Безупречный',
    baseWord: 'Хороший',
    definition: 'Не имеющий недостатков, идеальный, совершенный.',
    partOfSpeech: 'adjective',
    level: 'intermediate',
    categoryId: 'business',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Его безупречная репутация помогла получить должность.',
      true,
      'Подчёркивает отсутствие каких-либо нареканий.'
    ),
    badExample: createExample(
      'Безупречный черновик с исправлениями.',
      false,
      'Противоречие: черновик по определению не может быть безупречным.'
    ),
    beforeSentence: 'У сотрудника хорошая репутация.',
    afterSentence: 'У сотрудника безупречная репутация.',
    contexts: [
      createContext('ctx_9_1', 'В бизнесе', 'Безупречный сервис стал визитной карточкой отеля.'),
      createContext('ctx_9_2', 'В моде', 'Её безупречный стиль копировали многие.'),
    ],
    mnemonic: 'БЕЗ-УПРЕЧ-ный = без упрёков (нечего упрекнуть)',
    synonyms: ['идеальный', 'совершенный', 'образцовый'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'word_10',
    word: 'Ошеломительный',
    baseWord: 'Сильный',
    definition: 'Производящий очень сильное впечатление, потрясающий.',
    partOfSpeech: 'adjective',
    level: 'beginner',
    categoryId: 'everyday',
    isPro: false,
    isPackWord: false,
    goodExample: createExample(
      'Фильм имел ошеломительный успех в прокате.',
      true,
      'Подчёркивает неожиданно большой успех.'
    ),
    badExample: createExample(
      'Ошеломительный чай с лимоном.',
      false,
      'Слово слишком сильное для обычного напитка.'
    ),
    beforeSentence: 'Новость произвела сильное впечатление.',
    afterSentence: 'Новость произвела ошеломительное впечатление.',
    contexts: [
      createContext('ctx_10_1', 'В кино', 'Ошеломительные спецэффекты сделали фильм хитом.'),
      createContext('ctx_10_2', 'В новостях', 'Ошеломительная новость облетела весь мир.'),
    ],
    mnemonic: 'ОШЕЛОМИ-тельный = как шлем (ошеломить = ударить по шлему)',
    synonyms: ['потрясающий', 'сногсшибательный', 'поразительный'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Получить случайное слово дня из демо-данных
 */
export function getDemoWordOfTheDay(): Word {
  // Используем дату для псевдо-рандомизации
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % DEMO_WORDS.length;
  return DEMO_WORDS[index];
}

/**
 * Получить все демо-слова
 */
export function getAllDemoWords(): Word[] {
  return DEMO_WORDS;
}

/**
 * Получить слова по уровню
 */
export function getDemoWordsByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Word[] {
  return DEMO_WORDS.filter(word => word.level === level);
}

/**
 * Получить слова по категории
 */
export function getDemoWordsByCategory(categoryId: string): Word[] {
  return DEMO_WORDS.filter(word => word.categoryId === categoryId);
}

/**
 * Поиск слов
 */
export function searchDemoWords(query: string): Word[] {
  const lowerQuery = query.toLowerCase();
  return DEMO_WORDS.filter(
    word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.baseWord.toLowerCase().includes(lowerQuery) ||
      word.definition.toLowerCase().includes(lowerQuery)
  );
}
