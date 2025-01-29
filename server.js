const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5500;

require('dotenv').config();
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;


// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(bodyParser.json());

// API Endpoint to Send a Slack Message
app.post('/send-message', async (req, res) => {
    const { date, time, email } = req.body;

    if (!date || !time || !email) {
        return res.status(400).json({ error: 'Date, time, and email are required.' });
    }

    try {
        const message = `New Meeting Request:\nDate: ${date}\nTime: ${time}\nEmail: ${email}`;

        const response = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: SLACK_CHANNEL_ID,
                text: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.ok) {
            res.status(200).json({ success: true, message: 'Message sent to Slack!' });
        } else {
            res.status(500).json({ success: false, error: response.data.error });
        }
    } catch (error) {
        console.error('Error sending message to Slack:', error);
        res.status(500).json({ success: false, error: 'Failed to send message to Slack.' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
