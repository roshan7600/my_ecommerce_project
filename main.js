import "./style.css";
import products from "./api/products.json";
import { showProductContainer } from "./homeProductCards";
import { updateHeaderWithUserInfo } from "./auth.js";

// Define a function named `showProductContainer` that takes an array of products as input.
showProductContainer(products);

// Update header with user info if logged in
updateHeaderWithUserInfo();

//todo Don't Forget To LIKE SHARE & SUBSCRIBE TO THAPA TECHNCIAL YOUTUBE CHANNEL 👉 https://www.youtube.com/thapatechnical
