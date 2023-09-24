-- CARDS
CREATE TABLE users (
    id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    date_created DATE NOT NULL DEFAULT (curdate());,
    activated BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_login (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
	time DATETIME NOT NULL
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

CREATE TABLE admin_login (
	id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
	time DATETIME NOT NULL,
    FOREIGN KEY(admin_id) REFERENCES admin(id) ON DELETE CASCADE
);

CREATE TABLE cards (
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    user_id int NOT NULL ,
    date_created date NOT NULL,
    activated boolean,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE amount (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    value DECIMAL (15,3) NOT NULL DEFAULT 0
)

INSERT INTO test.cards (card_id, user_id, date_created, activated)
VALUES ("0006338095", 43, CURDATE(), TRUE);

INSERT INTO test.admin (name, email , password, hasHed_password, date_created)
VALUES ("admin1", "admin1@gmail.com", "120788", "120788", CURDATE());	

DELETE FROM test.cards LIMIT 100;

-- FIND CARDS THAT ARE CURRENTLY ACTIVATED
SELECT U1.id, U1.username, U1.email, C1.card_id
FROM users AS U1, cards as C1
WHERE U1.id = C1.user_id and NOT U1.deleted AND C1.activated;