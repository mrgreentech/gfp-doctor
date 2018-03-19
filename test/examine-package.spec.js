const doctor = require('../lib');
const expect = require('chai').expect;

describe('examine-package.json', function() {
    it('should work for eslint 3.0.1', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_eslint_3_0_0.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should use eslint-config-gfp 3.0.0 and up';
        });
        expect(test.passed).to.be.true;
    });

    it('should work for eslint 3.0.1', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_eslint_3_0_1.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should use eslint-config-gfp 3.0.0 and up';
        });
        expect(test.passed).to.be.true;
    });

    it('should fail for eslint 2.3.2', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_eslint_2_3_2.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should use eslint-config-gfp 3.0.0 and up';
        });
        expect(test.passed).to.be.false;
    });

    it('should work for latest gfp-doctor', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_doctor_latest.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should have gfp-doctor > 1.12 installed';
        });
        expect(test.passed).to.be.true;
    });

    it('should work for gfp-doctor 1.12.0', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_doctor_1_12_0.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should have gfp-doctor > 1.12 installed';
        });
        expect(test.passed).to.be.true;
    });

    it('should work for gfp-doctor 1.9.0', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_doctor_1_9_0.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should have gfp-doctor > 1.12 installed';
        });
        expect(test.passed).to.be.true;
    });

    it('should fail for gfp-doctor 1.8.0', function() {
        const results = doctor({
            packagePath: '/test/mocks/package_doctor_1_8_0.json',
            silent: true
        });
        // console.log(results.tests);
        const test = results.tests.find(item => {
            return item.desc === 'should have gfp-doctor > 1.12 installed';
        });
        expect(test.passed).to.be.false;
    });
});
