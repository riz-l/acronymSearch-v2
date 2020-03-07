if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../../sw.js")
    .then(reg => console.log("service worker registered", reg))
    .catch(err => console.log("service worker not registered", err));
}

// // Getting data // TODO
// db.collection("collectionName")
//   .where("fieldName", "==", "")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCollectionName(doc);
//     });
//   });

// // Ordering data // TODO
// db.collection("collectionName")
//   .orderBy("name")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCollectionName(doc);
//     });
//   });
