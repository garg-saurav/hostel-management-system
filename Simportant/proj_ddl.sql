DROP TABLE IF EXISTS services_modify CASCADE; --won't do
DROP TABLE IF EXISTS booking_services CASCADE; --done
DROP TABLE IF EXISTS request_hostel_services CASCADE; --done
DROP TABLE IF EXISTS request_hostel_photos; --done
DROP TABLE IF EXISTS request_new_hostel CASCADE; --done
DROP TABLE IF EXISTS monthly_fees CASCADE; 
DROP TABLE IF EXISTS modification_request CASCADE; --done
DROP TABLE IF EXISTS booking_guests CASCADE; --done
DROP TABLE IF EXISTS booking CASCADE; --done
DROP TABLE IF EXISTS room CASCADE; --done
DROP TABLE IF EXISTS rooms_type CASCADE; --done
DROP TABLE IF EXISTS services CASCADE; --done
DROP TABLE IF EXISTS building_photos CASCADE; --done
DROP TABLE IF EXISTS building CASCADE; --done 
DROP TABLE IF EXISTS regional_manager CASCADE; --done
DROP TABLE IF EXISTS hostel_owner CASCADE; --done
DROP TABLE IF EXISTS customer CASCADE; --done
DROP TABLE IF EXISTS person CASCADE; --done

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE person (
    person_id INT,
    name TEXT NOT NULL,
    email_id TEXT NOT NULL UNIQUE,
    dob DATE,
    phone_number BIGINT NOT NULL,
    addr TEXT,
    PRIMARY KEY(person_id)
);

CREATE TABLE customer (
    person_id INT ,
    passwd TEXT NOT NULL,
    PRIMARY KEY(person_id),
    FOREIGN KEY(person_id) REFERENCES person ON DELETE CASCADE
);

CREATE TABLE hostel_owner (
    person_id INT ,
    passwd TEXT NOT NULL,
    PRIMARY KEY(person_id),
    FOREIGN KEY(person_id) REFERENCES person ON DELETE CASCADE
);

CREATE TABLE regional_manager (
    person_id INT ,
    passwd TEXT NOT NULL,
    city TEXT NOT NULL UNIQUE,
    PRIMARY KEY(person_id),
    FOREIGN KEY(person_id) REFERENCES person ON DELETE CASCADE
);

CREATE TABLE building (
    building_id INT,
    building_name TEXT NOT NULL,
    location_point GEOGRAPHY NOT NULL,
    hostel_owner_id INT  NOT NULL,
    city TEXT NOT NULL,
    addr TEXT NOT NULL,
    building_type TEXT NOT NULL CHECK(building_type in('PG','Hostel')),
    additional_info TEXT,
    PRIMARY KEY(building_id),
    FOREIGN KEY(hostel_owner_id) REFERENCES hostel_owner ON DELETE CASCADE,
    FOREIGN KEY(city) REFERENCES regional_manager(city) ON DELETE CASCADE
);

CREATE TABLE building_photos (
    building_id INT ,
    photo TEXT NOT NULL,
    PRIMARY KEY(building_id, photo),
    FOREIGN KEY(building_id) REFERENCES building ON DELETE CASCADE
);

CREATE TABLE services (
    building_id INT ,
    service_type TEXT,
    rate_per_month INT NOT NULL,
    PRIMARY KEY(building_id, service_type),
    FOREIGN KEY(building_id) REFERENCES building ON DELETE CASCADE
);

CREATE TABLE rooms_type (
    building_id INT ,
    rooms_type_id INT,
    rent INT NOT NULL,
    num_beds INT NOT NULL,
    ac  BOOLEAN NOT NULL CHECK(ac in (TRUE, FALSE)),
    PRIMARY KEY(building_id, rooms_type_id),
    FOREIGN KEY(building_id) REFERENCES building ON DELETE CASCADE
);


CREATE TABLE room (
    building_id INT ,
    rooms_type_id INT ,
    room_no INT,
    available BOOLEAN NOT NULL CHECK(available IN (TRUE,FALSE)),
    PRIMARY KEY(building_id,rooms_type_id,room_no),
    FOREIGN KEY(building_id, rooms_type_id) REFERENCES rooms_type ON DELETE CASCADE
);

CREATE TABLE booking (
    booking_id INT,
    building_id INT  NOT NULL,
    rooms_type_id INT  NOT NULL,
    room_no INT NOT NULL,
    customer_id INT  NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rating INT CHECK(rating in(1,2,3,4,5) or rating is NULL),
    review TEXT,
    cancelled BOOLEAN NOT NULL CHECK(cancelled IN (TRUE,FALSE)),
    PRIMARY KEY(booking_id),
    FOREIGN KEY(building_id, rooms_type_id, room_no) REFERENCES room ON DELETE CASCADE,
    FOREIGN KEY(customer_id) REFERENCES customer ON DELETE CASCADE
);

CREATE TABLE booking_guests (
    booking_id INT ,
    name TEXT,
    dob DATE,
    phone_number BIGINT,
    PRIMARY KEY(booking_id, name, dob, phone_number),
    FOREIGN KEY(booking_id) REFERENCES booking ON DELETE CASCADE
);

CREATE TABLE modification_request (
    request_id INT,
    booking_id INT  NOT NULL,
    new_start_date DATE NOT NULL,
    new_end_date DATE NOT NULL,
    cancelled BOOLEAN NOT NULL,
    time_stamp TIMESTAMP NOT NULL DEFAULT NOW(),
    approval BOOLEAN,
    comment TEXT,
    PRIMARY KEY(request_id),
    FOREIGN KEY(booking_id) REFERENCES booking ON DELETE CASCADE
);

CREATE TABLE monthly_fees (
    booking_id INT ,
    month INT CHECK(month>=1 AND month<=12), 
    year INT, 
    fees INT NOT NULL,
    paid BOOLEAN CHECK(paid in (TRUE,FALSE)),
    PRIMARY KEY(booking_id, month, year),
    FOREIGN KEY(booking_id) REFERENCES booking ON DELETE CASCADE
);

CREATE TABLE request_new_hostel (
    request_id INT,
    building_name TEXT NOT NULL,
    city TEXT  NOT NULL,
    hostel_owner_id INT NOT NULL,
    location_point GEOGRAPHY NOT NULL,
    addr TEXT NOT NULL,
    time_stamp TIMESTAMP NOT NULL DEFAULT NOW(),
    building_type TEXT NOT NULL CHECK(building_type IN ('PG', 'Hostel')),
    additional_info TEXT,
    approval BOOLEAN,
    comment TEXT,
    PRIMARY KEY(request_id),
    FOREIGN KEY(city) REFERENCES regional_manager(city) ON DELETE CASCADE,
    FOREIGN KEY(hostel_owner_id) REFERENCES hostel_owner ON DELETE CASCADE
);

CREATE TABLE request_hostel_photos (
    request_id INT ,
    photo TEXT,
    FOREIGN KEY(request_id) REFERENCES request_new_hostel ON DELETE CASCADE,
    PRIMARY KEY(request_id, photo)
);

CREATE TABLE request_hostel_services (
    request_id INT ,
    service_type TEXT,
    rate_per_month INT NOT NULL,
    PRIMARY KEY(request_id, service_type),
    FOREIGN KEY(request_id) REFERENCES request_new_hostel ON DELETE CASCADE
);

CREATE TABLE booking_services (
    booking_id INT ,
    service_type TEXT,
    PRIMARY KEY(service_type, booking_id),
    FOREIGN KEY(booking_id) REFERENCES booking ON DELETE CASCADE
);

CREATE TABLE services_modify (
    request_id INT ,
    service_type TEXT,
    PRIMARY KEY(request_id, service_type),
    FOREIGN KEY(request_id) REFERENCES modification_request ON DELETE CASCADE
);

CREATE INDEX ON building USING GIST (location_point);

-- insert into location_point --
/*
To insert data:

INSERT INTO building (location_point) VALUES ('SRID=4326;POINT(longitude latitude)');

Order is Longitude, Latitude - so if you plot it as the map, it is (x, y).

and then request, say, 5 closest to a given point:

SELECT * 
FROM building 
ORDER BY location_point <-> 'SRID=4326;POINT(lon lat)' 
LIMIT 5;

*/