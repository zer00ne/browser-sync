"use strict";

var path        = require("path");
var browserSync = require(path.resolve("./"));

var pkg         = require(path.resolve("package.json"));
var sinon       = require("sinon");
var assert      = require("chai").assert;
var cli         = require(path.resolve(pkg.bin));

describe("E2E CLI `reload` with no files arg", function () {

    it("should make a http request to the protocol with no files arg", function (done) {
        browserSync.reset();
        browserSync
            .create()
            .init({server: "test/fixtures", open: false}, function (err, bs) {

                var spy = sinon.spy(bs.events, "emit");

                cli({
                    cli: {
                        input: ["reload"],
                        flags: {
                            port: bs.options.get("port")
                        }
                    },
                    cb: function () {
                        sinon.assert.calledWithExactly(spy, "browser:reload");
                        bs.cleanup();
                        done();
                    }
                });
            });
    });

    it("should make a http request with files arg", function (done) {

        browserSync.reset();

        browserSync
            .create()
            .init({server: "test/fixtures", open: false}, function (err, bs) {

                var spy = sinon.spy(bs.events, "emit");

                cli({
                    cli: {
                        input: ["reload"],
                        flags: {
                            port: bs.options.get("port"),
                            files: "core.css"
                        }
                    },
                    cb: function () {
                        sinon.assert.calledWithExactly(spy, "file:changed", {
                            path: "core.css",
                            basename: "core.css",
                            log: true,
                            namespace: "core",
                            event: "change",
                            ext: "css"
                        });
                        bs.cleanup();
                        done();
                    }
                });
            });
    });
    it("should make a http request with files arg over HTTPS", function (done) {

        browserSync.reset();
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

        browserSync
            .create()
            .init({server: "test/fixtures", open: false, https: true}, function (err, bs) {

                var spy = sinon.spy(bs.events, "emit");

                cli({
                    cli: {
                        input: ["reload"],
                        flags: {
                            url: bs.options.getIn(["urls", "local"]),
                            files: "core.css"
                        }
                    },
                    cb: function () {
                        sinon.assert.calledWithExactly(spy, "file:changed", {
                            path: "core.css",
                            basename: "core.css",
                            ext: "css",
                            log: true,
                            namespace: "core",
                            event: "change"
                        });
                        bs.cleanup();
                        done();
                    }
                });
            });
    });
    it("should handle ECONNREFUSED errors nicely", function (done) {
        cli({
            cli: {
                input: ["reload"],
                flags: {}
            },
            cb: function (err) {
                assert.equal(err.code, "ECONNREFUSED");
                assert.equal(err.message, "BrowserSync not running at http://localhost:3000");
                done();
            }
        });
    });
    it("should handle non 200 code results", function (done) {
        cli({
            cli: {
                input: ["reload"],
                flags: {}
            },
            cb: function (err) {
                assert.equal(err.code, "ECONNREFUSED");
                assert.equal(err.message, "BrowserSync not running at http://localhost:3000");
                done();
            }
        });
    });
});
