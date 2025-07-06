import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import Post from '../components/Post'
import api from '../utils/api'
import axios from 'axios'

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/social_media');
      //const res = await axios.get('https://jsonplaceholder.typicode.com/posts/');
      console.log(res.data);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        posts.map(post => (
          <div key={post.post_id}>
            <Post {...post} />
          </div>
        ))
      )}
    </Container>
  );
};

export default Home;