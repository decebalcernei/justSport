const request = require('supertest');
const app = require('../../index');
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("GET /api/v2/annunci", () => {

	let connection;

	beforeAll( async () => {
		jest.unmock("mongoose");
		connection = await mongoose.connect(process.env.DB_CONNECTION);
		console.log("connection: " + connection);

	});

	afterAll( async () => {
		connection = await mongoose.connection.close();
		console.log("connection:" + connection);
	});

	var token = jwt.sign({
			username: "admin",
			id: "62874b676ee3c24b58d7693a"
		},
		process.env.SEGRETO, {
			expiresIn: 86400
		}
	);

	test("test test", async () => {
		return request(app).get("/annunci").set("x-access-token", token).expect(201);
	});

});

// vedi scheda su trello

// asynchronous operations that weren't stopped in your tests