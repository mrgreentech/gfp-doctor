const doctor = require('../lib');
const expect = require('chai').expect;

describe('index', function() {
    it('should be requireable', function() {
        expect(doctor).not.to.be.an('undefined');
    });
});

describe('run', function() {
    it('should return list of tests', function() {
        const results = doctor({
            silent: true
        });
        expect(results.tests).to.be.an('array');
    });

    it('should fail if not all files are present', function() {
        const results = doctor({
            silent: true
        });
        expect(results.success).to.be.false;
    });
});
