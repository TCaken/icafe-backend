-- CREATE THE DATABASE
CREATE DATABASE test;

-- CARDS
CREATE TABLE users (
    id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    date_created DATE NOT NULL DEFAULT (curdate()),
    activated BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_login (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
	time DATETIME NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE admin(
	id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    date_created DATE NOT NULL,
    activated BOOLEAN DEFAULT TRUE
);

-- CREATE TABLE admin_login (
-- 	id INT PRIMARY KEY AUTO_INCREMENT,
--     admin_id INT NOT NULL,
-- 	time DATETIME NOT NULL,
--     FOREIGN KEY(admin_id) REFERENCES admin(id) ON DELETE CASCADE
-- );

CREATE TABLE cards (
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    user_id int NOT NULL ,
    date_created date NOT NULL,
    activated boolean,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE balance (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL (15,3) NOT NULL DEFAULT 0
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- Create an admin account 
INSERT INTO test.admin (name, email , password, hasHed_password, date_created)
VALUES ("admin1", "admin1@gmail.com", "120788", "120788", CURDATE());

-- Populate the table users
INSERT INTO users (name, email, username, password, hashed_password) VALUES 
(test1, test1@gmail.com, test1@gmail.com, test1, test1),
(test2, test2@gmail.com, test2@gmail.com, test2, test2),
(c1, c1@gmail.com, c1, 12345678, 12345678),
(c2, c2@gmail.com, c2, 12345678, 12345678);    

INSERT INTO amount (user_id, value) VALUES 
(1, 100000),
(2, 0),
(3, 10000),
(4, 0);

INSERT INTO test.cards (card_id, user_id, date_created, activated)
VALUES ("0006338095", 43, CURDATE(), TRUE);

DELETE FROM test.cards LIMIT 100;

-- FIND CARDS THAT ARE CURRENTLY ACTIVATED
SELECT U1.id, U1.username, U1.email, C1.card_id
FROM users AS U1, cards as C1
WHERE U1.id = C1.user_id and NOT U1.deleted AND C1.activated;