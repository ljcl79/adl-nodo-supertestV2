const api = require('supertest')
require('dotenv').config();

const bookingData = {
    "firstname": "Pedro",
    "lastname": "Perez",
    "totalprice": 500,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2026-08-10",
        "checkout": "2026-08-12"
    },
    "additionalneeds": null
}

const authData = {
    "username": "admin",
    "password": "password123"
}

describe("Verificando el CRUD de Bookings", () => {
    const baseUrl = process.env.BASE_URL;
    let bookingId = null;
    let token = null;

    test("Obtener reservaciones", async () => {
        const response = await api(baseUrl)
            .get("/booking")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
    });

    test("Crear reservación", async () => {
        const response = await api(baseUrl)
            .post('/booking')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(bookingData);

        if (response.statusCode === 200 && response.body?.bookingid) {
            bookingId = response.body?.bookingid;
        }

        expect(response.body).toHaveProperty('booking');
        expect(typeof response.body.booking).toBe('object');
        expect(response.statusCode).toBe(200);
    });

    test("Obtener reservación", async () => {
        const response = await api(baseUrl)
            .get(`/booking/${bookingId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe('object');
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body?.firstname).toBe(bookingData.firstname);
    });

    test("Autenticación", async () => {
        const response = await api(baseUrl)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(authData);

        expect(response.statusCode).toBe(200);
        token = response.body?.token;
    });

    test("Actualizar reservación", async () => {
        const response = await api(baseUrl)
            .patch(`/booking/${bookingId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`)
            .send({
                "additionalneeds": "Breakfast, Lunch And Dinner"
            });

        expect(response.statusCode).toBe(200);
    });

    test("Borrar reservación", async () => {
        const response = await api(baseUrl)
            .delete(`/booking/${bookingId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', `token=${token}`);

        expect(response.statusCode).toBe(201);
    });
})
