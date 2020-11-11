CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table product (
    id              uuid primary key default uuid_generate_v4(),
    title           text not null,
    description     text,
    price           integer
);

create table stock (
    product_id      uuid references product(id),
    count           integer
);

insert into product (title, description, price) values ('Бэтмен, Который Смеется', 'БЭТМЕН, КОТОРЫЙ СМЕЕТСЯ… ЭТО БЭТМЕН, КОТОРЫЙ ВСЕГДА ПОБЕЖДАЕТ!\nВ Готэме снова происходит что-то странное: в ходе очередного расследования Бэтмен обнаруживает труп... Брюса Уэйна? Но как такое возможно? Кто этот еще один Брюс Уэйн? И пока Темный Рыцарь пытается найти ответы на эти вопросы, в Аркхеме происходит покушение на Джокера...', 858);
insert into product (title, description, price) values ('The Sandman. Песочный человек', '«Песочный человек» – это умный и глубокий эпос, элегантно выписанный Нилом Гейманом и проиллюстрированный сменяющимся составом самых популярных художников в сфере комиксов. Это богатая смесь современного мифа и темной фэнтези, в которой литература о современности, историческая драма и легенды сплетены в единое целое. Сага о Сэндмене включает в себя ряд историй, уникальных для графической литературы, и вы её никогда не забудете.', 819);
insert into product (title, description, price) values ('Джокер. 80 лет знаменитому злодею', 'Клоун-Принц Преступного Мира, смертоносный паяц, носитель хаоса и любитель одеваться с иголочки. Его бледное лицо с кроваво-красной улыбкой является в кошмарах многим героям вселенной DC. Его происхождение окутано тайной и мифами. И сколько бы его не пробовали запереть в психушке – никакие стены не способны удержать настоящее воплощение безумия!..\n', 718);
insert into product (title, description, price) values ('Кризис героев', 'С ПОДОБНЫМ КРИЗИСОМ ГЕРОИ ЕЩЕ НЕ СТАЛКИВАЛИСЬ!\nДобро пожаловать в Убежище! Это строго засекреченный, единственный в своем роде реабилитационный центр для супергероев, построенный Бэтменом, Суперменом и Чудо-Женщиной. Здесь с помощью самых передовых технологий супергерои залечивают свои раны и травмы, восстанавливаясь после бесконечной битвы со злом, чтобы затем с новыми силами вернуться на поле боя.', 859);
insert into product (title, description, price) values ('Чудо-Женщина. Гикетейя', 'Гикетейя – древнегреческий обряд, связывающий господина и слугу отношениями взаимного уважения и служения.\nПринцесса Диана Фемискирская, которую большой мир знает как великолепную Чудо-Женщину, вынуждена укрывать у себя Даниэллу Уэллис – хорошую девушку с плохим прошлым. Чудо-Женщина обязана защищать и наставлять свою просительницу, поскольку гикетейя – это договоренность, которую нельзя нарушить, не рискуя навлечь на себя гнев богов.', 718);
insert into product (title, description, price) values ('Сорвиголова Фрэнка Миллера. Том 3', 'На страницах третьего (и заключительного!) тома о приключениях Человека без страха, легенды комикс-индустрии Фрэнк Миллер и Клаус Янсон подготовят для Сорвиголовы воистину смертельные испытания! Ведь за его учителем Стиком охотится клан ниндзя \"Рука\", а Мэтт Мёрдок ничем не может ему помочь, ведь его способности вышли из-под контроля! Так что Стику сначала придётся выручать Дьявола Адской кухни, а потом уже вербовать его в свою команду!', 1371);
insert into product (title, description, price) values ('Диво Чудное. Том 2', 'Продолжение серии суперуспешных артбуков «Сказки Старой Руси» и «Диво Чудное. Том 1», суммарный тираж которых приближается к тридцати тысячам.\nФэнтези-интерпретации давно знакомых и любимых сказочных персонажей.', 1015);
insert into product (title, description, price) values ('The Boys: Пацаны. Том 1. Самое главное', 'Правосудие для всех. Возмездие — для невинных.\nСупергерои не делятся на «плохих» и «хороших». Они — разные. И похожи на нас.\nЧитайте первый том, чтобы знать подноготную «суперов» и причуды яркой команды.\n', 549);

insert into stock (product_id, count) select id, 10 from product where title = 'Бэтмен, Который Смеется';
insert into stock (product_id, count) select id, 11 from product where title = 'The Sandman. Песочный человек';
insert into stock (product_id, count) select id, 12 from product where title = 'Джокер. 80 лет знаменитому злодею';
insert into stock (product_id, count) select id, 9 from product where title = 'Кризис героев';
insert into stock (product_id, count) select id, 5 from product where title = 'Чудо-Женщина. Гикетейя';
insert into stock (product_id, count) select id, 15 from product where title = 'Сорвиголова Фрэнка Миллера. Том 3';
insert into stock (product_id, count) select id, 4 from product where title = 'Диво Чудное. Том 2';
insert into stock (product_id, count) select id, 1 from product where title = 'The Boys: Пацаны. Том 1. Самое главное';