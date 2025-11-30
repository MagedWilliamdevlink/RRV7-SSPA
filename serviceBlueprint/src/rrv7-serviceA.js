import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  domElementGetter: () => {
    let el = document.getElementById("single-spa-application:@rrv7/serviceA");
    if (!el) {
      el = document.createElement("div");
      el.id = "single-spa-application:@rrv7/serviceA";
      document.body.appendChild(el);
    }
    return el;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
