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
	a_cid int not null,
	a_aname varchar(128) not null,
	a_weight float not null default 1,
	a_score float,
	primary key (a_aid),
	foreign key (a_cid) REFERENCES courses (c_cid)
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
	t_cid int,
	t_grade char(2),
	t_credits int,
	foreign key (t_uid) REFERENCES users (u_uid) ON DELETE CASCADE,
	foreign key (t_cid) REFERENCES courses (c_cid) ON DELETE CASCADE
);


CREATE TABLE homeworks (
	h_cid int not null,
	h_aid int not null,
	foreign key (h_cid) REFERENCES courses(c_cid) ON DELETE CASCADE,
	foreign key (h_aid) REFERENCES assignments(a_aid) ON DELETE CASCADE
);


-- Test Data:
INSERT INTO users VALUES (default, 'Tristan', 'twarneke@student.umass.edu','UMass Amherst', 'abc123', default);
INSERT INTO users VALUES (default, 'Sean', 'savery@student.umass.edu','UMass Amherst', 'abc123', default);
INSERT INTO users VALUES (default, 'Anh', '','UMass Amherst', 'abc123', default);
Insert into courses values(default, 'CS383 AI', 'FALL', 2011, 'Barto, Andrew');
Insert into courses values(default, 'CS230 Systems', 'FALL', 2011, 'Richards, Timothy');
Insert into courses values(default, 'CS311 Algorithms', 'FALL', 2011, 'Siegelmann, Hava');
insert into takes Values(1, 1, 'B+', 4);
insert into takes VALUES(1, 2, 'A', 3);
insert into takes VALUES(1, 3, 'A', 3);
insert into assignments VALUES(Default, 'hw1', .05, 100);
insert into assignments VALUES(default, 'hw2', .05, 90);
insert into assignments VALUES(default, 'hw1', .10, 95);
insert into homeworks VALUES(1, 1);
insert into homeworks VALUES(1, 2);
insert into homeworks VALUES(2, 3);
