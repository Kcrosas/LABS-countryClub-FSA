const Sequelize = require("sequelize");
const { VARCHAR, DATE, INTEGER, STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/club_db"
);

const Facility = conn.define("facility", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  fac_name: {
    type: STRING(100),
    allowNull: false,
    unique: true,
  },
});

const Member = conn.define("member", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  first_name: {
    type: STRING(100),
    allowNull: false,
    unique: true,
  },
});

const Booking = conn.define("booking", {
  /*id: {
    type: INTEGER,
    primaryKey: true,
  } ,
  startTime: {
    allowNull: false,
    type: DATE,
  },
  endTime: {
    allowNull: false,
    type: DATE,
  },*/
});

//Member belongs to one other member and that member will be  sponsor
Member.belongsTo(Member, { as: "sponsor" });
//Member can have many members as sponsored -- their foreign key will be your sponsorId
Member.hasMany(Member, { as: "sponsored", foreignKey: "sponsorId" });
//A booking belongs to one member and belongs to one facility
Booking.belongsTo(Member, { as: "bookedBy" });
Booking.belongsTo(Facility, { as: "facility" });

const members = ["moe", "lucy", "larry", "ethyl"];
const facilities = ["tennis", "ping-pong", "raquet-ball", "bowling"];

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [tennis, pingpong, raquetBall, bowling] = await Promise.all(
    facilities.map((fac_name) => Facility.create({ fac_name }))
  );
  const [moe, lucy, larry, ethyl] = await Promise.all(
    members.map((first_name) => Member.create({ first_name }))
  );

  await Booking.create({
    bookedById: lucy.id,
    facilityId: tennis.id,
  });

  moe.sponsorId = lucy.id;
  larry.sponsorId = lucy.id;
  ethyl.sponsorId = moe.id;

  await Promise.all([ethyl.save(), larry.save(), moe.save()]);
};

module.exports = {
  syncAndSeed,
  models: {
    Facility,
    Member,
    Booking,
  },
};
