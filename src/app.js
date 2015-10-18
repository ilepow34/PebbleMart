/**
 * PebbleMart
 * An app for Pebble that uses Walmart's APIs to help predict which items may sell quickly
 * The functionality is somewhat limited as I can only access the public APIs, and none of the internal ones
 */

var UI = require('ui');
var ajax = require('ajax');
//var Vector2 = require('vector2');

var parseFeed = function(data_trends, quantity) {
  var products = [];
  for(var i = 0; i < quantity; i++) {
    var title = data_trends.items[i].name.substring(0,24);
    var price = data_trends.items[i].salePrice;
    var desc = data_trends.items[i].shortDescription;
    products.push({
      title: title,
      subtitle: price,
      body: desc
    });
  }
  return products;
};

var menuItems;

ajax(
     {
       url:'http://api.walmartlabs.com/v1/trends?format=json&apiKey=9h8upmyngtx7fhexen9tpwut',
       type:'json'
     },
     function(data_trends) {
       menuItems = parseFeed(data_trends, 25);
       for(var i = 0; i < menuItems.length; i++) {
         console.log(menuItems[i].title);
       }
     },
     function(error) {
       console.log('Error connecting: ' + error);
     }
);

var vodName, vodPrice, vodDesc;

ajax(
      {
        url:'http://api.walmartlabs.com/v1/vod?format=json&apiKey=9h8upmyngtx7fhexen9tpwut',
        type:'json'
      },
      function(data_vod) {
        vodName = data_vod.name.substring(0,24);
        vodPrice = '$' + data_vod.salePrice;
        vodDesc = data_vod.shortDescription;
      },
      function(error) {
        console.log('Connection error: ' + error);
      }
    );

var main = new UI.Menu({
  sections: [{
      items: [{
        title: 'Trending Items',
        subtitle: 'on Walmart.com'
      }, {
        title: 'Value of the Day'
      }, {
        title: 'Low Inventory'
      }]
    }]
});
main.show();

main.on('select', function(e) {
  if(e.itemIndex === 0) { //Trending items
    // pulled ajax from here
    var index = 0;
    var trending = new UI.Card({
      title: menuItems[index].title,
      subtitle: '$' + menuItems[index].subtitle,
      body: menuItems[index].body
    });
    trending.show();
    trending.on('click', 'down', function(e){
      if (index < 25) {
        trending.title(menuItems[++index].title);
        trending.subtitle('$' + menuItems[index].subtitle);
        trending.body(menuItems[index].body);
      }
    });
    trending.on('click', 'up', function(e){
      if (index > 0) {
        trending.title(menuItems[--index].title);
        trending.subtitle('$' + menuItems[index].subtitle);
        trending.body(menuItems[index].body);
      }
    });
  }
  if(e.itemIndex === 1) { //Value of the day
    // pulled ajax from here
    var vodCard = new UI.Card({
      title: vodName,
      subtitle: vodPrice,
      body: vodDesc
    });
    console.log(vodName);
    vodCard.show();
  }
  if(e.itemIndex === 2) { //Low Inventory
    var lowInv = new UI.Menu({
      sections: [{
        items: [{
          title: 'Placeholder Text'
        }]
      }]
    });
    lowInv.show();
  }
});