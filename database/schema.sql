--
-- PostgreSQL database dump
--

\restrict TzXbuknSwYG1ZfcRdLvM7fIXK0GzCHGKIHl91DEEvx7uq3WyqLd3xWDfSBzCwzP

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-08 11:23:01

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16439)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    name character varying(100),
    email character varying(100),
    password character varying(100)
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16438)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_admin_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 230 (class 1259 OID 16496)
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    attendance_id integer NOT NULL,
    student_id integer,
    subject_id integer,
    attendance_percentage integer,
    CONSTRAINT attendance_attendance_percentage_check CHECK (((attendance_percentage >= 0) AND (attendance_percentage <= 100)))
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16495)
-- Name: attendance_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_attendance_id_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 229
-- Name: attendance_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_attendance_id_seq OWNED BY public.attendance.attendance_id;


--
-- TOC entry 228 (class 1259 OID 16477)
-- Name: marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marks (
    mark_id integer NOT NULL,
    student_id integer,
    subject_id integer,
    marks integer,
    teacher_id integer,
    CONSTRAINT marks_marks_check CHECK (((marks >= 0) AND (marks <= 100)))
);


ALTER TABLE public.marks OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16476)
-- Name: marks_mark_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marks_mark_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marks_mark_id_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 227
-- Name: marks_mark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marks_mark_id_seq OWNED BY public.marks.mark_id;


--
-- TOC entry 224 (class 1259 OID 16459)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    name character varying(100),
    roll_number character varying(50),
    email character varying(100),
    password character varying(100),
    department character varying(100),
    year integer
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16529)
-- Name: student_performance; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.student_performance AS
 SELECT s.student_id,
    s.name,
    avg(m.marks) AS average_marks
   FROM (public.students s
     JOIN public.marks m ON ((s.student_id = m.student_id)))
  GROUP BY s.student_id, s.name;


ALTER VIEW public.student_performance OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16458)
-- Name: students_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_student_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 223
-- Name: students_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;


--
-- TOC entry 226 (class 1259 OID 16469)
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    subject_id integer NOT NULL,
    subject_name character varying(100),
    subject_code character varying(50)
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16468)
-- Name: subjects_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_subject_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_subject_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: subjects_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_subject_id_seq OWNED BY public.subjects.subject_id;


--
-- TOC entry 222 (class 1259 OID 16449)
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    teacher_id integer NOT NULL,
    name character varying(100),
    email character varying(100),
    password character varying(100),
    department character varying(100)
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16448)
-- Name: teachers_teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachers_teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_teacher_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 221
-- Name: teachers_teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_teacher_id_seq OWNED BY public.teachers.teacher_id;


--
-- TOC entry 4885 (class 2604 OID 16442)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 16499)
-- Name: attendance attendance_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN attendance_id SET DEFAULT nextval('public.attendance_attendance_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16480)
-- Name: marks mark_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks ALTER COLUMN mark_id SET DEFAULT nextval('public.marks_mark_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 16462)
-- Name: students student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16472)
-- Name: subjects subject_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN subject_id SET DEFAULT nextval('public.subjects_subject_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16452)
-- Name: teachers teacher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN teacher_id SET DEFAULT nextval('public.teachers_teacher_id_seq'::regclass);


--
-- TOC entry 5074 (class 0 OID 16439)
-- Dependencies: 220
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (admin_id, name, email, password) FROM stdin;
1	Admin	admin@gmail.com	admin123
\.


--
-- TOC entry 5084 (class 0 OID 16496)
-- Dependencies: 230
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (attendance_id, student_id, subject_id, attendance_percentage) FROM stdin;
1	1	1	90
2	1	2	85
3	1	3	88
4	2	1	80
5	2	2	75
6	2	3	78
7	3	1	95
8	3	2	92
9	3	3	93
10	4	1	88
11	4	2	82
12	4	3	85
13	5	1	70
14	5	2	72
15	5	3	74
\.


--
-- TOC entry 5082 (class 0 OID 16477)
-- Dependencies: 228
-- Data for Name: marks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marks (mark_id, student_id, subject_id, marks, teacher_id) FROM stdin;
11	1	1	78	1
12	1	2	85	1
13	2	1	65	1
14	2	2	72	1
15	3	1	88	1
16	3	2	85	1
17	4	1	72	1
18	4	2	75	1
19	4	3	70	1
20	5	1	60	1
21	5	2	68	1
22	5	3	64	1
\.


--
-- TOC entry 5078 (class 0 OID 16459)
-- Dependencies: 224
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, name, roll_number, email, password, department, year) FROM stdin;
2	Aman	CS101	aman@gmail.com	12345	CS	3
3	Riya	CS102	riya@gmail.com	12345	CS	3
4	Rahul	CS103	rahul@gmail.com	12345	CS	3
5	Sneha	CS104	sneha@gmail.com	12345	CS	3
6	Karan	CS105	karan@gmail.com	12345	CS	3
7	Neha	CS106	neha@gmail.com	12345	CS	3
8	Vikas	CS107	vikas@gmail.com	12345	CS	3
1	Shadab	CS100	Shadab@gmail.com	12345	CS	3
\.


--
-- TOC entry 5080 (class 0 OID 16469)
-- Dependencies: 226
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (subject_id, subject_name, subject_code) FROM stdin;
1	Database Systems	DBMS
2	Operating Systems	OS
3	Data Structures	DSA
\.


--
-- TOC entry 5076 (class 0 OID 16449)
-- Dependencies: 222
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (teacher_id, name, email, password, department) FROM stdin;
2	Priya Mehta	priya@college.com	12345	Computer Science
3	Arjun Singh	arjun@college.com	12345	Computer Science
1	Rahul Sharma	rahul@college.com	12345	Computer Science
\.


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 229
-- Name: attendance_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_attendance_id_seq', 15, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 227
-- Name: marks_mark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marks_mark_id_seq', 22, true);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 223
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 9, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 225
-- Name: subjects_subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_subject_id_seq', 3, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 221
-- Name: teachers_teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_teacher_id_seq', 3, true);


--
-- TOC entry 4894 (class 2606 OID 16447)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 4896 (class 2606 OID 16445)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 4918 (class 2606 OID 16503)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (attendance_id);


--
-- TOC entry 4914 (class 2606 OID 16484)
-- Name: marks marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_pkey PRIMARY KEY (mark_id);


--
-- TOC entry 4904 (class 2606 OID 16467)
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- TOC entry 4906 (class 2606 OID 16465)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- TOC entry 4910 (class 2606 OID 16475)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (subject_id);


--
-- TOC entry 4898 (class 2606 OID 16457)
-- Name: teachers teachers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_key UNIQUE (email);


--
-- TOC entry 4900 (class 2606 OID 16455)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (teacher_id);


--
-- TOC entry 4908 (class 2606 OID 16528)
-- Name: students unique_roll_number; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT unique_roll_number UNIQUE (roll_number);


--
-- TOC entry 4916 (class 2606 OID 16522)
-- Name: marks unique_student_subject; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id);


--
-- TOC entry 4902 (class 2606 OID 16515)
-- Name: teachers unique_teacher_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT unique_teacher_email UNIQUE (email);


--
-- TOC entry 4919 (class 1259 OID 16526)
-- Name: idx_student_attendance; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_attendance ON public.attendance USING btree (student_id);


--
-- TOC entry 4911 (class 1259 OID 16523)
-- Name: idx_student_marks; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_marks ON public.marks USING btree (student_id);


--
-- TOC entry 4912 (class 1259 OID 16524)
-- Name: idx_subject_marks; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subject_marks ON public.marks USING btree (subject_id);


--
-- TOC entry 4923 (class 2606 OID 16504)
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);


--
-- TOC entry 4924 (class 2606 OID 16509)
-- Name: attendance attendance_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(subject_id);


--
-- TOC entry 4920 (class 2606 OID 16485)
-- Name: marks marks_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);


--
-- TOC entry 4921 (class 2606 OID 16490)
-- Name: marks marks_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(subject_id);


--
-- TOC entry 4922 (class 2606 OID 16516)
-- Name: marks marks_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(teacher_id);


-- Completed on 2026-03-08 11:23:01

--
-- PostgreSQL database dump complete
--

\unrestrict TzXbuknSwYG1ZfcRdLvM7fIXK0GzCHGKIHl91DEEvx7uq3WyqLd3xWDfSBzCwzP

