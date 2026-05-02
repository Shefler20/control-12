import mongoose from "mongoose";
import config from "./config";

import User from "./models/User";
import Institution from "./models/Institution";
import Review from "./models/Review";
import Gallery from "./models/Gallery";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    await db.dropDatabase();
    console.log("DB dropped");

    const users = await User.create([
        {
            username: "admin",
            password: "123",
            role: "admin",
            displayName: "Admin User",
        },
        {
            username: "user",
            password: "123",
            role: "user",
            displayName: "Regular User",
        },
    ]);

    if (!Array.isArray(users)) {
        throw new Error("Users not created as array");
    }

    const [admin, user] = users;

    const institutions = await Institution.create([
        {
            title: "Central Coffee",
            description: "Cozy coffee shop in the city center",
            image: "fixtures/7.jpg",
            user: admin!._id,
        },
        {
            title: "Sakura Sushi",
            description: "Fresh Japanese sushi restaurant",
            image: "fixtures/6.jpg",
            user: admin!._id,
        },
        {
            title: "Burger House",
            description: "Best burgers in town",
            image: "fixtures/5.jpg",
            user: user!._id,
        },
    ]);

    if (!Array.isArray(institutions)) {
        throw new Error("Institutions not created as array");
    }

    const [coffeeShop, sushiBar, burgerPlace] = institutions;

    await Review.create([
        {
            user: user!._id,
            institution: coffeeShop!._id,
            description: "Great coffee and atmosphere!",
            ratings: {
                quality: 5,
                service: 5,
                interior: 4,
            },
        },
        {
            user: admin!._id,
            institution: sushiBar!._id,
            description: "Very fresh sushi, recommend!",
            ratings: {
                quality: 4,
                service: 4,
                interior: 5,
            },
        },
        {
            user: user!._id,
            institution: burgerPlace!._id,
            description: "Good burgers but service slow",
            ratings: {
                quality: 4,
                service: 3,
                interior: 3,
            },
        },
    ]);

    await Gallery.create([
        {
            institution: coffeeShop!._id,
            image: "fixtures/1.jpg",
            user: admin!._id,
        },
        {
            institution: coffeeShop!._id,
            image: "fixtures/2.jpg",
            user: admin!._id,
        },
        {
            institution: sushiBar!._id,
            image: "fixtures/3.jpg",
            user: admin!._id,
        },
        {
            institution: burgerPlace!._id,
            image: "fixtures/4.jpg",
            user: admin!._id,
        },
    ]);

    console.log("Seed completed");

    await db.close();
};

run().catch((error) => {
    console.log(error);
});