DROP TABLE IF EXISTS movie_tab;

CREATE TABLE IF NOT EXISTS movie_tab (
   id SERIAL PRIMARY KEY,
    name varchar(255),
    time varchar(255),
    summary varchar(255),
    image varchar(255)
);