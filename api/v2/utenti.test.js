const request = require('supertest');
const app = require('../../index');
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("GET /api/v2/utenti", () => {

	beforeAll(async () => {
		jest.unmock("mongoose");
		return await mongoose.connect(process.env.DB_CONNECTION);

	});

	afterAll(async () => {
		return await mongoose.connection.close(true);
	});

	var token = jwt.sign({
			username: "admin",
			id: "629f973acb7c9b83eb290d79"
		},
		process.env.SEGRETO, {
			expiresIn: 86400
		}
	);

	test("GET /utenti id valido", async () => {
		return request(app).get("/utenti/629f973acb7c9b83eb290d79").expect(230);
	});

	test("GET /utenti id non valido", async () => {
		return request(app).get("/utenti/caratteri_a_caso").expect(404, {
			message: "utente inesistente"
		});
	});
});