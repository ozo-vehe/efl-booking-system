import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import VCalendar from "v-calendar";
import "v-calendar/style.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(VCalendar, {});
app.use(router);

app.mount("#app");

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token && (to.path === "/" || to.path === "/signup" || to.path === "/verify-email" || to.path === "/forget-password")) {
    next("/booking-request");
  } else if (!token && to.path !== "/" && to.path !== "/signup" && to.path !== "/verify-email" && to.path !== "/forget-password") {
    next("/");
  } else {
    next();
  }
});
