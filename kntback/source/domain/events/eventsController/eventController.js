const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1d336cc755fb4a45a16f1d94ca2f244b');
const axios = require('axios')
const User = require('../../../model/dataModels/User')
const News = require('../../../model/dataModels/MarkedNews')
const Events = require('../../../model/dataModels/Events');

class EventController {


    static async saveEvent(req, res) {

        try {

            const {username, title, date, allDay} = req.body.eventData;

            console.log("Request body:", username, title, date, allDay);


            const user = await User.findOne({where: {username}});
            const id = user.id

            console.log("findOne");

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            console.log("!user");
            console.log(user.id)

            const dateInMillis = new Date(date).getTime();
            const dateAsBigInt = BigInt(dateInMillis);
            const newEvent = await Events.create({
                title: title,
                date: dateAsBigInt,
                allDay: allDay,
                userId: id
            });

            console.log("Events.create");
            console.log(newEvent.id);

            return res.json(newEvent.id);
        } catch (error) {
            console.error('Error saving event:', error);
            throw new Error('Error saving event.');
        }
    }

    static async deleteEvent(req, res) {

        try {

            console.log(req.body.eventId);

            const id = req.body.eventId;

            const deletedEvents = await Events.destroy({
                where: { id }
            });

            if (!deletedEvents) {
                return res.status(404).json({error: 'event not found'});
            }

            return res.json({message: 'Event successfully deleted'});
        } catch (error) {
            console.error('Error deleting event', error);
            throw new Error('Error deleting event');
        }
    }
    static async editEvent(req, res) {

        try {
            const id = req.body.selectedEventId;
            const eventName = req.body.eventName;


            const editedEvents = await Events.update(
                { title: eventName },
                {
                    where: { id }
                }
            );

            if (!editedEvents) {
                return res.status(404).json({error: 'event not found'});
            }

            return res.json({message: 'Event successfully updated'});
        } catch (error) {
            console.error('Error updating event', error);
            throw new Error('Error updating event');
        }
    }

    static async fetchEvents(req, res) {

        try {
            const username = req.params.username

            console.log("username: " + username)

            if (!username) {
                return res.status(400).json({error: 'Missing required field: username'});
            }
            const user = await User.findOne({where: {username}})
            const id = user.id;

            const userEvents = await Events.findAll({where: {userId: id}});
            console.log(userEvents)
            if (!userEvents) {
                return res.status(404).json({error: 'User events not found'});
            }

            return res.json(
                {
                    events: userEvents.map(event => ({
                        eventId: event.dataValues.id,
                        title: event.dataValues.title,
                        date: new Date(Number(event.dataValues.date)),
                        allDay: event.dataValues.allDay
                    }))
                }
            );
        } catch (error) {
            console.error('Error fetching user events:', error);
            res.status(500).json({error: 'Server error'});
        }
    }


}

module.exports = EventController;