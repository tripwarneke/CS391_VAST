-- Create VAST tables

CREATE SEQUENCE c_cid_seq;
CREATE TABLE courses (
	c_cid int not null default nextval('c_cid_seq'),
	c_name varchar(64) not null,
	c_semester varchar(8) not null,
	c_year int not null,
	c_instructor varchar(64),
	primary key (c_cid)
);

CREATE SEQUENCE a_ass_seq;
CREATE TABLE assignments (
	a_aid int not null default nextval('a_ass_seq'),
	a_aname varchar(128) not null,
	a_weight float not null default 1,
	a_score float,
	primary key (a_aid)
);

CREATE SEQUENCE user_uid_seq;
CREATE TABLE users (
	u_uid int not null default nextval('user_uid_seq'),
	u_name varchar(48) not null,
	u_email varchar(64) not null,
	u_school varchar(128),
	u_password varchar(32) not null,
	u_resetPW boolean not null default false,
	primary key (u_uid)
);

CREATE TABLE takes (
	t_uid int not null,
	t_cid int not null,
	t_grade char(2),
	foreign key (t_uid) REFERENCES users (u_uid),
	foreign key (t_cid) REFERENCES courses (c_cid)
);


CREATE TABLE homeworks (
	h_cid int not null,
	h_aid int not null,
	foreign key (h_cid) REFERENCES courses(c_cid),
	foreign key (h_aid) REFERENCES assignments(a_aid)
);

CREATE SEQUENCE g_grade_seq;
CREATE TABLE gradebook (
	g_gid int not null default nextval('g_grade_seq'),
	g_uid int not null,
	g_grade char(2
) not null,
	g_creds float not null,
	g_scale float not null default 4,
	g_semester char(8) not null,
	g_year int not null,
	primary key (g_gid),
	foreign key (g_uid) REFERENCES users (u_uid)
);



-- Test Data:
INSERT INTO users VALUES (default, 'Tristan Warneke', 'twarneke@student.umass.edu','UMass Amherst', 'abc123', default);
INSERT INTO users VALUES (default, 'Sean Avery', 'savery@student.umass.edu','UMass Amherst', 'abc123', default);
INSERT INTO users VALUES (default, 'Anh Nguyen', '','UMass Amherst', 'abc123', default);
Insert into courses values(default, 'CS383 AI', 'FALL', 2011, 'Barto, Andrew');
Insert into courses values(default, 'CS230 Systems', 'FALL', 2011, 'Richards, Timothy');
Insert into courses values(default, 'CS311 Algorithms', 'FALL', 2011, 'Siegelmann, Hava');
insert into takes Values(1, 1, 'B+');
insert into takes VALUES(1, 2, 'A');
insert into takes VALUES(1, 3, 'A');
insert into assignments VALUES(Default, 'hw1', .05, 100);
insert into assignments VALUES(default, 'hw2', .05, 90);
insert into assignments VALUES(default, 'hw1', .10, 95);
insert into homeworks VALUES(1, 1);
insert into homeworks VALUES(1, 2);
insert into homeworks VALUES(2, 3);
insert into gradebook VALUES(default, 1, 'A-', 4, default, 'FALL', 2010);
insert into gradebook VALUES(default, 1, 'A', 4, default, 'FALL', 2010);
insert into gradebook VALUES(default, 1, 'A', 3, default, 'FALL', 2010);
