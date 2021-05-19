import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
let router = new VueRouter({
  // mode: 'history',
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
  routes: [
    {
      path: "/index",
      name: "index",
      component: () => import("../views/index.vue"),
      meta: {
        needCatid: true,
      },
    },
    {
      path: "/threed",
      name: "threed",
      component: () => import("../views/threed.vue"),
      meta: {
        needCatid: true,
      },
    },
    {
      path: "/",
      name: "twoD",
      component: () => import("../views/twoD.vue"),
      meta: {
        needCatid: true,
      },
    },
    {
      path: "/zyltest1",
      name: "zyltest1",
      component: () => import("../views/zyldemo/test1.vue"),
      meta: {
        needCatid: true,
      },
    },
    {
      path: "/zyltest2",
      name: "zyltest2",
      component: () => import("../views/zyldemo/test2.vue"),
      meta: {
        needCatid: true,
      },
    },
    // {
    //     path: '/map',
    //     name: 'map',
    //     component: () => import('../views/map.vue'),
    //     meta: {
    //         needCatid: true
    //     }
    // },
  ],
});
export default router;
