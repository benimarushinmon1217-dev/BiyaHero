import test from 'node:test';
import assert from 'node:assert/strict';
import { errorHandler } from '../middleware/errorHandler.js';

test('does not expose unexpected server error details to API clients', () => {
    const previousEnvironment = process.env.NODE_ENV;
    const previousConsoleError = console.error;
    process.env.NODE_ENV = 'production';
    const loggedErrors = [];
    console.error = (...args) => loggedErrors.push(args);
    let status;
    let response;
    const res = {
        status(code) {
            status = code;
            return this;
        },
        json(body) {
            response = body;
        }
    };

    try {
        errorHandler(new Error('Unknown column route_preference'), {
            method: 'POST',
            originalUrl: '/api/v1/auth/login'
        }, res, () => {});
    } finally {
        if (previousEnvironment === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = previousEnvironment;
        console.error = previousConsoleError;
    }

    assert.equal(status, 500);
    assert.deepEqual(response, {
        success: false,
        error: {
            message: 'Internal Server Error',
            statusCode: 500
        }
    });
    assert.equal(loggedErrors.length, 1);
    assert.equal(loggedErrors[0][0], 'Error:');
    assert.deepEqual(loggedErrors[0][1], {
        method: 'POST',
        path: '/api/v1/auth/login',
        message: 'Unknown column route_preference',
        statusCode: 500,
        stack: loggedErrors[0][1].stack
    });
    assert.match(loggedErrors[0][1].stack, /Unknown column route_preference/);
});
