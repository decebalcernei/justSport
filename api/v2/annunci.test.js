const request = require('supertest');
const app = require('../../index');
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("GET /api/v2/annunci", () => {

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

	test("GET /annunci niente filtri", async () => {
		return request(app).get("/annunci").set("x-access-token", token).expect(404);
	});

	test("POST /annunci niente parametri", async () => {
		return request(app).post("/annunci").set("x-access-token", token).expect(400);
	});

	test("POST /annunci parametro invalido", async () => {
		return request(app).post("/annunci").set("x-access-token", token).send({
			"max_partecipanti": 1
		}).expect(400, {
			"message": "annuncio invalido! max partecipanti e' minore di min partecipanti"
		});
	});

	test("POST /annunci senza token", async () => {
		return request(app).post("/annunci").expect(401);
	});

	// disiscrivere utente non iscritto
	test("DELETE /annunci/id non iscritto", async () => {
		return request(app).delete("/annunci/629b1b129cbdba50bc1e1217").send({
			"id_utente": "62874b676ee3c24b58d7693a"
		}).expect(400, {
			"message": "non sei iscritto a questo annuncio"
		});
	});

	// iscrivere ad annuncio a cui utente non iscritto
	test("POST /annunci/id non iscritto", async () => {
		return request(app).post("/annunci/629b1b129cbdba50bc1e1217").send({
			"id_utente": "62874b676ee3c24b58d7693a"
		}).expect(210, {
			"message": "success"
		});
	});

	// iscrivere ad annuncio a cui utente gia' iscritto
	test("POST /annunci/id non iscritto", async () => {
		return request(app).post("/annunci/629b1b129cbdba50bc1e1217").send({
			"id_utente": "62874b676ee3c24b58d7693a"
		}).expect(400, {
			"message": "sei gia' iscritto a questo annuncio"
		});
	});

	// disiscrivere da annuncio a cui utente iscritto
	test("DELETE /annunci/id non iscritto", async () => {
		return request(app).delete("/annunci/629b1b129cbdba50bc1e1217").send({
			"id_utente": "62874b676ee3c24b58d7693a"
		}).expect(210, {
			"message": "success"
		});
	});

	test("GET /annunci con filtri validi", async () => {
		return request(app).get("/annunci").set({
			"attrezzatura_necessaria": false,
			"costo": 99999,
			"sport": "Atletica",
			"citta": "Ancona"
		}).expect(201);
	});

	test("GET /annunci con filtri non validi", async () => {
		return request(app).get("/annunci").set({
			"attrezzatura_necessaria": false,
			"costo": -1,
			"sport": "Atletica",
			"citta": "Ancona"
		}).expect(404);
	});
});