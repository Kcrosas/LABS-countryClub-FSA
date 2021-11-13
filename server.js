const express = require("express");
const app = express();

const {
  syncAndSeed,
  models: { Facility, Member, Booking },
} = require("./db");

app.get("/api/members", async (req, res, next) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Member,
          as: "sponsor",
        },
        {
          model: Member,
          as: "sponsored",
        },
      ],
    });
    res.send(members);
  } catch (error) {
    next(error);
  }
});

app.get("/api/facilities", async (req, res, next) => {
  try {
    const facilities = await Facility.findAll();
    res.send(facilities);
  } catch (error) {
    next(error);
  }
});

app.get("/api/bookings", async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Member,
          as: "bookedBy",
        },
      ],
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();
