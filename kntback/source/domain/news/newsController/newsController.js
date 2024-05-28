const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1d336cc755fb4a45a16f1d94ca2f244b');
const axios = require('axios')
const User = require('../../../model/dataModels/User')
const MarkedNews = require('../../../model/dataModels/MarkedNews')

const deepl = require('deepl-node');

const authKey = "b2fba23b-d563-4f97-8aca-c303e40d8287:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);


class NewsController {
    static async fetchNews(req, res) {
        try {
            console.log("fetched")

            const response = await axios.get('https://newsapi.org/v2/top-headlines?', {
                params: {
                     country: 'kr',
                    category: 'entertainment',
                    apiKey: '1d336cc755fb4a45a16f1d94ca2f244b',
                    source: 'MTV News'

                },
            });

            const articles = response.data.articles;
            console.log(articles)

            const titles = articles.map(article => article.title);
            const descriptions = articles.map(article => article.description ? article.description : "No description");
            const urlToImages = articles.map(article => article.urlToImage ? article.urlToImage : "No urlToImage");
            //  const contents = articles.map(article => article.content);
            console.log(titles)
            console.log(descriptions)
            console.log(urlToImages)

            //
            const translatedTitles = await translator.translateText(titles, 'ko', 'uk');
            const translatedDescriptions = await translator.translateText(descriptions, 'ko', 'uk');


            const translatedArticles = articles.map((article, index) => ({
                title: translatedTitles[index].text,
                description: translatedDescriptions[index].text,
                urlToImage: urlToImages[index]

            }));
            //
            // console.log(JSON.stringify({ translatedArticles }))
            // const translatedArticles = articles.map((article, index) => ({
            //     title: titles[index],
            //     description: descriptions[index],
            //     urlToImage: urlToImages[index]
            // }));
            // console.log("fetched")

            //return res.json({translatedArticles});
            return res.json({translatedArticles});


            // const news = response.data;
            // console.log(news)
            //
            // const articles = response.data.articles;
            // const texts = articles.map(article => article.content); // Припускаючи, що ви хочете перекласти текст статей
            // console.log(texts)
            //
            // const result = await translator.translateText(texts, 'kr', 'uk');
            // //const result = await translator.translateText(news, 'kr' ,'uk');
            // //console.log(result)
            // return res.json(result);
        } catch (error) {
            console.error('Error fetching news:', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    static async saveNews(req, res) {

        try {

            console.log('[eeeeeeeeeeeeq')

            const {username, newsData} = req.body;

            if (!username || !newsData) {
                return res.status(400).json({error: 'Missing required fields: username, newsData'});
            }

            console.log("Request body:", req.body);

            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            const newNews = await MarkedNews.create({
                title: newsData.title,
                content: newsData.description,
                imageUrl: newsData.urlToImage,
                userId: user.id
            });

            return res.json(newNews);
        } catch (error) {
            console.error('Error saving news:', error);
            throw new Error('Error saving news.');
        }
    }

    static async unsaveNews(req, res) {

        try {

            console.log('[eeeeeeeeeeeeq')

            const {username, newsData} = req.body;
            console.log(username)

            if (!username || !newsData) {
                return res.status(400).json({error: 'Missing required fields: username, newsData'});
            }

            console.log("Request body:", req.body);

            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            const deletedNews = await MarkedNews.destroy({
                where: {
                    title: newsData.title,
                    content: newsData.description,
                    userId: user.id
                }
            });

            if (!deletedNews) {
                return res.status(404).json({error: 'MarkedNews not found'});
            }

            return res.json({message: 'MarkedNews successfully unsaved'});
        } catch (error) {
            console.error('Error saving news:', error);
            throw new Error('Error saving news.');
        }
    }

    static async fetchMarkedNews(req, res) {

        try {
            const username = req.params.username

            if (!username) {
                return res.status(400).json({error: 'Missing required field: username'});
            }
            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            const userId = user.id
            const userNews = await MarkedNews.findAll({where: {userId}});

            if (!userNews) {
                return res.status(200).json('no news');
            }

            return res.json(
                {
                    markedNews: userNews.map(news => ({
                        title: news.dataValues.title,
                        description: news.dataValues.content,
                        urlToImage: news.dataValues.imageUrl
                    }))
                }
            );
        } catch (error) {
            console.error('Error fetching user news:', error);
            res.status(500).json({error: 'Server error'});
        }
    }
    static async fetchPopularNews(req, res) {

        try {

            const popularNews = await MarkedNews.findAll({attributes: ['title', 'content', 'imageUrl'], // Вибрати лише необхідні атрибути
                group: ['title', 'content', 'imageUrl']});
            console.log(popularNews)
            return res.json(
                {
                    markedNews: popularNews.map(news => ({
                        title: news.dataValues.title,
                        description: news.dataValues.content,
                        urlToImage: news.dataValues.imageUrl
                    }))
                }
            );
        } catch (error) {
            console.error('Error fetching popular news:', error);
            res.status(500).json({error: 'Server error'});
        }
    }
}

module.exports = NewsController;