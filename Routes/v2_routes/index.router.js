const express = require("express");
const router = express.Router();
const path = require("path");
const cache = require("../../lib/cache/cacheManager");

var controller = require("../../Controllers/v2_controller/helper.controller");

router.get("/home", controller.getHomeData);
router.get("/info", (r, rs, n) => {
  try {
    rs.json({
      type: "info_app",
      env: process.env.NODE_ENV,
      name: "patient app",
    });
  } catch (e) {
    n(e);
  }
});
router.get("/slug_data", cache(900), controller.getSlugData);
router.get("/_users", controller.getUser);
router.use(
  "/banners",
  require("../../Controllers/v2_controller/homeBanner.controller")
);
router.use(
  "/treatments",
  require("../../Controllers/v2_controller/homeTreatment.controller")
);
router.use(
  "/contactUs",
  require("../../Controllers/v2_controller/contactUs.controller")
);
router.use(
  "/seoRoutes",
  require("../../Controllers/v2_controller/seoRoutes.controller")
);

module.exports = router;
