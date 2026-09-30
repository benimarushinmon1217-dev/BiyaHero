import test from 'node:test';
import assert from 'node:assert/strict';
import { errorHandler } from '../middleware/errorHandler.js';

test('does not expose unexpected server error details to API clients', () => {
    const previousEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
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
        errorHandler(new Error('database connection string leaked'), {}, res, () => {});
    } finally {
        if (previousEnvironment === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = previousEnvironment;
    }

    assert.equal(status, 500);
    assert.deepEqual(response, {
        success: false,
        error: {
            message: 'Internal Server Error',
            statusCode: 500
        }
    });
});
