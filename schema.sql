DROP TABLE IF EXISTS movie_tab;

CREATE TABLE IF NOT EXISTS movie_tab (
   id SERIAL PRIMARY KEY,
    name varchar(6255),
    time varchar(6255),
    summary varchar(6255),
    image varchar(6255),
    comment varchar(6255)
);