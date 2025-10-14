import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardLayout from "@/views/dashboard/DashboardLayout.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import MyBookings from "@/views/dashboard/MyBookings.vue";
import Favorites from "@/views/dashboard/Favorites.vue";
import Messages from "@/views/dashboard/Messages.vue";
import Boats from "@/views/dashboard/Boats.vue";
import Settings from "@/views/dashboard/Settings.vue";
import Notifications from "@/views/dashboard/Notifications.vue";
import BoatDetails from "../views/dashboard/BoatDetails.vue";
import ChooseIslands from "../views/dashboard/ChooseIslands.vue";
import AddOns from "../views/dashboard/AddOns.vue";
import Payment from "../views/dashboard/Payment.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/services",
      name: "services",
      component: () => import("../views/Services.vue"),
    },
    {
      path: "/fleet",
      name: "fleet",
      component: () => import("../views/Fleet.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/Contact.vue"),
    },
    {
      path: "/booknow",
      name: "booknow",
      component: () => import("../views/Booknow.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/Register.vue"),
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("../views/auth/ResetPassword.vue"),
    },

    // USER ROUTES
    {
      path: "/user",
      component: DashboardLayout,
      meta: { requiresAuth: true, role: "Customer" },
      children: [
        { path: "dashboard", name: "UserDashboard", component: Dashboard },
        { path: "bookings", name: "MyBookings", component: MyBookings },
        { path: "favorites", name: "Favorites", component: Favorites },
        { path: "messages", name: "Messages", component: Messages },
        { path: "boats", name: "Boats", component: Boats },
        { path: "notifications", name: "Notifications", component: Notifications },
        { path: "settings", name: "Settings", component: Settings },
        {
          path: "boat/:id",
          name: "BoatDetails",
          component: BoatDetails,
          props: true,
        },
        {
          path: "choose-islands/:id",
          name: "ChooseIslands",
          component: ChooseIslands,
          props: true,
        },
         {
          path: "modify-booking/:id",
          name: "ModifyBooking",
          component: () => import("../components/ModifyBooking.vue"),
        },
        {
          path: "rate-booking/:id",
          name: "RateBooking",
          component: () => import("../views/dashboard/RateBooking.vue"),
        },
        { path: "addons/:id", name: "AddOns", component: AddOns, props: true },
        {
          path: "payment/:id",
          name: "Payment",
          component: Payment,
          props: true,
        },
      ],
    },

    // OWNER ROUTES
    {
      path: "/owner",
      component: () => import("../views/ownerdashboard/OwnerLayout.vue"),
      meta: { requiresAuth: true, role: "BoatOwner" },
      children: [
        {
          path: "ownerdashboard",
          name: "OwnerDashboard",
          component: () => import("../views/ownerdashboard/OwnerDashboard.vue"),
        },
        {
          path: "myboats",
          name: "OwnerMyBoats",
          component: () => import("../views/ownerdashboard/OwnerMyBoats.vue"),
        },
        {
          path: "bookings",
          name: "OwnerBookings",
          component: () => import("../views/ownerdashboard/OwnerBookings.vue"),
        },
        {
          path: "maintenance",
          name: "OwnerMaintenance",
          component: () => import("../views/ownerdashboard/Maintenance.vue"),
        },
        {
          path: "messages",
          name: "OwnerMessages",
          component: () => import("../views/ownerdashboard/OwnerMessages.vue"),
        },
        {
          path: "reviews",
          name: "OwnerReviews",
          component: () => import("../views/ownerdashboard/OwnerReviews.vue"),
        },
        {
          path: "earnings",
          name: "OwnerEarnings",
          component: () => import("../views/ownerdashboard/OwnerEarnings.vue"),
        },
        {
          path: "islands",
          name: "OwnerIslands",
          component: () => import("../views/ownerdashboard/OwnerIslands.vue"),
        },
        {
          path: "foodpackages",
          name: "OwnerFoodPackages",
          component: () =>
            import("../views/ownerdashboard/OwnerFoodPackages.vue"),
        },
        {
          path: "settings",
          name: "OwnerSettings",
          component: () => import("../views/ownerdashboard/OwnerSettings.vue"),
        },
      ],
    },

    // ADMIN ROUTES
    {
      path: "/admin",
      component: () => import("../views/admindashboard/AdminLayout.vue"),
      meta: { requiresAuth: true, role: "Admin" },
      children: [
        {
          path: "admindashboard",
          name: "AdminDashboard",
          component: () => import("../views/admindashboard/AdminDashboard.vue"),
        },
        {
          path: "fleetmanagement",
          name: "FleetManagement",
          component: () =>
            import("../views/admindashboard/FleetManagement.vue"),
        },
        {
          path: "bookings",
          name: "AdminBookings",
          component: () => import("../views/admindashboard/Bookings.vue"),
        },
        {
          path: "boatowners",
          name: "BoatOwners",
          component: () => import("../views/admindashboard/BoatOwners.vue"),
        },
        {
          path: "customers",
          name: "Customers",
          component: () => import("../views/admindashboard/Customers.vue"),
        },
        {
          path: "reviews",
          name: "AdminReviews",
          component: () => import("../views/admindashboard/AdminReviews.vue"),
        },
        {
          path: "reports",
          name: "Reports",
          component: () => import("../views/admindashboard/Reports.vue"),
        },
        {
          path: "routes",
          name: "RoutesIslands",
          component: () => import("../views/admindashboard/Routes.vue"),
        },
        {
          path: "settings",
          name: "AdminSettings",
          component: () => import("../views/admindashboard/Settings.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const publicPages = [
    "home",
    "about",
    "services",
    "fleet",
    "contact",
    "booknow",
    "login",
    "register",
    "reset-password",
  ];

  if (user) {
    if (publicPages.includes(to.name)) {
      if (user.user_type === "Admin") {
        return next("/admin/admindashboard");
      }
      if (user.user_type === "BoatOwner") {
        return next("/owner/ownerdashboard");
      }
      if (user.user_type === "Customer") {
        return next("/user/dashboard");
      }
    }
  }

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/login");
    }
    // Role-based protection
    if (to.meta.role && user.user_type !== to.meta.role) {
      if (user.user_type === "Admin") {
        return next("/admin/admindashboard");
      }
      if (user.user_type === "BoatOwner") {
        return next("/owner/ownerdashboard");
      }
      if (user.user_type === "Customer") {
        return next("/user/dashboard");
      }
    }
  }

  next();
});

export default router;
