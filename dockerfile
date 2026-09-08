FROM nginx:latest

COPY index.html style.css script.js profile1.jpg profile2.jpeg /usr/share/nginx/html/

EXPOSE 80
