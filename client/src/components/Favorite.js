import React, { useState, useEffect } from 'react';
import '../components/style.css';

import { Button, Card } from 'react-bootstrap';
import Axios from 'axios';
export default function FavoritePage(props) {
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        const checkLoggedIn = async () => {
            if (localStorage.getItem('jwt')) {

                Axios({
                    method: 'get',
                    url: 'http://localhost:5000/api/users/isAuthenticated',
                    headers: {
                        'Authorization': localStorage.getItem('jwt'),
                    }
                }).catch(err => {
                    window.location = '/';
                    localStorage.removeItem('jwt');
                });
            }

        }
        checkLoggedIn();
        readFavoriteMovies();
    }, []);
    const readFavoriteMovies = async () => {
        await Axios({
            method: 'get',
            url: 'http://localhost:5000/api/protected/favorites',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            }
        }).then(res => {

            setFavoriteMovies(res.data);
        });
    }
    const removeFavorite = async (id) => {
        await Axios({
          method: 'delete',
          url: 'http://localhost:5000/api/protected/'+id,
          headers: {
            'Authorization': localStorage.getItem('jwt'),
          },
        }).then(res => {
          setFavoriteMovies(res.data);
        });
      }
    const Movie = (props) => ((
        
        <div style={{
            cursor: "pointer"
        }}onClick={()=>{removeFavorite(props.movie.movieId)}}>
            <img className="moviePoster movie-card" key={props.movie.key} src={props.movie.posterPath ? "https://image.tmdb.org/t/p/original" + props.movie.posterPath : require("../Assets/no_poster.jpg")} width="210px" height="310px" alt="movie poster" ></img>
        </div>

    
    ));

    return (
        <div className="container-fluid movie-page">

            <div className="container-fluid favorite" style={{
            marginTop: "80px",
            display: "flex",
            alignItems: favoriteMovies.length ? "flex-start" : "center",
            justifyContent: favoriteMovies.length ? "flex-start" : "center",
            flexWrap: "wrap",
            alignContent: favoriteMovies.length ? "flex-start" : "center",
            width: "100%",
            height: "100%"
        }}>
                {favoriteMovies.map(currentMovie => <Movie movie={currentMovie} key={currentMovie._id} />)}
                {favoriteMovies.length<=0&&<div style={{
                    width: "500px"
                }}><h4 style={{
                    marginTop: "80px",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "36px"
                }}>No movies favorited! Go back to Home and favorite some movies</h4></div>}
            </div>
        </div>
    );

}