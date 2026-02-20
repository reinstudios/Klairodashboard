import { createBrowserRouter, Navigate } from "react-router";
import React from "react";
import { Root } from "./components/Root";
import { BrandGuidelines } from "./components/BrandGuidelines";
import { Dashboard } from "./components/Dashboard";
import { Onboarding } from "./components/Onboarding";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: React.createElement(Navigate, { to: "/onboarding", replace: true }) },
      { path: "brand", Component: BrandGuidelines },
      { path: "dashboard", Component: Dashboard },
      { path: "onboarding", Component: Onboarding },
    ],
  },
]);
