import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = 1; // TODO: Get this from auth context

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userId}/profile`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className={`star ${index < rating ? 'filled' : 'empty'}`}>
                ★
            </span>
        ));
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="profile-error">Could not load profile</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    <p className="email">{profile.email}</p>
                </div>
                <div className="trust-score-container">
                    <div className="trust-score">
                        <h2>Trust Score</h2>
                        <div className="score-value">{profile.trustScore.toFixed(1)}</div>
                        <div className="score-details">
                            <div className="score-stat">
                                <span>Total Ratings:</span>
                                <span>{profile.totalRatings}</span>
                            </div>
                            <div className="score-stat">
                                <span>Average Rating:</span>
                                <span>{profile.averageRating?.toFixed(1)} ★</span>
                            </div>
                            <div className="score-stat">
                                <span>Positive Reviews:</span>
                                <span>{profile.recentPositiveRatings}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ratings-section">
                <h2>Ratings & Reviews</h2>
                {profile.ratings && profile.ratings.length > 0 ? (
                    <div className="ratings-list">
                        {profile.ratings.map((rating) => (
                            <div key={rating.id} className="rating-item">
                                <div className="rating-header">
                                    <div className="rating-stars">
                                        {renderStars(rating.ratingValue)}
                                    </div>
                                    <div className="rating-date">
                                        {formatDate(rating.createdAt)}
                                    </div>
                                </div>
                                <div className="rating-comment">
                                    {rating.comment}
                                </div>
                                <div className="rating-footer">
                                    <span className="transaction-id">
                                        Transaction #{rating.transactionId}
                                    </span>
                                    {new Date(rating.editableUntil) > new Date() && (
                                        <span className="editable-badge">
                                            Editable
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-ratings">
                        <p>No ratings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 