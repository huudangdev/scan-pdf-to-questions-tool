const { send } = require("micro");
const { get, post, router } = require("microrouter");

const testServer = (req, res) => {
  send(res, 200, `Hello`);
};

const notFound = (req, res) => {
  send(res, 404, "Not found");
};

module.exports = router (
    get('/hello', testServer),
    get('/*', notFound)
)