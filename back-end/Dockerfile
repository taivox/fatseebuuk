FROM golang:1.20 AS build
LABEL version="1.0" Author="taivox"
WORKDIR /go/src/back-end
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN go build -o /bin/back-end ./cmd/api

# FROM debian:11
FROM gcr.io/distroless/base-debian11
COPY --from=build /bin/back-end/ /back-end
COPY database/ /database
EXPOSE 8080
ENTRYPOINT ["/back-end"]

# Add a terminal
# RUN apt-get update && apt-get install -y \
#     bash \
#     && rm -rf /var/lib/apt/lists/*

# CMD ["/bin/bash"]

