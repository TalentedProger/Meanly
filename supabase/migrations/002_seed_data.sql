-- ============================================
-- MEANLY Seed Data
-- Sample words for testing
-- ============================================

-- Insert sample words
INSERT INTO public.words (word, base_word, definition, part_of_speech, level, category, is_word_of_day, word_of_day_date) VALUES
('Великолепный', 'Хороший', 'Превосходящий обычный уровень, выдающийся по своим качествам, вызывающий восхищение.', 'прилагательное', 'intermediate', 'everyday', true, CURRENT_DATE),
('Изысканный', 'Красивый', 'Отличающийся тонким вкусом, утончённый, элегантный.', 'прилагательное', 'advanced', 'everyday', false, NULL),
('Превосходный', 'Хороший', 'Исключительно хороший, выделяющийся среди других.', 'прилагательное', 'intermediate', 'everyday', false, NULL),
('Восхитительный', 'Приятный', 'Вызывающий восхищение, приводящий в восторг.', 'прилагательное', 'intermediate', 'everyday', false, NULL),
('Блистательный', 'Яркий', 'Выдающийся, производящий яркое впечатление.', 'прилагательное', 'advanced', 'art', false, NULL),
('Безупречный', 'Хороший', 'Не имеющий недостатков, совершенный.', 'прилагательное', 'advanced', 'business', false, NULL),
('Грандиозный', 'Большой', 'Поражающий воображение своим масштабом или величием.', 'прилагательное', 'intermediate', 'everyday', false, NULL),
('Феноменальный', 'Удивительный', 'Исключительный, необычайный по своим качествам.', 'прилагательное', 'advanced', 'science', false, NULL),
('Вдохновляющий', 'Интересный', 'Побуждающий к творчеству, вызывающий желание действовать.', 'прилагательное', 'intermediate', 'art', false, NULL),
('Впечатляющий', 'Хороший', 'Производящий сильное впечатление, запоминающийся.', 'прилагательное', 'beginner', 'everyday', false, NULL);

-- Get word IDs for examples
DO $$
DECLARE
  word_velikolepny UUID;
  word_izyskanny UUID;
  word_prevoshodny UUID;
BEGIN
  SELECT id INTO word_velikolepny FROM public.words WHERE word = 'Великолепный';
  SELECT id INTO word_izyskanny FROM public.words WHERE word = 'Изысканный';
  SELECT id INTO word_prevoshodny FROM public.words WHERE word = 'Превосходный';
  
  -- Examples for "Великолепный"
  INSERT INTO public.examples (word_id, type, sentence, explanation, order_index) VALUES
  (word_velikolepny, 'good', 'Сегодня был великолепный закат — небо переливалось оттенками розового и золотого.', 'Слово используется для описания чего-то действительно впечатляющего.', 1),
  (word_velikolepny, 'good', 'Оркестр исполнил великолепную симфонию, которая тронула сердца всех слушателей.', 'Подчёркивает высокое качество исполнения.', 2),
  (word_velikolepny, 'bad', 'Великолепный бутерброд был съеден за минуту.', 'Слишком сильное слово для обычного бутерброда.', 1),
  (word_velikolepny, 'before', 'Вчера был хороший день.', NULL, 1),
  (word_velikolepny, 'after', 'Вчера был великолепный день.', NULL, 1),
  (word_velikolepny, 'context', 'Великолепная презентация произвела впечатление на инвесторов.', 'Бизнес', 1),
  (word_velikolepny, 'context', 'Художник создал великолепное полотно в стиле импрессионизма.', 'Искусство', 2),
  (word_velikolepny, 'context', 'Великолепный ужин стал завершением нашего юбилея.', 'Повседневный', 3);
  
  -- Examples for "Изысканный"
  INSERT INTO public.examples (word_id, type, sentence, explanation, order_index) VALUES
  (word_izyskanny, 'good', 'В ресторане подавали изысканные блюда французской кухни.', 'Описывает утончённый вкус и качество.', 1),
  (word_izyskanny, 'good', 'Её изысканный стиль одежды всегда привлекал внимание.', 'Подчёркивает элегантность и вкус.', 2),
  (word_izyskanny, 'bad', 'Изысканный пластиковый стаканчик.', 'Слово не подходит для простых предметов.', 1),
  (word_izyskanny, 'before', 'Она выбрала красивое платье для вечера.', NULL, 1),
  (word_izyskanny, 'after', 'Она выбрала изысканное платье для вечера.', NULL, 1);
  
  -- Examples for "Превосходный"
  INSERT INTO public.examples (word_id, type, sentence, explanation, order_index) VALUES
  (word_prevoshodny, 'good', 'Команда показала превосходный результат в этом квартале.', 'Подчёркивает выдающееся достижение.', 1),
  (word_prevoshodny, 'good', 'Это вино обладает превосходным букетом.', 'Описывает высокое качество.', 2),
  (word_prevoshodny, 'before', 'У него хорошие навыки программирования.', NULL, 1),
  (word_prevoshodny, 'after', 'У него превосходные навыки программирования.', NULL, 1);
END $$;

-- Create sample word packs
INSERT INTO public.word_packs (name, name_ru, description, description_ru, price_tier, word_count, is_featured, order_index) VALUES
('Business Vocabulary', 'Бизнес-лексика', 'Essential words for professional communication', 'Важные слова для профессионального общения', 'free', 25, true, 1),
('Art & Culture', 'Искусство и культура', 'Express yourself about art and culture', 'Выражайтесь об искусстве и культуре', 'free', 20, false, 2),
('Science & Technology', 'Наука и технологии', 'Advanced vocabulary for tech discussions', 'Продвинутая лексика для обсуждения технологий', 'pro', 30, false, 3),
('Emotions & Feelings', 'Эмоции и чувства', 'Rich vocabulary for expressing emotions', 'Богатый словарь для выражения эмоций', 'free', 35, true, 4),
('Interview Success', 'Успешное собеседование', 'Words that impress at job interviews', 'Слова, которые впечатлят на собеседовании', 'pro', 40, true, 5);
