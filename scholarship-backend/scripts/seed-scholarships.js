require("dotenv").config();
const mongoose = require("mongoose");
const Scholarship = require("../src/models/Scholarship");
const User = require("../src/models/User");

const MONGO_URI = process.env.MONGO_URI;

const scholarships = [
    {
        title: "Global Tech Future Scholarship",
        provider: "Tech Foundation",
        description: "Supporting the next generation of software engineers and data scientists. Open to all computer science undergraduates.",
        amount: 5000,
        seats: 5,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        status: "PUBLISHED",
        criteria: [{ field: "GPA", operator: "gt", value: 3.5 }]
    },
    {
        title: "Women in STEM Grant",
        provider: "STEM Archive",
        description: "Empowering women pursuing careers in Science, Technology, Engineering, and Mathematics.",
        amount: 3500,
        seats: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // +60 days
        status: "PUBLISHED",
        criteria: []
    },
    {
        title: "Community Leadership Award",
        provider: "Local Council",
        description: "For students who have demonstrated exceptional leadership in their local communities.",
        amount: 2000,
        seats: 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
        status: "PUBLISHED",
        criteria: []
    },
    {
        title: "AI Research Fellowship",
        provider: "OpenAI Institute",
        description: "A prestigious fellowship for students conducting research in Artificial Intelligence and Machine Learning.",
        amount: 10000,
        seats: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "PUBLISHED",
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        // Clear existing? Maybe not, just add if empty
        // await Scholarship.deleteMany({});

        // Find an admin user or create one (optional, but scholarship usually has createdBy)
        // For now, we leave createdBy empty or find the first user
        const admin = await User.findOne({ role: 'ADMIN' }) || await User.findOne({});

        const withUser = scholarships.map(s => ({ ...s, createdBy: admin?._id }));

        await Scholarship.insertMany(withUser);
        console.log(`Seeded ${scholarships.length} scholarships`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
