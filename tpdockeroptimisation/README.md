# TP Docker Optimisation

## Issues

### Optimisation

#### App side

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

#### Docker compose side

### Security
