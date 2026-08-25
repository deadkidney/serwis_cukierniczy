--
-- PostgreSQL database dump
--

\restrict iqi0rzoddIQnYoqoDNuECVKG68JjeWebSKlXG8LmF53a8YHuICCsvsG9IN9cu4P

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.recipes DROP CONSTRAINT recipes_user_id_fkey;
ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_user_id_fkey;
ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_recipe_id_fkey;
ALTER TABLE ONLY public.favourites DROP CONSTRAINT favourites_user_id_fkey;
ALTER TABLE ONLY public.favourites DROP CONSTRAINT favourites_recipe_id_fkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_user_id_fkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_recipe_id_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
ALTER TABLE ONLY public.recipes DROP CONSTRAINT recipes_pkey;
ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_pkey;
ALTER TABLE ONLY public.favourites DROP CONSTRAINT favourites_pkey;
ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.recipes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.ratings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.favourites ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.tags_id_seq;
DROP TABLE public.tags;
DROP SEQUENCE public.recipes_id_seq;
DROP TABLE public.recipes;
DROP SEQUENCE public.ratings_id_seq;
DROP TABLE public.ratings;
DROP SEQUENCE public.favourites_id_seq;
DROP TABLE public.favourites;
DROP SEQUENCE public.comments_id_seq;
DROP TABLE public.comments;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    user_id integer NOT NULL,
    content text
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: favourites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favourites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    recipe_id integer NOT NULL
);


--
-- Name: favourites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favourites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favourites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favourites_id_seq OWNED BY public.favourites.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    recipe_id integer NOT NULL,
    value integer
);


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    user_id integer NOT NULL,
    ingredients text,
    content text,
    portions integer,
    tags text[],
    accepted boolean
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(150) NOT NULL,
    passwordhash character varying(150) NOT NULL,
    role text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: favourites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourites ALTER COLUMN id SET DEFAULT nextval('public.favourites_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, recipe_id, user_id, content) FROM stdin;
1	13	3	Essential for every birthday cake.
2	12	3	Great cream, thanks for the recipe.
3	1	3	Ah yes, a classic.
5	7	3	O, very interesting idea.
6	5	3	Cocoa was just the thing your easy sponge cake needed
7	13	2	I can never get this one right. Check the easy sponge cake on my profile.
8	11	2	Meringues never work out for me, but with this recipe they came out perfect.
9	13	4	Hi. This one requires patience and practice for the additional fluffiness. \nYour Easy Sponge Cake is great for beginners and when you don't have the time.
11	13	5	Mine came out just right. Natural talent right here 😉
14	7	5	Great cream. Made for one of the best birthday cakes I've eaten
15	1	5	Essential for every cake-maker
\.


--
-- Data for Name: favourites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favourites (id, user_id, recipe_id) FROM stdin;
1	2	9
2	2	10
3	2	1
4	4	5
5	4	7
6	4	10
7	5	13
8	5	12
9	5	9
10	5	10
11	5	7
12	5	3
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (id, user_id, recipe_id, value) FROM stdin;
1	3	13	5
2	3	12	5
3	3	1	4
5	3	7	5
6	3	4	4
7	3	5	5
10	2	13	3
11	2	12	4
12	2	11	5
13	2	6	4
14	2	1	5
15	2	9	5
16	4	5	4
17	4	7	5
18	4	10	4
19	4	3	4
20	4	4	4
24	5	13	5
25	5	9	4
26	5	10	5
27	5	7	5
29	5	3	4
30	5	1	5
31	1	13	5
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, title, user_id, ingredients, content, portions, tags, accepted) FROM stdin;
4	Easy Sponge Cake	2	[{"id":1,"name":"eggs","amount":"4","unit":"piece"},{"id":2,"name":"sugar","amount":"100","unit":"g"},{"id":3,"name":"flour","amount":"100","unit":"g"},{"id":4,"name":"baking powder","amount":"3","unit":"teaspoons"},{"id":5,"name":"potato starch","amount":"3","unit":"tablespoons"}]	For 8 portions use 23cm round pan.\n\nBeat the eggs with sugar.\n\nGently mix in the flour, baking powder and starch. \n\nBake in 180°C (top and bottom heat) for 30 mins.	8	{cake,vegetarian,"lactose free"}	t
9	Jelly foam with fruits	3	[{"id":6,"name":"red-fruit jelly mix (I like to use cherry flavour)","amount":"55","unit":"g"},{"id":7,"name":"boiling water","amount":"200","unit":"ml"},{"id":10,"name":"yoghurt (lactose-free)","amount":"200","unit":"g"},{"id":11,"name":"red fruits (I like to use raspberries)","amount":"250","unit":"g"}]	Mix the boiling water with the jelly powder. Let it cool down until it is half-set.\n\nBeat the yoghurt. Continue beating gradually adding the jelly.\n\nMix with the fruits and pour into containers.\n\nAlternatively pour (4 portions) over a 20cm round cake in the pan or over a 26cm round cake, let it set and top with a layer of clear jelly.	4	{"lactose free","cream or filling","gluten free"}	t
5	Easy Cocoa Sponge Cake	2	[{"id":1,"name":"eggs","amount":"4","unit":"piece"},{"id":2,"name":"sugar","amount":"100","unit":"g"},{"id":3,"name":"flour","amount":"100","unit":"g"},{"id":4,"name":"baking powder","amount":"3","unit":"teaspoons"}]	For 8 portions use 23cm round pan.\n\nBeat the eggs with sugar.\n\nGently mix in the flour, baking powder and cocoa. \n\nBake in 180°C (top and bottom heat) for 30 mins.	8	{cake,vegetarian,"lactose free"}	t
7	Oreo Cream	2	[{"id":5,"name":"sweet cream 32%","amount":"330","unit":"ml"},{"id":6,"name":"mascarpone","amount":"250","unit":"g"},{"id":7,"name":"sugar","amount":"40","unit":"g"},{"id":8,"name":"oreo cookies (or equivalent)","amount":"15","unit":"piece"}]	Blend the cookies\n\nBeat the mascarpone and cream with sugar in one bowl.\n\nAdd the to the cream and mix.\n\nPut on a cake and put in the fridge for 2 hours.	6	{"cream or filling",vegetarian}	t
1	Vanilla Cream	4	[{"id":1,"name":"sweet cream (30% or more), chilled for at least 10hrs ","amount":"250","unit":"ml"},{"id":2,"name":"mascarpone","amount":"250","unit":"g"},{"id":3,"name":"vanillin sugar","amount":"2","unit":"teaspoons"},{"id":4,"name":"sugar","amount":"20","unit":"g"}]	Mix and beat all the ingredients.\n\nPut on a cake and let it chill for at least 1hr.	5	{"cream or filling",vegetarian,"gluten free"}	t
12	Chocolate Cream	4	[{"id":1,"name":"sweet cream (30% or more), chilled for at least 10hrs ","amount":"250","unit":"ml"},{"id":2,"name":"mascarpone","amount":"250","unit":"g"},{"id":3,"name":"fine sugar","amount":"30","unit":"g"},{"id":4,"name":"dark chocolate","amount":"100","unit":"g"}]	Melt the chocolate in a water bath.\n\nBeat the mascarpone. Gradually add the warm chocolate while mixing thoroughly.\n\nBeat the cream with sugar in a separate bowl. \n\nGradually add the cream to the mascarpone while folding gently.\n\nPut on a cake and let it chill for at least 1hr.	5	{"cream or filling",vegetarian,"gluten free"}	t
6	Strawberry Cream	4	[{"id":1,"name":"sweet cream (30% or more), chilled for at least 10hrs ","amount":"250","unit":"ml"},{"id":2,"name":"mascarpone","amount":"250","unit":"g"},{"id":3,"name":"fine sugar","amount":"30","unit":"g"},{"id":5,"name":"gelatin","amount":1,"unit":"teaspoons"},{"id":6,"name":"warm water","amount":1,"unit":"tablespoons"},{"id":7,"name":"frozen or fresh stawberries","amount":"250","unit":"g"}]	If you are using frozen strawberries, let them thaw out.\n\nMix the gelatin with warm water, let it set for 15 mins.\n\nBlend the fruits and add the gelatin mix.\n\nBeat the mascarpone and cream with sugar in one bowl.\n\nAdd the fruits to the cream and mix thoroughly but gently.\n\nPut on a cake and let it chill for at least 1hr.	5	{"cream or filling","gluten free"}	t
2	Crumble topping	2	[{"id":1,"name":"butter","amount":"80","unit":"g"},{"id":2,"name":"sugar","amount":"80","unit":"g"},{"id":3,"name":"flour","amount":"120","unit":"g"}]	Mix cold butter with sugar and flour to a smooth paste. \n\nCrumble over a cake.\n\nBake for at least 30 minutes.	2	{topping,vegetarian}	t
10	Brownie	3	[{"id":1,"name":"butter","amount":"100","unit":"g"},{"id":2,"name":"dark chocolate","amount":"100","unit":"g"},{"id":3,"name":"eggs","amount":"2","unit":"piece"},{"id":4,"name":"sugar","amount":"70","unit":"g"},{"id":5,"name":"flour","amount":"70","unit":"g"},{"id":6,"name":"pinch of salt","amount":1,"unit":"piece"}]	Melt the butter and the chocolate.\n\nBeat the eggs with sugar.\n\nAdd the chocolate and flour to the eggs and mix well.\n\nBake for 35 minutes in 160 degrees C. 	4	{cake,vegetarian}	t
3	Coffe cream	2	[{"id":1,"name":"gelatin","amount":"1","unit":"tablespoons"},{"id":2,"name":"warm watter","amount":"2","unit":"tablespoons"},{"id":3,"name":"strong coffee","amount":"190","unit":"ml"},{"id":4,"name":"sugar","amount":"2","unit":"tablespoons"},{"id":5,"name":"mascarpone","amount":"250","unit":"g"},{"id":6,"name":"sweet cream 32%","amount":"250","unit":"g"}]	Mix the gelatin with water and let it sit for 10 mins.\n\nAdd the sugar and gelatin to the coffee. \n\nBeat the mascarpone. Gradually add to the coffee while mixing.\n\nBeat the cream and add it to the mascarpone. Mix gently.\n\nPut on a cake and let it sit in the fridge for at least 2 hours.	5	{"cream or filling","gluten free"}	t
8	Vegan pumpkin cake	3	[{"id":1,"name":"flour","amount":"2","unit":"cups"},{"id":2,"name":"baking powder","amount":1,"unit":"teaspoons"},{"id":3,"name":"baking soda","amount":"0.5","unit":"teaspoons"},{"id":4,"name":"ginger powder","amount":1,"unit":"teaspoons"},{"id":5,"name":"pumpkin puree","amount":1,"unit":"cups"},{"id":6,"name":"sugar","amount":"110","unit":"g"},{"id":7,"name":"oil","amount":"0.5","unit":"cups"},{"id":8,"name":"water","amount":"0.3","unit":"cups"},{"id":9,"name":"apple vinegar","amount":"2","unit":"tablespoons"}]	In a bowl mix flour, baking powder, baking soda and ginger.\n\nIn another bowl\n\nAdd the dry ingredients to the wet ones. Mix.\n\nBake at 180°C for 40 minutes.	6	{cake,vegetarian,vegan,"lactose free"}	t
13	Traditional Sponge Cake	4	[{"id":1,"name":"eggs, separated","amount":"6","unit":"piece"},{"id":2,"name":"sugar","amount":1,"unit":"cups"},{"id":4,"name":"flour","amount":1,"unit":"cups"},{"id":5,"name":"baking powder","amount":1,"unit":"teaspoons"}]	\nFor 12 portions use one round 28cm cake pan or two 20cm ones.\n\nBeat egg whites, slowly add half of the sugar while beating until stiff.\n\nIn a separate bowl beat egg yolks and the rest of the sugar until foamy.\n\nAdd beaten yolks to the whites while slowly folding with a spatula. \nGradually and slowly fold in the flour and baking powder. \nBe careful as overmixing might deflate the egg whites.\n\nBake in 170°C (convection) for 25-30 mins. Cool completely in the pan. \n\n	12	{cake,vegetarian,"lactose free"}	t
11	Meringues	3	[{"id":1,"name":"egg whites","amount":"4","unit":"piece"},{"id":2,"name":"fine sugar","amount":"200","unit":"g"},{"id":3,"name":"potato starch","amount":1,"unit":"tablespoons"}]	Beat the egg whites until firm.\n\nSlowly add sugar while beating. It is best to add it one spoonful at a time with periods of beating in between.\n\nAdd the starch and gently mix in.\n\nPut puffs onto a baking paper on a large baking tray with either a spoon or a piping bag. \n\nHeat the oven to 180°C.\nPut the meringues in and change the temperature to 150°C. Bake for 90 minutes.	10	{topping,vegetarian,"lactose free","gluten free"}	t
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tags (id, name) FROM stdin;
1	cake
2	cream or filling
4	vegetarian
5	vegan
6	lactose free
3	topping
7	gluten free
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, passwordhash, role) FROM stdin;
1	admin	$2b$10$1Nmh1SA55JLfxSR9HtVl2OupUsNRlPBn7gt2FHkGwOifI1ORErfqG	ADMIN
2	user1	$2b$10$uhJbPqo1n5d8mRzCQbsj1eeBF6n009r3zw9Gx6VCkoe/sZB/gAE8m	USER
3	user2	$2b$10$aBoqGdCwyLOBWaCispyNlOUfBgKQzf8NWr/BC8kAuWaaxtEyi4Uuy	USER
4	user3	$2b$10$j6cV1tYTlldlm4./hiMMLe2i9ajJhoR3dJ9Z75UsU/ZBSPb4BRvVC	USER
5	user4	$2b$10$595.H94BDP6P5cU1d/woUeWA06Ef9UGnEtbsNp5rSImk9PYqm7XPG	USER
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 15, true);


--
-- Name: favourites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favourites_id_seq', 12, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ratings_id_seq', 31, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 13, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: favourites favourites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: favourites favourites_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: favourites favourites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourites
    ADD CONSTRAINT favourites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ratings ratings_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict iqi0rzoddIQnYoqoDNuECVKG68JjeWebSKlXG8LmF53a8YHuICCsvsG9IN9cu4P

\echo Loaded the example database.
\echo 
\echo The database has users with usernames "userN" and passwords "passwordN" where N ranges from 1 to 4.
\echo The database has one admin user with username "admin" and password "admin"
\echo
\echo The database works with JWT secret "example secret"