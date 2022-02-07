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
    gender       TEXT,
    date_birth   DATE,
    nationality  TEXT,
    email        TEXT,
    phone_number INT,
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

CREATE TABLE bann_history
(
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users (id),
    start_date  DATE NOT NULL,  
    finish_date DATE 
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
    id               SERIAL PRIMARY KEY,
    bike_id          INT REFERENCES bikes (id),
    user_id          INT REFERENCES users (id),
    last_name        INT REFERENCES users (id),
    status           TEXT      NOT NULL,
    renting_date     TIMESTAMP NOT NULL,
    station_id_start INT REFERENCES station (id),
    station_id_end   INT REFERENCES station (id),
    starting_time    INTERVAL  NOT NULL,
    finished_date    TIMESTAMP
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

INSERT INTO users (name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status)
VALUES ('Ehsan', 'Abdul', 'H235690L', 1, 'Street Tree 23', 'Male', '1970-06-20', 'Syrian', 'ehsan90@gmail.com', 44590832,
        'Active');
INSERT INTO users (name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status)
VALUES ('Abel', 'Honks', 'G567623P', 1, 'Street Table 44', 'Male', '1980-10-08', 'Liberia', 'abel_lib@yahoo.com', 33456712,
        'Active');
INSERT INTO users (name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status)
VALUES ('Miray', 'Demir', 'TK239445J', 2, 'AV. Rome 56', 'Female', '1994-05-13', 'Turkey', 'miraydream@yahoo.com',
        77234509, 'Active');
INSERT INTO users (name, last_name, passport, location_id, address, gender, date_birth, nationality, email, phone_number, status)
VALUES ('Ahmed', 'Rashid', 'V228946K', 3, 'C33', 'Male', '1989-02-23', 'Afghanistan', 'ahmed10@gmail.com', 32568901,
        'Banned');

INSERT INTO bann_history (user_id, start_date, finish_date)
VALUES (2, '2021-07-11', '2021-07-31');

INSERT INTO bann_history (user_id, start_date, finish_date)
VALUES (1, '2021-07-31', '2021-08-21');


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

-- INSERT INTO rentings (bike_id, user_id, last_name, status, renting_date, station_id, starting_time, finished_date) VALUES (2, 3, 3, 'Rent finished', '2021-05-09 10:12:06', 2, '04:00:00', '2021-05-10 13:02:15');
-- INSERT INTO rentings (bike_id, user_id, last_name, status, renting_date, station_id, starting_time, finished_date) VALUES (1, 2, 2, 'Rent finished', '2021-05-11 14:22:11', 1, '04:00:00', '2021-05-11 18:23:41');
-- INSERT INTO rentings (bike_id, user_id, last_name, status, renting_date, station_id, starting_time, finished_date) VALUES (3, 1, 1, 'Rent finished', '2021-05-09 09:42:10', 3, '04:00:00', '2021-05-09 14:22:11');

INSERT INTO ngo_users (user_name, user_email, user_password)
VALUES ('Irene', 'ireneocc@gmail.com', 'igrece4381');

DROP USER if exists pepe;
CREATE USER pepe with PASSWORD 'pepe1234';
GRANT CONNECT ON DATABASE occycling TO pepe;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public to pepe;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pepe;

