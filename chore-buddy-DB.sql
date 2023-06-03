DROP DATABASE IF EXISTS `chore-buddy-sql`;
CREATE DATABASE IF NOT EXISTS `chore-buddy-sql`;
USE `chore-buddy-sql`;

CREATE TABLE chore_group (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(50),
  email VARCHAR(100),
  group_id INT,
  FOREIGN KEY (group_id) REFERENCES chore_group(id) ON DELETE SET NULL
);

CREATE TABLE chores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT,
  name VARCHAR(100),
  assigned_member_id INT,
  FOREIGN KEY (group_id) REFERENCES chore_group(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_member_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO chore_group (name) VALUES ('Family');
INSERT INTO users (phone_number, password, name, email, group_id) 
VALUES ('6301234567', 'abracadabra', 'Cameron Lettieri', 'camlett4@gmail.com', 1);
INSERT INTO chores (group_id, name) VALUES (1, 'Clean the kitchen');
