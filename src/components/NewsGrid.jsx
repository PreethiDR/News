import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import { SERVER_URL, API_ENDPOINTS } from '../config';

const NewsGrid = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}${API_ENDPOINTS.allNews}`);
        setArticles(response.data.articles);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news articles');
        setLoading(false);
        console.error('Error fetching news:', err);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <Card key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
