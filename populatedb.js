#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  const categoryDetail = { name: name, description: description };

  const category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, numberInStock, price, category, cb) {
  const itemDetail = {
    name: name,
    description: description,
    price: price,
    numberInStock: numberInStock,
  };
  if (category != false) itemDetail.category = category;

  var item = new Item(itemDetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.parallel(
    [
      (callback) => {
        categoryCreate(
          'Cactus',
          'The word cactus describes a type of desert plant that has thick, leafless stems covered in prickly spines or sharp spikes. Cactus plants are able to thrive in dry climates because they store water in their stems. ... Some cacti are rich in vitamins, calcium and fibre.',
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Bulb',
          'Bulb, in botany, a modified stem that is the resting stage of certain seed plants, particularly perennial monocotyledons. A bulb consists of a relatively large, usually globe-shaped, underground bud with membraneous or fleshy overlapping leaves arising from a short stem.',
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Ivy',
          'Ivy, any plant of the genus Hedera, with about five species of evergreen woody vines (rarely shrubs), in the ginseng family (Araliaceae). The name ivy especially denotes the commonly grown English ivy (H. helix), which climbs by aerial roots with adhering disks that develop on the stems.',
          callback
        );
      },
    ],
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          'Acanthocalycium glaucum',
          'The scientific name is Acanthocalycium glaucum and the type of Cactus/Succulent',
          3,
          5,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Ariocarpus lloydii',
          'The scientific name is Ariocarpus lloydii and the type of Cactus/Succulent',
          1,
          3,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Bishop's Miter",
          'The scientific name is Astrophytum Myriostigma and the type of Cactus/Succulent',
          6,
          7,
          categories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Tulip',
          'Tulips are spring-blooming perennial bulbiferous plants with large, showy, brightly colored flowers. These flowers are often used as ornamental plants, in garden fixtures, and as cut flowers. They come in all sorts of colors, including pink, red, purple, yellow, and white. Tulips have a long history of cultivation and are native all the way from southern Europe to central Asia. The name Tulips is derived from a Persian word for turban due to the similarity in looks.',
          11,
          7,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Hyacinth',
          'Hyacinths are bulbous flowering plants that are known for their fragrant, vibrant colored flowers. The plants are native to the Mediterranean region from Palestine to Turkey. The flowers grow in clusters along the stalk and are commonly used as ornamental plants.',
          1,
          3,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Scilla',
          'Scilla perennial herbs form bulbs that thrive in subalpine meadows, seashores, and woodlands. They are native to Africa, the Middle East, and Europe. Some species of the Scilla have been naturalized to New Zealand, North America, and Australia. The flowers of the Scilla plants are purple, pink, blue, and white. They usually flower in early spring like most bulbs, but some species form new plants in autumn.',
          4,
          6,
          categories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Japanese ivy Plant',
          'Native to Asian countries, the Japanese ivy plant (Hedera rhombea) has somewhat of an exotic look.  Its large, dark green, heart-shaped leaves have white veins crisscrossing through them. Japanese ivy is known for its small, umbrella-shaped flower.  After the flowering stage, the plant bears round, black fruit.  While it has climbing capabilities, Japanese ivy typically doesn’t reach the heights that some other kinds do.',
          4,
          6,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Boston Ivy',
          'Boston Ivy (Parthenocissus tricuspidata) also sometimes called Japanese Creeper or Woodbine.  Technically, it’s a type of vine, but not a real ivy.  It’s categorized with ivies because of its leaves and inclination to climb.  The leaves are large, three-pointed, and green, reaching a width of 2″-8″ or 5-20 cm.  It climbs so well and provides so much coverage that people often grow it along the sides of homes and other buildings to provide shade.',
          7,
          4,
          categories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Shamrock Ivy',
          'Every year, this variety yields blackberries and flowers.  As the name suggests, the leaves on this plant are small and shamrock-shaped.',
          10,
          3,
          categories[2],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('results: ', results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
