### 1. Deduplication task

 `npm install && npm test` for the first task; it's a little broader than just deduplicating words.

### 2. The database question

Here's the schema in SQL (tested in Postgres):

```sql
CREATE TYPE public.role AS ENUM
    ('borrower', 'lender');

CREATE TABLE public.bookings
(
    rental_period daterange,
    borrower uuid,
    car uuid,
    id uuid,
    CONSTRAINT borrower FOREIGN KEY (borrower)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE public.cars
(
    id uuid NOT NULL,
    owner uuid,
    metadata jsonb,
    CONSTRAINT cars_pkey PRIMARY KEY (id),
    CONSTRAINT car_owner FOREIGN KEY (owner)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE public.users
(
    id uuid NOT NULL,
    role role NOT NULL,
    metadata jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)


```

And here's the query:

```sql
SELECT cars.id, owner, metadata, bookings.rental_period
	FROM public.cars cars, public.bookings bookings
	WHERE cars.id = bookings.car
    AND NOT bookings.rental_period && '[2021-01-04, 2021-02-01]'
```

Few "why" answers:

1. Relational database is clearly the right tool for this job. We have entities, we have relations, no need to overthink.
2. Date range rather than `start_date` and `end_date` - if the frontend would ever need to show an availability calendar, it wouldn't be a problem to parse this; otherwise, it's possible to build index from this, plus there are nice containment operators (instead of writing complicated queries with multiple conditions)
3. User's have a role which are enums; perhaps someone could be both borrower and lender, but for simplification (just like everything in this task, it's greeeaaatly simplified) I decided to make it an enum.

### 3. The Frontops question

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

with some nice defaults for development.

2. Copy the build, copy the nginx config which would definitely exist in real life scenario
3. Expose chosen port
4. Run nginx, prevent container from halting with global directive (could also be in the nginx.conf when present)


Steps to change the FQDN would be simply to change environmental variable in the CI build agent - whether its Jenkins, Travis, etc - into the desired one and run the build again.

Regarding versions of the API, I'd simply version them in the URL, so old frontend wouldn't get into an incompatibility issues upon deployment - so a `REACT_BASE_API_URL` would look something like: `://host:port/version`.