FROM golang:1.16-alpine

WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o /result
EXPOSE 3000
CMD [ "/result" ]