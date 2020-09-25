import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import "./FoodCategories.css";

function MealListByCategory({ name }) {
  const [foodListCategories, setFoodListCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [message, setMessage] = useState();

  const username = window.sessionStorage.getItem("User");

  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
      );
      setFoodListCategories(response.data.meals);
    }

    getData();
  }, [name]);

  const handleClose = () => {
    setShow(false);
  };

  async function getData() {
    const responseFavorites = await axios.get(
      `http://localhost:8080/yellowrestaurant/api/v1/user/${username}/favorites`
    );
    setFavoriteMeals(responseFavorites.data);
  }

  const faveClick = (newFavoriteMeal) => {
    getData();

    let alreadyFave = false;
    for (let item of favoriteMeals) {
      if (item.idMeal === newFavoriteMeal.idMeal) {
        alreadyFave = true;
      }
    }

    if (alreadyFave == false) {
      setMessage("Meal added to favorites :)");
      setShow(true);
      fetch(
        `http://localhost:8080/yellowrestaurant/api/v1/user/${username}/favorites/${newFavoriteMeal.idMeal}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFavoriteMeal),
        }
      ).then((response) => {
        console.log(response);
      });
    } else {
      // alert("Meal already in favorites!");
      setMessage("Meal already in favorites!");
      setShow(true);
    }
  };

  return (
    <div className="container FoodCategoriesContainer">
      {foodListCategories.map((item) => (
        <div
          key={item.strMeal}
          className="card FoodCategoriesCard"
          style={{ width: "18rem", display: "inline-block" }}
        >
          <img
            className="card-img-top cardImg"
            src={item.strMealThumb}
            alt="Card image cap"
          />
          <div className="card-body">
            <h5 className="card-title">{item.strMeal.substring(0, 20)}</h5>
            <button
              style={{ borderStyle: "none", backgroundColor: "cyan" }}
              type="button"
              onClick={() => faveClick(item)}
            >
              <h5>
                <FaHeart style={{ color: "white" }} />
              </h5>
            </button>{" "}
            <Link to={`/food-details/${item.idMeal}`}>
              <button type="button" value="submit" className="btn btn-info">
                Info
              </button>{" "}
            </Link>
            <a
              href="#"
              onClick={() => handleClick(item)}
              className="btn btn-primary"
            >
              Order
            </a>
          </div>
        </div>
      ))}
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title>Good choice!</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body>Meal added to favorites :)</Modal.Body> */}
          <Modal.Body>{message}</Modal.Body>
        </Modal>
      </>
    </div>
  );
}

function handleClick(mealToAddToCart) {
  // alert("Meal added to your shopping cart!");
  const username = window.sessionStorage.getItem("User");
  const image = mealToAddToCart.strMealThumb.replace(
    "https://www.themealdb.com/images/media/meals/",
    ""
  );
  fetch(
    `http://localhost:8080/yellowrestaurant/api/v1/cart/${username}/meal/${mealToAddToCart.strMeal}/tocart/${image}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealToAddToCart),
    }
  ).then((response) => {
    console.log(response);
  });
}

export default MealListByCategory;
