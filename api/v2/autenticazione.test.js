const request = require('supertest');
const app = require('../../index');
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("POST /api/v2/autenticazione", () => {

	beforeAll(async () => {
		jest.unmock("mongoose");
		await mongoose.connect(process.env.DB_CONNECTION);

	});

	afterAll(async () => {
		await mongoose.connection.close(true);
	});

	var token = jwt.sign({
			username: "admin",
			id: "62874b676ee3c24b58d7693a"
		},
		process.env.SEGRETO, {
			expiresIn: 86400
		}
	);

	test("POST /autenticazione utente inesistente", async () => {
		return request(app).post("/autenticazione").set("x-access-token", token).send({
			"username": "random_name_that_clearly_doesn't_exist_in_the_database"
		}).expect(404, {
			"message": "utente non esiste"
		});
	});

	test("POST /autenticazione password sbagliata", async () => {
		return request(app).post("/autenticazione").set("x-access-token", token).send({
			"username": "admin",
			"password": "not_admin"
		}).expect(401, {
			"message": "password sbagliata"
		});
	});

	test("POST /autenticazione credenziali corrette", async () => {
		return request(app).post("/autenticazione").set("x-access-token", token).send({
			"username": "admin",
			"password": "admin"
		}).expect(200);
	});
});