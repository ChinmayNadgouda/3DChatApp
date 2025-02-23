const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Message = require("../models/Message"); // Import the Message model
const { getLast100Messages, saveMessage } = require("../service/mongodb"); // Adjust path as needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
}, 10000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Message.deleteMany(); // Clear messages before each test
});

test("should save a message", async () => {
  await saveMessage("Hello, World!", "testUser", "testRoom");

  const messages = await Message.find();
  expect(messages.length).toBe(1);
  expect(messages[0].message).toBe("Hello, World!");
  expect(messages[0].username).toBe("testUser");
  expect(messages[0].room).toBe("testRoom");
});

test("should return last 100 messages sorted by createdAt", async () => {
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
    };
  for (let i = 1; i <= 105; i++) {
    await saveMessage(`Message ${i}`, `user${i}`, "testRoom");
    await sleep(1);
  }

  const messages = await getLast100Messages("testRoom");

  expect(messages.length).toBe(100);
  expect(messages[0].message).toBe("Message 6"); // Since last 100 messages should be returned
  expect(messages[99].message).toBe("Message 105");
});
