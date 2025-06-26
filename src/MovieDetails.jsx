import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const MovieDetails = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchMovieDetails = async () => {
        console.log('Fetching movie with ID:', id);
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = `${API_BASE_URL}/movie/${id}`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }

            const data = await response.json();
            setMovieDetails(data);
        } catch (error) {
            console.error(`Error fetching movie details: ${error}`);
            setErrorMessage('Could not fetch movie details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    return (
        <main>
            {/*<div className="pattern" />*/}
            {/*<div className="wrapper">*/}
                <div>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : movieDetails ? (

                        <div className="movie-details">
                            <img
                                src={movieDetails.poster_path
                                    ? `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                                    : '/no-movie.png'}
                                alt={movieDetails.title}
                                className="my-4 rounded-lg"
                            />

                        <div className="details-content">
                            <h1 className="text-3xl font-bold">{movieDetails.title}</h1>
                            <p><strong>Overview:</strong> {movieDetails.overview}</p>
                            <p><strong>Rating:</strong> {movieDetails.vote_average}</p>
                            <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
                            <p><strong>Language:</strong> {movieDetails.original_language}</p>
                            <p><strong>Genres:</strong> {movieDetails.genres.map(g => g.name).join(', ')}</p>
                            <p><strong>Runtime:</strong> {movieDetails.runtime} minutes</p>
                        </div>
                        </div>
                    ) : (
                        <p>No movie details found.</p>
                    )}
                </div>
            {/*</div>*/}
        </main>
    );
};

export default MovieDetails;
