CREATE DATABASE banco_dados;

CREATE TABLE
    usuarios(
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
    )