FROM golang:1.20 AS build
LABEL version="1.0" Author="taivox"
WORKDIR /go/src/back-end
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN go build -o /bin/back-end ./cmd/api

FROM gcr.io/distroless/base-debian11
COPY --from=build /bin/back-end/ /back-end
COPY database/ /database
EXPOSE 8080
ENTRYPOINT ["/back-end"]
