--
-- PostgreSQL database dump
--

\restrict MJng8JuxZPcqYTYU6xBQ1FdGKNRZbIOoMNjqDEqCAxCiY3DVkun4hIvbHQMttcz

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO "luis.gf";

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO "luis.gf";

--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO "luis.gf";

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.failed_jobs_id_seq OWNER TO "luis.gf";

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO "luis.gf";

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO "luis.gf";

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jobs_id_seq OWNER TO "luis.gf";

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO "luis.gf";

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO "luis.gf";

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: milestones; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.milestones (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    uuid uuid NOT NULL,
    title character varying(160) NOT NULL,
    description text,
    date_year smallint NOT NULL,
    date_month smallint NOT NULL,
    date_week smallint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.milestones OWNER TO "luis.gf";

--
-- Name: milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.milestones_id_seq OWNER TO "luis.gf";

--
-- Name: milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.milestones_id_seq OWNED BY public.milestones.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO "luis.gf";

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO "luis.gf";

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personal_access_tokens_id_seq OWNER TO "luis.gf";

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: project_invitations; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.project_invitations (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    inviter_id bigint NOT NULL,
    invitee_id bigint,
    email character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'member'::character varying NOT NULL,
    token character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    accepted_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT project_invitations_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.project_invitations OWNER TO "luis.gf";

--
-- Name: project_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.project_invitations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_invitations_id_seq OWNER TO "luis.gf";

--
-- Name: project_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.project_invitations_id_seq OWNED BY public.project_invitations.id;


--
-- Name: project_user; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.project_user (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role character varying(32) DEFAULT 'member'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.project_user OWNER TO "luis.gf";

--
-- Name: projects; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.projects (
    id bigint NOT NULL,
    owner_id bigint NOT NULL,
    uuid uuid NOT NULL,
    title character varying(160) NOT NULL,
    description text,
    start_year smallint NOT NULL,
    start_month smallint NOT NULL,
    start_week smallint NOT NULL,
    end_year smallint NOT NULL,
    end_month smallint NOT NULL,
    end_week smallint NOT NULL,
    additional_fields json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.projects OWNER TO "luis.gf";

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO "luis.gf";

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO "luis.gf";

--
-- Name: task_comments; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.task_comments (
    id bigint NOT NULL,
    task_id bigint NOT NULL,
    user_id bigint NOT NULL,
    body text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.task_comments OWNER TO "luis.gf";

--
-- Name: task_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.task_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_comments_id_seq OWNER TO "luis.gf";

--
-- Name: task_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.task_comments_id_seq OWNED BY public.task_comments.id;


--
-- Name: task_user; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.task_user (
    task_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.task_user OWNER TO "luis.gf";

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.tasks (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    assignee_id bigint,
    uuid uuid NOT NULL,
    title character varying(180) NOT NULL,
    description text,
    start_month smallint NOT NULL,
    start_week smallint NOT NULL,
    start_year smallint NOT NULL,
    duration_weeks smallint NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    milestone_uuid uuid,
    priority character varying(255) DEFAULT 'medium'::character varying NOT NULL,
    CONSTRAINT tasks_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))),
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'done'::character varying])::text[])))
);


ALTER TABLE public.tasks OWNER TO "luis.gf";

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO "luis.gf";

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: luis.gf
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    alias character varying(50) NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.users OWNER TO "luis.gf";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: luis.gf
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "luis.gf";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: luis.gf
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: milestones id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.milestones ALTER COLUMN id SET DEFAULT nextval('public.milestones_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: project_invitations id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations ALTER COLUMN id SET DEFAULT nextval('public.project_invitations_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: task_comments id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_comments ALTER COLUMN id SET DEFAULT nextval('public.task_comments_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2025_11_17_195410_create_personal_access_tokens_table	1
5	2025_11_17_195421_create_projects_table	1
6	2025_11_17_195431_create_tasks_table	1
7	2025_11_17_195440_create_project_user_table	1
8	2025_11_17_200000_create_milestones_table	1
9	2025_11_25_000100_add_milestone_uuid_to_tasks_table	1
10	2025_11_30_170000_create_project_invitations_table	1
11	2026_01_10_000200_create_task_user_table	1
12	2026_01_10_000201_add_priority_to_tasks_table	1
13	2026_01_12_000300_add_in_progress_to_task_status	1
14	2026_01_12_000400_create_task_comments_table	1
\.


--
-- Data for Name: milestones; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.milestones (id, project_id, uuid, title, description, date_year, date_month, date_week, created_at, updated_at) FROM stdin;
1	1	94f9c6b2-63ff-4be6-b32a-fcb21ace1021	m1	first	2026	0	1	2026-01-12 21:07:55	2026-01-12 21:07:55
2	1	ed8b793d-e625-4d24-9b57-9d707ac66b30	m2	second	2026	1	1	2026-01-12 21:08:06	2026-01-12 21:08:06
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
3	App\\Persistence\\User\\Entity\\User	1	api	c2b590e986c1caa00413048752e76f711c46d93b0863910b8d5c956ee574e6fd	["*"]	2026-01-12 21:09:50	\N	2026-01-12 21:07:02	2026-01-12 21:09:50
1	App\\Persistence\\User\\Entity\\User	1	api	4f1d517e53f51334a12d2ed5a3b4815975f06e015f4db6803e6d5aae0f039ac1	["*"]	2026-01-12 21:06:25	\N	2026-01-12 20:58:30	2026-01-12 21:06:25
2	App\\Persistence\\User\\Entity\\User	2	api	55d2a47a6bfd25c115d20241c00d8c77a0e27f861dfd1e2b2bed20264dba99a5	["*"]	2026-01-12 21:06:59	\N	2026-01-12 21:06:59	2026-01-12 21:06:59
4	App\\Persistence\\User\\Entity\\User	2	api	18b715eaa371f36e8022c8224adb48f00fd96b3225db5008e8ecdf5c4a954c28	["*"]	2026-01-12 21:10:34	\N	2026-01-12 21:10:30	2026-01-12 21:10:34
7	App\\Persistence\\User\\Entity\\User	1	api	1e501fcacc1e729185a36a155fe2b5392c555f6b3ce9b610eaa5c5c55695e6b0	["*"]	2026-01-12 21:31:41	\N	2026-01-12 21:29:45	2026-01-12 21:31:41
5	App\\Persistence\\User\\Entity\\User	1	api	db3f360511ebc92ee2ad9e327b6a07bb813207a0cbc0d0860df49b8dd9bd717d	["*"]	2026-01-12 21:29:16	\N	2026-01-12 21:10:39	2026-01-12 21:29:16
8	App\\Persistence\\User\\Entity\\User	1	api	b5f4fdeca491545fb7a7ffd7e3d4d4356e07c6d35033a3b69373cf4ade3e5b29	["*"]	2026-01-12 21:42:21	\N	2026-01-12 21:42:21	2026-01-12 21:42:21
6	App\\Persistence\\User\\Entity\\User	2	api	8f99ab9c3e5ee7cd9f0747cdefec5f748e39fab7958deea8ec951716da73ded1	["*"]	2026-01-12 21:29:39	\N	2026-01-12 21:29:22	2026-01-12 21:29:39
\.


--
-- Data for Name: project_invitations; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.project_invitations (id, project_id, inviter_id, invitee_id, email, role, token, status, accepted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_user; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.project_user (project_id, user_id, role, created_at, updated_at) FROM stdin;
1	1	owner	2026-01-12 21:06:20	2026-01-12 21:06:20
1	2	member	2026-01-12 21:07:14	2026-01-12 21:07:14
2	1	owner	2026-01-12 21:13:53	2026-01-12 21:13:53
3	1	owner	2026-01-12 21:29:59	2026-01-12 21:29:59
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.projects (id, owner_id, uuid, title, description, start_year, start_month, start_week, end_year, end_month, end_week, additional_fields, created_at, updated_at) FROM stdin;
2	1	fceebbba-8588-4814-9a3e-e08062967f06	Another Quick blank project	\N	2026	0	1	2026	2	1	[]	2026-01-12 21:13:53	2026-01-12 21:13:53
3	1	b7f105da-f559-48a4-86b2-28deb2e91d25	hello world	\N	2026	0	1	2026	1	1	[]	2026-01-12 21:29:58	2026-01-12 21:30:05
1	1	c6fb5cb8-eba7-40b6-8310-b66fe9fb176b	Roadmap 2026	Primera prueba de proyecto	2026	0	1	2026	2	3	{"owner":"luis","empresa":"esei"}	2026-01-12 21:06:20	2026-01-12 21:31:03
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: task_comments; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.task_comments (id, task_id, user_id, body, created_at, updated_at) FROM stdin;
2	1	2	que tal lgarbayo123	2026-01-12 21:29:39	2026-01-12 21:29:39
1	1	1	hola luismail, qué tal	2026-01-12 21:29:16	2026-01-12 21:31:41
\.


--
-- Data for Name: task_user; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.task_user (task_id, user_id, created_at, updated_at) FROM stdin;
1	1	2026-01-12 21:08:43	2026-01-12 21:08:43
1	2	2026-01-12 21:08:59	2026-01-12 21:08:59
2	2	2026-01-12 21:09:30	2026-01-12 21:09:30
3	1	2026-01-12 21:09:50	2026-01-12 21:09:50
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.tasks (id, project_id, assignee_id, uuid, title, description, start_month, start_week, start_year, duration_weeks, status, created_at, updated_at, milestone_uuid, priority) FROM stdin;
1	1	1	325f63f6-988d-4e93-8273-7dbfe1a4224f	tarea1	\N	0	1	2026	2	in_progress	2026-01-12 21:08:43	2026-01-12 21:09:07	94f9c6b2-63ff-4be6-b32a-fcb21ace1021	medium
2	1	2	e6688629-5818-48e3-bdff-1c1a393da26f	tarea2	\N	1	1	2026	3	pending	2026-01-12 21:09:30	2026-01-12 21:09:30	\N	high
3	1	1	fbc6808e-5c65-4e19-9005-59331836c9ef	tarea_baja	\N	0	1	2026	1	done	2026-01-12 21:09:50	2026-01-12 21:09:50	94f9c6b2-63ff-4be6-b32a-fcb21ace1021	low
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: luis.gf
--

COPY public.users (id, alias, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
1	lgarbayo123	Luis	luis@ejemplo.com	\N	$2y$12$e8giqbcw10ntXohauzOou.sDJpbWHK0L7P59Hqee76api6S2zJrW2	\N	2026-01-12 20:58:30	2026-01-12 20:58:45
2	luismail	luismail	luis@mail.com	\N	$2y$12$N65FWYqJNyRaoM2y0yBcIe/hSz1zimsVEWnnHcq1dhkQlsGqsDc4K	\N	2026-01-12 21:06:59	2026-01-12 21:06:59
\.


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.migrations_id_seq', 14, true);


--
-- Name: milestones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.milestones_id_seq', 2, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 8, true);


--
-- Name: project_invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.project_invitations_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.projects_id_seq', 3, true);


--
-- Name: task_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.task_comments_id_seq', 2, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.tasks_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: luis.gf
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: milestones milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT milestones_pkey PRIMARY KEY (id);


--
-- Name: milestones milestones_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT milestones_uuid_unique UNIQUE (uuid);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: project_invitations project_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations
    ADD CONSTRAINT project_invitations_pkey PRIMARY KEY (id);


--
-- Name: project_invitations project_invitations_token_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations
    ADD CONSTRAINT project_invitations_token_unique UNIQUE (token);


--
-- Name: project_user project_user_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_user
    ADD CONSTRAINT project_user_pkey PRIMARY KEY (project_id, user_id);


--
-- Name: projects projects_owner_id_title_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_title_unique UNIQUE (owner_id, title);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_uuid_unique UNIQUE (uuid);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: task_comments task_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_pkey PRIMARY KEY (id);


--
-- Name: task_user task_user_task_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_task_id_user_id_unique UNIQUE (task_id, user_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_uuid_unique UNIQUE (uuid);


--
-- Name: users users_alias_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_alias_unique UNIQUE (alias);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: milestones_project_id_date_year_date_month_date_week_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX milestones_project_id_date_year_date_month_date_week_index ON public.milestones USING btree (project_id, date_year, date_month, date_week);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: tasks_project_id_status_index; Type: INDEX; Schema: public; Owner: luis.gf
--

CREATE INDEX tasks_project_id_status_index ON public.tasks USING btree (project_id, status);


--
-- Name: milestones milestones_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT milestones_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_invitations project_invitations_invitee_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations
    ADD CONSTRAINT project_invitations_invitee_id_foreign FOREIGN KEY (invitee_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: project_invitations project_invitations_inviter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations
    ADD CONSTRAINT project_invitations_inviter_id_foreign FOREIGN KEY (inviter_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_invitations project_invitations_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_invitations
    ADD CONSTRAINT project_invitations_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_user project_user_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_user
    ADD CONSTRAINT project_user_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_user project_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.project_user
    ADD CONSTRAINT project_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_owner_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_foreign FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_comments task_comments_task_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_task_id_foreign FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_comments task_comments_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_user task_user_task_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_task_id_foreign FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_user task_user_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.task_user
    ADD CONSTRAINT task_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_assignee_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_foreign FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_milestone_uuid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_milestone_uuid_foreign FOREIGN KEY (milestone_uuid) REFERENCES public.milestones(uuid) ON DELETE SET NULL;


--
-- Name: tasks tasks_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: luis.gf
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict MJng8JuxZPcqYTYU6xBQ1FdGKNRZbIOoMNjqDEqCAxCiY3DVkun4hIvbHQMttcz

