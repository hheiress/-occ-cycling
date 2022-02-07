CREATE TABLE locations
(
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    postal_code TEXT NOT NULL
);

CREATE TABLE users
(
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    last_name    TEXT NOT NULL,
    passport     TEXT,
    location_id  INT REFERENCES locations (id),
    address      TEXT,
    gender       TEXT NOT NULL,
    date_birth   DATE,
    nationality  TEXT,
    email        TEXT,
    phone_number TEXT,
    status       TEXT NOT NULL
);

CREATE TABLE user_photos
(
    id       SERIAL NOT NULL PRIMARY KEY,
    user_id  INT REFERENCES users (id),
    filename TEXT   NOT NULL,
    mimetype TEXT   NOT NULL,
    filedata bytea
);

CREATE TABLE station
(
    id           SERIAL PRIMARY KEY,
    station_name TEXT NOT NULL
);

CREATE TABLE bikes
(
    id          SERIAL PRIMARY KEY,
    model_name  TEXT NOT NULL,
    brand_name  TEXT NOT NULL,
    status      TEXT NOT NULL,
    entry_date  DATE NOT NULL,
    conditions  TEXT NOT NULL,
    station_id  INT REFERENCES station (id),
    bike_number INT  NOT NULL UNIQUE
);

CREATE TABLE bike_photos
(
    id       SERIAL NOT NULL PRIMARY KEY,
    bike_id  INT REFERENCES bikes (id),
    filename TEXT   NOT NULL,
    mimetype TEXT   NOT NULL,
    filedata bytea
);

CREATE TABLE rentings
(
    id            SERIAL PRIMARY KEY,
    bike_id       INT REFERENCES bikes (id),
    user_id       INT REFERENCES users (id),
    last_name     INT REFERENCES users (id),
    status        TEXT      NOT NULL,
    renting_date  TIMESTAMP NOT NULL,
    station_id    INT REFERENCES station (id),
    starting_time INTERVAL  NOT NULL,
    finished_date TIMESTAMP
);

CREATE TABLE ngo_users
(
    id            SERIAL PRIMARY KEY,
    user_name     TEXT NOT NULL,
    user_email    TEXT NOT NULL,
    user_password TEXT NOT NULL
);

INSERT INTO  locations(name, postal_code) values ('Polykastro', '61200');
INSERT INTO  locations(name, postal_code) values ('Axioupoli', '61400');
INSERT INTO  locations(name, postal_code) values ('Nea Kavala', '61200');

INSERT INTO station (station_name)
VALUES ('Camp');
INSERT INTO station (station_name)
VALUES ('Polikastro');

INSERT INTO bikes (model_name, brand_name, status, entry_date, conditions, station_id, bike_number)
VALUES ('Model1', 'Decathlon', 'Unavailable', '2018-03-10', 'Change brakes', 2, 12);
INSERT INTO bikes (model_name, brand_name, status, entry_date, conditions, station_id, bike_number)
VALUES ('Avalanche', 'Trek', 'Available', '2020-03-20', 'New', 1, 8);
INSERT INTO bikes (model_name, brand_name, status, entry_date, conditions, station_id, bike_number)
VALUES ('Peak', 'Apache', 'Available', '2015-10-16', 'flat tire', 2, 43);
INSERT INTO bikes (model_name, brand_name, status, entry_date, conditions, station_id, bike_number)
VALUES ('Touring', 'Vento', 'Available', '2016-11-04', 'Good', 1, 2);

DROP USER if exists pepe;
CREATE USER pepe with PASSWORD 'pepe1234';
GRANT CONNECT ON DATABASE occycling TO pepe;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public to pepe;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pepe;

