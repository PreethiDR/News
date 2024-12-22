const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Check if API key is loaded
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('ERROR: API_KEY is not set in .env file');
  console.error('Please create a .env file in the server directory with your NewsAPI key');
  console.error('Example: API_KEY=your_newsapi_key_here');
  process.exit(1);
}

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function fetchNews(url, res) {
  console.log('Fetching news from URL:', url.replace(API_KEY, 'API_KEY_HIDDEN')); // Hide API key in logs
  axios.get(url)
    .then(response => {
      if (response.data.totalResults > 0) {
        res.json({
          status: 200,
          success: true,
          message: "Successfully fetched the data",
          data: response.data
        });
      } else {
        res.json({
          status: 200,
          success: true,
          message: "No more results to show"
        });
      }
    })
    .catch(error => {
      console.error('Error details:', error.response ? error.response.data : error.message);
      res.json({
        status: 500,
        success: false,
        message: "Failed to fetch data from the API",
        error: error.response ? error.response.data : error.message
      });
    });
}

app.get("/all-news", (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 40;
  let page = parseInt(req.query.page) || 1;
  let url = `https://newsapi.org/v2/everything?q=world&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  console.log('Request parameters:', { pageSize, page }); // Debug log
  fetchNews(url, res);
});

const PORT = process.env.PORT || 3012;
app.listen(PORT, function () {
  console.log(`Server is running at port ${PORT}`);
  console.log('API Key status:', API_KEY ? 'Loaded successfully' : 'Not loaded');
});
