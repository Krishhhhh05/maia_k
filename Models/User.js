const mongoose = require("mongoose");

var mongoConn = require("../Database/mongoConn");
const debug = require("debug");
var user = mongoose.Schema(
  {
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    clinics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    location: {
      type: {
        type: String,
      },
      coordinates: [],
    },
    fee: { type: String, default: "2" },
    popularity: {
      type: Number,
      default: 0,
    },
    emailSent: false,
  },
  {
    strict: false,
  }
);

user.index({
  location: "2dsphere",
});
user.index({
  name: "text",
  "services.name": "text",
  "address.city": "text",
  "address.locality": "text",
  specialization: "text",
});
user.statics = {
  searchPartial: async function (city, name, locality, sname) {
    console.log(
      "city::",
      city,
      "\n name",
      name,
      "\n locality::",
      locality,
      "\n sname::",
      decodeURIComponent(sname)
    );
    let op1 = [],
      op = [];
    if (city && city !== "") {
      op.push({ "address.city": new RegExp(decodeURIComponent(city), "gi") });
    }
    if (name && name !== "") {
      op1.push({ name: new RegExp(decodeURIComponent(name), "gi") });
    }
    if (locality && locality !== "") {
      op.push({
        "address.locality": new RegExp(decodeURIComponent(locality), "gi"),
      });
    }
    if (sname && sname !== "") {
      let pp = decodeURI(sname);
      // console.log("56",pp);
      //  // pp=new RegExp( "m"+decodeURIComponent(sname) , "gi");

      pp.split(" ")
        .filter((x) => {
          console.log("001::" + x);
          return x != "";
        })
        .forEach((x) => {
          console.log("002::" + x);
          op1.push({
            "services.name": new RegExp(decodeURIComponent(x), "gi"),
          });
        });

      op1.push({
        "services.name": new RegExp("m" + decodeURIComponent(pp), "gi"),
      });
    }

    // console.log("11111",JSON.stringify(op));
    // console.log("22222",JSON.stringify(op1));
    let exp = [];

    if (Array.isArray(op) && op.length > 0) exp.push({ $or: op });
    if (Array.isArray(op1) && op1.length > 0) exp.push({ $or: op1 });
    console.log(JSON.stringify(exp));
    // if(exp.length>0){
    //
    // }
    let users = await this.find({
      visible: 1,
      $and: exp,
    });

    return users;
  },
  searchAll: async function (city, name, locality, sname) {
    let op1 = [],
      op = [];
    if (city && city !== "") {
      op.push({ "address.city": new RegExp(decodeURIComponent(city), "gi") });
    }
    if (name && name !== "") {
      op1.push({ name: new RegExp(decodeURIComponent(name), "gi") });
    }
    if (locality && locality !== "") {
      op.push({
        "address.locality": new RegExp(decodeURIComponent(locality), "gi"),
      });
    }
    if (sname && sname !== "") {
      let pp = decodeURI(sname);
      // console.log("56",pp);
      //  // pp=new RegExp( "m"+decodeURIComponent(sname) , "gi");

      pp.split(" ")
        .filter((x) => {
          console.log("001::" + x);
          return x != "";
        })
        .forEach((x) => {
          console.log("002::" + x);
          op1.push({
            "services.name": new RegExp(decodeURIComponent(x), "gi"),
          });
        });

      op1.push({ "services.name": new RegExp(decodeURIComponent(pp), "gi") });
    }

    // console.log("11111",JSON.stringify(op));
    // console.log("22222",JSON.stringify(op1));
    let exp = [];

    if (Array.isArray(op) && op.length > 0) exp.push({ $or: op });
    if (Array.isArray(op1) && op1.length > 0) exp.push({ $or: op1 });
    // console.log(exp);
    // if(exp.length>0){
    //
    // }
    console.log(JSON.stringify(exp).toString());
    let users = await this.find({
      visible: 1,
      status: "Verified",
      $or: exp,
    })
      .populate("doctors")
      .populate("clinics")
      .lean(true);
    console.log(users.filter((x) => x.role === "DOCTOR").length);
    // let k=0;
    // users.map(x=> {
    //     // let x=JSON.parse(JSON.stringify(t))
    //     // console.log(x.role);
    //     if (x.role=="DOCTOR"){
    //         k++;
    //         console.log(k);
    //     }
    // })
    return users;
  },
  // searchPartial: async function (city, name, locality, sname) {
  //     let exp=await this.find({$text: {$search: sname}})
  //     console.log(JSON.stringify(exp));
  //     // if(exp.length>0){
  //     //
  //     // }
  //     // let users = await this.find({
  //     //     $and: (exp)
  //     // });
  //
  //     return exp;
  // },
  searchAll2: async function (city, name, locality, sname) {
    let op1 = [],
      op = [];
    if (city && city !== "") {
      op.push({ "address.city": new RegExp(decodeURIComponent(city), "gi") });
    }
    if (name && name !== "") {
      op.push({ name: new RegExp(decodeURIComponent(name), "gi") });
    }
    if (locality && locality !== "") {
      op.push({
        "address.locality": new RegExp(decodeURIComponent(locality), "gi"),
      });
    }
    if (sname && sname !== "") {
      let pp = decodeURI(sname);
      // console.log("56",pp);
      //  // pp=new RegExp( "m"+decodeURIComponent(sname) , "gi");

      // pp.split(' ').filter(x => {
      //     console.log("001::" + x);
      //     return x != ''
      // }).forEach(x => {
      //     console.log("002::" + x);
      //     op.push({"services.name": new RegExp(decodeURIComponent(x), "gi")})
      // })

      op.push({ "services.name": new RegExp(decodeURIComponent(pp), "gi") });
    }

    // console.log("11111",JSON.stringify(op));
    // console.log("22222",JSON.stringify(op1));
    let exp = [];

    // if (Array.isArray(op) && op.length > 0) exp.push({$or: op});
    // if (Array.isArray(op1) && op1.length > 0) exp.push({$or: op1});
    // console.log(exp);
    // if(exp.length>0){
    //
    // }
    console.log(JSON.stringify(op));

    console.log(JSON.stringify(exp).toString());
    let users = await this.find({
      $or: op,
    }).lean(true);
    users = users.filter((x) => x.status === 1 && x.role == "Verified");
    console.log("users", users.length);
    // let k=0;
    // users.map(x=> {
    //     // let x=JSON.parse(JSON.stringify(t))
    //     // console.log(x.role);
    //     if (x.role=="DOCTOR"){
    //         k++;
    //         console.log(k);
    //     }
    // })
    return users;
  },

  searchPartialLocality: async function (q) {
    let op = { "address.locality": new RegExp(q, "gi") };

    let users = await this.find({
      $or: [op],
    });

    return users;
  },
};

user.pre("save", function (next) {
  debug("pre saving...");
  this.wasNew = this.isNew;
  next();
});
user.post("save", function () {
  console.log("saved doc", this);
  if (this.wasNew) {
    console.log("Sending email");
    require("../lib/notificationCotroller").onNewRegister(this);
  }
});

module.exports = mongoose.model("user", user, "user");
