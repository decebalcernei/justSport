const request = require('supertest');
const app = require('../../index');
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require('mongoose');

require('dotenv/config');

describe("Test su annunci", () => {

	beforeAll(async () => {
		jest.unmock("mongoose");
		await mongoose.connect(process.env.DB_CONNECTION);

	});

	afterAll(async () => {
		await mongoose.connection.close(true);
	});

	var token = jwt.sign({
			username: "admin",
			id: "629f973acb7c9b83eb290d79"
		},
		process.env.SEGRETO, {
			expiresIn: 86400
		}
	);

	describe("Iscrizione/Disiscrizione annunci", () => {

		// disiscrivere utente non iscritto
		test("DELETE /annunci/id non iscritto", async () => {
			return request(app).delete("/annunci/629f983acb7c9b83eb290d82").send({
				"id_utente": "629f9a085e1b36affa738fb4"
			}).expect(400, {
				"message": "non sei iscritto a questo annuncio"
			});
		});

		// iscrivere ad annuncio un utente non iscritto
		test("POST /annunci/id non iscritto", async () => {
			return request(app).post("/annunci/629f983acb7c9b83eb290d82").send({
				"id_utente": "629f973acb7c9b83eb290d79"
			}).expect(211, {
				"message": "success"
			});
		});

		// iscrivere ad annuncio un utente gia' iscritto
		test("POST /annunci/id già iscritto", async () => {
			return request(app).post("/annunci/629f9a265e1b36affa738fb8").send({
				"id_utente": "629f9a085e1b36affa738fb4"
			}).expect(400, {
				"message": "sei gia' iscritto a questo annuncio"
			});
		});

		// disiscrivere da annuncio un utente iscritto
		test("DELETE /annunci/id non iscritto", async () => {
			return request(app).delete("/annunci/629f983acb7c9b83eb290d82").send({
				"id_utente": "629f973acb7c9b83eb290d79"
			}).expect(221, {
				"message": "success"
			});
		});
	});

	describe("POST /api/v2/annunci", () => {

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
	});

	describe("GET /api/v2/annunci", () => {

		test("GET /annunci niente filtri", async () => {
			return request(app).get("/annunci").set("x-access-token", token).expect(404);
		});

		test("GET /annunci con filtri validi", async () => {
			return request(app).get("/annunci").set({
				"attrezzatura_necessaria": false,
				"costo": 99999,
				"sport": "Calcio",
				"citta": "Trento"
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
});