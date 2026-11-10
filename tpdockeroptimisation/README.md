# TP Docker Optimisation

## Issues

The logging middleware was reinventing the wheel, verbose and quire useless considering the lack of information it provided. It was switched to the dependency `morgan` that is widely used and provides insightful information to the logs of the application.
We went from uninsightful log such as

```log
[2026-11-10T08:06:11.122Z] GET /
```

To more insightful ones

```log
::ffff:127.0.0.1 - - [10/Nov/2026:08:01:50 +0000] "GET /big HTTP/1.1" 200 - "-" "Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0"
::ffff:127.0.0.1 - - [10/Nov/2026:08:02:15 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://localhost:3000/big" "Mozilla/5.0 (X11; Linux x86_64; rv:159.0) Gecko/20100101 Firefox/159.0"
```

---

The big file endpoint was currently blocking the execution of the whole app during the synchronous read of the big file therfore all requests comming through during that time were unhandled. The file read operation was changed to a stream to read the file asynchronously and avoids ptting the whole file into memory at once.

Verification : Two requests can now be handled simultaneously especially when serving the `big/` endpoint.

---

The big file was served from the same container it was hosted from, which is in itself bad practice as we should try to segregate data from the processing of it. If for instance we wanted to create multiple instances for load balancing, the large file would in fact be duplicated across all of them which would be a waste of space, therefore a new container was created which purpose is to store this big file.

### Docker config optimizations

The docker file provides uses root user whilst it it unecessarry and unsafe, therfore we remove it for security and tidyness purposes

```diff
[-] USER root
```

---

The docker file specifies dev environment which is not safe and can cause optimization issues.

```diff
[-] ENV NODE_ENV=development
```

---

The docker file exposes 3 ports [3000, 4000, 5000] whilst only port 3000 is used, we can safely remove the two last entries form this list to clean up the image.

```diff
[~] EXPOSE 3000
```

### Image size optimizations

- Initial image size : `1.88GB`
- Initial build time : `32.8s`

---

We have an issue where we are copying node_modules in the image which is bad practice, we should let `npm install` take care of intalling the dependencies, also we are already running `npm install` aswell so effectively doing the same step 2 times.

```diff
[-] COPY node_modules ./node_modules
```

- Image size : `1.88GB`
- Initial build time : `30.2s`

There is no tangible difference, but its better practice.

---
