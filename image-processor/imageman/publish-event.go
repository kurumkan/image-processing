package imageman

import (
	"encoding/json"
	"fmt"
	"github.com/nats-io/stan.go"
	"log"
	"os"
	"time"
)

var Client, _ = stan.Connect(
	os.Getenv("NATS_CLUSTER_ID"),
	os.Getenv("NATS_CLIENT_ID"),
	stan.NatsURL(os.Getenv("NATS_URL")),
)

type Event struct {
	FileName string `json:"fileName"`
	Folder string	`json:"folder"`
	ExpiresAt time.Time	`json:"expiresAt"`
}

func Publish(folder string, fileName string) {
	fmt.Println("clusterId: ", os.Getenv("NATS_CLUSTER_ID"))

	expiresAt := time.Now().Add(time.Second * 60 * 10)

	m := Event{ FileName: fileName, Folder: folder, ExpiresAt: expiresAt }
	data, _ := json.Marshal(m)

	fmt.Println("Publishing expiration event ", data)
	fmt.Println("expiresAt ", expiresAt)

	Client.PublishAsync("transformation:created", data, ackHandler)
}

func ackHandler(ackedNuid string, err error) {
	if err != nil {
		log.Printf("Warning: error publishing msg id %s: %v\n", ackedNuid, err.Error())
	} else {
		log.Printf("Received ack for msg id %s\n", ackedNuid)
	}
}