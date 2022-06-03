const request = require('supertest');
const app = require('./annunci');
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("GET /api/v2/annunci", () => {

	let connection;

	beforeAll(async () => {
		jest.setTimeout(8000);
		jest.unmock("mongoose");
		connection = await mongoose.connect(process.env.DB_CONNECTION);
		console.log("connesso al db");
	});

	afterAll(() => {
		mongoose.connection.close = true;
		console.log("chiuso connessione al db");
	});

	var token = jwt.sign({
			username: "admin",
			id: "62874b676ee3c24b58d7693a"
		},
		process.env.SEGRETO, {
			expiresIn: 86400
		}
	);

	test("test test", () => {
		return request(app).get("/").set("x-access-token", token).expect(201);
	});

});