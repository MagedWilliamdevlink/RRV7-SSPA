create a React Router v7 as a framework project that is SSR by default
the RRV7 app should handle at least 2 languages with English as the default, both / and /en/ do render the index with EN, make the second languages Polish.

Make the RRV7 in a folder as we going to have other microfrontend apps in Single-SPA in seperate folders, we would call the RRV7 the super shell as it will host the single-spa app shell and load the microfrontend apps

It should have the following routes:
/ => index has header footer and a welcome body with a counter app
en|ar/services/* => is a router that loads MFEs apps like /services/serviceA should load serviceA app

the microfrontend apps:
/services/serviceA => loads serviceA micro app which is another counter app with the name of the service
/services/serviceB => loads serviceB micro app which is another counter app with the name of the service

There should be no backend, just 3 folders
RRV7
serviceA
serviceB

In the RRV7 make a div that would host the microfrontend apps when the route matches

Consult the /Docs when needed about the frameworks
