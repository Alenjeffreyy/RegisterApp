const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyAdminNewUser = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const user = snap.data();

    const message = {
      notification: {
        title: "New User Registered",
        body: `${user.name} has registered.`,
      },
      topic: "admin",
    };

    try {
      await admin.messaging().send(message);
      console.log("Notification sent to admin.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
