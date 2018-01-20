CREATE TABLE PROJECT(
       project_id serial primary key,
       project_name varchar(255),
       last_modified timestamp,
       size_x integer,
       size_y integer,
       size_z integer
);

CREATE TABLE PIECES(
       type serial primary key,
       color integer,
       size_x integer,
       size_y integer
);

CREATE TABLE PLACED_PIECES(
       project_id integer REFERENCES PROJECT (project_id),
       type integer REFERENCES PIECES (type),
       orientation integer,
       position_x integer,
       position_y integer,
       position_z integer
);

