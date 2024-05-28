const eventController = require("../../events/eventsController/eventController");
const express = require("express");
const router = express.Router();


router.post('/', eventController.saveEvent);
router.post('/deleted', eventController.deleteEvent);
router.post('/edit', eventController.editEvent);
router.get('/:username', eventController.fetchEvents)

module.exports = router;