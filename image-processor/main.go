package main

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"image"
	"image-converter/imageman"
	"image/jpeg"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var Client = initS3Client()

func main() {
	fmt.Println("Starting image-processor on port 3000")
	router := gin.Default()
	router.GET("/api/transform/:transformation/:folder/:fileName", processImage)
	router.Run(":3000")
}

func processImage(c *gin.Context) {
	fmt.Println("Request")
	transformation := c.Param("transformation")
	folder := c.Param("folder")
	fileName := c.Param("fileName")

	originalUrl := os.Getenv("STORAGE_URL") + folder + "/" + fileName

	fmt.Println("originalUrl", originalUrl)

	img, err := imageman.Grayscale(originalUrl, true)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{ "code": "PAGE_NOT_FOUND", "message": "Page not found" })
		return
	}

	path := folder + "/" + transformation + "_" + fileName
	buffer := new(bytes.Buffer)
	jpeg.Encode(buffer, img, nil)
	err = uploadToCloud(path, buffer.String())

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{ "code": "SERVER_ERROR", "message": "Failed to process image" })
		return
	}

	resultUrl := "/api/images/transform/" + transformation + "/" + folder + "/" + fileName

	fmt.Println("SUCCESS " + resultUrl)
	imageman.Publish(folder, transformation + "_" + fileName)
	c.Redirect(http.StatusMovedPermanently, resultUrl)
}

func initS3Client() *s3.S3 {
	//SetEnv()
	key := os.Getenv("SPACES_KEY")
	secret := os.Getenv("SPACES_SECRET")
	endpoint := os.Getenv("SPACES_URL")

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(key, secret, ""),
		Endpoint:    aws.String(endpoint),
		Region:      aws.String("eu-west-2"),
	}

	newSession := session.New(s3Config)
	s3Client := s3.New(newSession)
	return s3Client
}

func uploadToCloud(fileName string, fileContents string) error {
    bucket := os.Getenv("SPACES_BUCKET")
	object := s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
		Body:   strings.NewReader(fileContents),
		ACL:    aws.String("public-read"),
		ContentType: aws.String("image/jpeg"),
		Metadata: map[string]*string{
			"x-amz-meta-my-key": aws.String("your-value"),
		},
	}
	_, err := Client.PutObject(&object)

	if err != nil {
		return err
	}

	return nil
}

// saving to local file system
func SaveJPG(img image.Image, path string) (error, string) {
	f, err := os.Create(path)
	if err != nil {
		return err, path
	}
	defer f.Close()
	if err := jpeg.Encode(f, img, nil); err != nil {
		return err, path
	}
	if err := f.Close(); err != nil {
		return err, path
	}

	return nil, path
}