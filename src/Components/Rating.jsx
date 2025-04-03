import React, { useState } from 'react';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
import { Box, Typography, TextField, Button, Rating as MuiRating } from '@mui/material';
import axios from 'axios';
import './Rating.css';

const Rating = ({ transactionId, raterId, ratedUserId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/swapsaviour/ratings', {
        transactionId,
        raterId,
        ratedUserId,
        ratingValue: rating,
        comment
      });

      if (response.status === 200) {
        setRating(0);
        setComment('');
        if (onRatingSubmitted) {
          onRatingSubmitted(response.data);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Box className="rating-container">
      <Typography variant="h6" gutterBottom>
        Rate this transaction
      </Typography>
      
      <Box className="rating-stars">
        <MuiRating
          value={rating}
          precision={0.5}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarBorder />}
          icon={<Star />}
          halfIcon={<StarHalf />}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="rating-comment"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={rating === 0}
        className="rating-submit"
      >
        Submit Rating
      </Button>
    </Box>
  );
};

export default Rating; 