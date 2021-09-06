FROM gocv

WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o /result
EXPOSE 3000
CMD [ "/result" ]