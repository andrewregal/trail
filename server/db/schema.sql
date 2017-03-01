DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS posts;

CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  userID INTEGER REFERENCES profile (id),
  recipientUserID INTEGER,
  longitude VARCHAR(255) NOT NULL,
  latitude VARCHAR(255) NOT NULL,
  imageURL VARCHAR(255) NOT NULL,
  publicPost BOOLEAN NOT NULL,
  timePosted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timeExpired TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
