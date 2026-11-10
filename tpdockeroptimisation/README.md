# TP Docker Optimisation

## Issues

### Optimisation

#### App side

1. The logging middleware was reinventing the wheel, verbose and quire useless considering the lack of information it provided. It was switched to the dependency `morgan` that is widely used and provides insightful information to the logs of the application.

#### Docker compose side

### Security
