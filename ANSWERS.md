### 1. Deduplication task

 `npm install && npm test` for the first task; it's a little broader than just deduplicating words.

### 2. The database question



### 3. Frontops question

There are many ways to do it, and it mostly depends on time/effort/expected results. The one below is pretty elastic.

I'd deploy a `create-react-app` built app with Docker, so our Dockerfile would look something like this:

```Dockerfile
FROM nginx:alpine
COPY ./build /var/www
# COPY nginx.conf /etc/nginx/nginx.conf - the should be an extensive configuration matching app's routing here
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]

```

It would break down to what follows:

1. Build the application inside of the CI agent. If we are using `create-react-app`, one can consume environmental variables just as if they were present in the `.js` files as long as they start with `REACT_APP`; e.g. `process.env.REACT_APP_BASE_API_URL`. Similarly they can be used in the template file (`public/index.html`) to set <base href> if necessary. The variables have to be present in the continous integration agent during the build, which is usually managed form the CI's interface.

The app would then have a `config.js` file which would read the environmental variables baked in the build process:

```javascript
export default {
    "api_url": process.env.REACT_APP_BASE_API_URL || "http://localhost:3000/"
}
```

2. Copy the build, copy the nginx config which would definitely exist in real life scenario
3. Expose chosen port
4. Run nginx, prevent container from halting with global directive (could also be in the nginx.conf when present)


Steps to change the FQDN would be simply to change environmental variable in the CI build agent - whether its Jenkins, Travis, etc - into the desired one and run the build again.

Regarding versions of the API, I'd simply version them in the URL, so old frontend wouldn't get into an incompatibility issues upon deployment - so a `REACT_BASE_API_URL` would look something like: `://host:port/version`.