process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const WPAPI = require("wpapi");
// const WpM = require('../../mongoModels/wp-archieve/wp-model-lp');
var wp = new WPAPI({
  endpoint: process.env.blog_url
});
let wpData = {};

const DomParser = require("dom-parser");
const parser = new DomParser();

// wp.categories().then
// Promises

let requests = {
  posts: () => {
    wp.posts()
      .then(function (data) {
        // do something with the returned posts
        // console.log("data", JSON.stringify(data));
      })
      .catch(function (err) {
        // handle error
        console.log("error", err);
      });
  },
};
wpData = {
  posts: async function (page) {
    return new Promise(async (resolve, reject) => {
      // const WpM = require('../../mongoModels/wp-archieve/wp-model-lp');
      //
      // // console.log('');
      // let m=await WpM.checkWIds(['1511','1522']);
      // console.log(m);
      let limit = 20;
      if (page == -1) {
        limit = 100;
      }
      if (!page || page <= 0) {
        page = 1;
      }

      wp.posts()
        .embed()
        .perPage(limit)
        .orderby("date")
        .param({
          name: "id"
        })
        .page(page)
        .excludeCategories(1)
        .then(function (data) {
          // do something with the returned posts
          let parsed = JSON.parse(JSON.stringify(data));
          // console.log("parsed", JSON.stringify(parsed[0]));
          let result = [];

          parsed.forEach((x) => {
            // let content=x.content.rendered.replace(/<[^>]+>/g, '');
            // let contents=parseHtmlEntities(content);
            result.push({
              title: parseHtmlEntities(x.title.rendered),
              wp_id: x.id,
              images: x.images,
              featured_Images: x.fimg_url,
              link: x.link,
              content: removeBlockQuotes(
                parseHtmlEntities(x.content.rendered.replace(/<[^>]+>/g, ""))
              ).substr(0, 1000),
              // author: x.author_meta.display_name,
              allImages: getImages(x.content.rendered),
              date: new Date(x.date),
              // content: parser.parseFromString(x.content.rendered)
            });
          });
          // console.log(parsed);

          resolve(result);
        })
        .catch(function (err) {
          // handle error
          console.log("error", err);
          reject(err);
        });
    });
  },
  getSinglePostSlug: async function (slug, post_type) {
    // console.log(slug);
    return new Promise(async (resolve, reject) => {
      if (post_type == 0)
        wp.posts()
        .embed()
        .slug(slug)
        .then(function (data) {
          // let parsed = JSON.parse(JSON.stringify(data));
          // console.log(data[0].yoast_head);
          let result = [];
          var x = data[0]
          result.push({
            title: parseHtmlEntities(x.title.rendered),
            wp_id: x.id,
            images: x.images,
            featured_Images: x.fimg_url,
            link: x.link,
            content: x.content.rendered,
            contentPared: removeBlockQuotes(
              parseHtmlEntities(x.content.rendered.replace(/<[^>]+>/g, ""))
            ),
            excerpt: x.excerpt.rendered,
            // author: x.author_meta.display_name,
            allImages: getImages(x.content.rendered),
            date: new Date(x.date),
            metaData: getMetaObject(x.yoast_head)

            // content: parser.parseFromString(x.content.rendered)
          });



          resolve(result);
        })
        .catch(function (err) {
          // handle error
          console.log("error", err);
          reject(err);
        });
      else
        wp.pages()
        .embed()
        .slug(slug)
        .then(function (data) {
          // let parsed = JSON.parse(JSON.stringify(data));
          // console.log(data[0].yoast_head);
          let result = [];
          var x = data[0]
          result.push({
            title: parseHtmlEntities(x.title.rendered),
            wp_id: x.id,
            images: x.images,
            featured_Images: x.fimg_url,
            link: x.link,
            content: x.content.rendered,
            excerpt: x.excerpt.rendered,
            // author: x.author_meta.display_name,
            allImages: getImages(x.content.rendered),
            date: new Date(x.date),
            metaData: getMetaObject(x.yoast_head)
            // content: parser.parseFromString(x.content.rendered)
          });



          resolve(result);
        })
        .catch(function (err) {
          // handle error
          console.log("error", err);
          reject(err);
        });
    });
  },
  getRelatedPosts: async function (treatment) {
    return new Promise(async (resolve, reject) => {

      let limit = 5;
      var catId;
      wp.categories()
        .slug(treatment.toLowerCase())
        .then(function (cats) {
          catId = cats[0].id;
          wp.posts()
            .categories(fictionCat.id)
            .embed()
            .perPage(limit)
            .orderby("date")
            .param({
              name: "id"
            })
            .then(function (data) {
              // do something with the returned posts
              let parsed = JSON.parse(JSON.stringify(data));
              let result = [];
              if (parsed.length > 0)
                parsed.forEach((x) => {
                  // let content=x.content.rendered.replace(/<[^>]+>/g, '');
                  // let contents=parseHtmlEntities(content);
                  result.push({
                    title: parseHtmlEntities(x.title.rendered),
                    wp_id: x.id,
                    images: x.images,
                    featured_Images: x.fimg_url,
                    link: x.link,
                    content: removeBlockQuotes(
                      parseHtmlEntities(x.content.rendered.replace(/<[^>]+>/g, ""))
                    ).substr(0, 1000),
                    // author: x.author_meta.display_name,
                    allImages: getImages(x.content.rendered),
                    date: new Date(x.date),
                    // content: parser.parseFromString(x.content.rendered)
                  });
                });

              resolve(result);
            })
            .catch(function (err) {
              // handle error
              console.log("error", err);
              reject(err);
            });
        })

    });
  },
}


// "sdjhksdf".indexOf()
module.exports = wpData;

function parseHtmlEntities(str) {
  return str.replace(/&#([0-9]{1,4});/gi, function (match, numStr) {
    var num = parseInt(numStr, 10); // read num as normal number
    return String.fromCharCode(num);
  });
}


function getMetaObject(strData) {
  var metaTagStr = strData.split("\n");
  var
    metaDataObj = {}
  metaTagStr.forEach((element, index) => {

    let html = parser.parseFromString(element, "text/html");
    let htmlMetTag = html.getElementsByTagName("meta")[0]; 
    
    console.log(element);
    if (element.includes('yoast-schema-graph'))
      metaDataObj["yoast_schema"] = element;
    if (htmlMetTag != undefined && htmlMetTag.getAttribute("property") != null) {
      let pro = htmlMetTag.getAttribute("property");
      let content = htmlMetTag.getAttribute("content");
      if (pro == "og:url") {
        content = content.replace('/blog', "")
      }
      if (pro.substr(0, 3) == 'og:') {
        pro = pro.substr(3)
        metaDataObj[pro] = content
      }
    }
  });
  console.log(metaDataObj);
  return metaDataObj;
}

function removeBlockQuotes(str) {
  return str.replace(/\[.*?\]/g, "");

  // function awh_filter_post_json( $data, $post, $context ) {
  //     $data = json_encode($data); //convert array or object to JSON string
  //     $data = preg_replace('/\[\/?et_pb.*?\]/', '', $data); //remove shortcodes
  //     $data = json_decode($data); //convert JSON String to array or object
  //     return $data;
  // }
}

function getImages(strData) {
  var pictures = [],
    m;
  let strHtml = `<div id="container"> ${strData} </div>`;
  const document = parser.parseFromString(strHtml);
  var str = document.getElementById("container").innerHTML,
    rex = /<img[^>]+src="?([^"\s]+)"?\s*/gi;

  while ((m = rex.exec(str))) {
    pictures.push(m[1]);
  }

  // var output = document.getElementById('output');
  // var index = 0;
  // pictures.forEach(function(picture){
  //     var pTag = document.createElement('p');
  //     pTag.innerHTML = '[' + index++ + '] ' + 'img tag found. URL extacted -> ' + picture;
  //     output.appendChild(pTag);
  // })
  return pictures;
}

// wpData.posts(1).then().catch()