package main

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"image-converter/imageman"
	"image/jpeg"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var Client = initS3Client()

func main() {
	fmt.Println("Starting image-processor")
	router := gin.Default()
	router.GET("/api/transform/:transformations/:folder/:fileName", processImage)
	router.Run(":3000")
}

func processImage(c *gin.Context) {
	fmt.Println("Request")
	folder := c.Param("folder")
	fileName := c.Param("fileName")

	originalUrl := os.Getenv("STORAGE_URL") + folder + "/" + fileName

	fmt.Println("originalUrl", originalUrl)

	img, err := imageman.LoadImage(originalUrl)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{ "code": "PAGE_NOT_FOUND", "message": "Page not found" })
		return
	}

	transformations := c.Param("transformations")
	transformationList := strings.Split(transformations, ",")

	for _, t := range(transformationList) {
		if strings.Contains(t, "blur:") {
			values := strings.Split(t, ":")

			if len(values) < 2 {
				fmt.Println("Not enough arguments", err)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Not enough arguments" })
				return
			}

			size, err := strconv.Atoi(values[1])
			if err != nil {
				fmt.Println("Blur should contain size", err, size)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Blur should contain size" })
				return
			}

			img, err = imageman.Blur(img, size)
		}  else if strings.Contains(t, "blur-face") {
            img, err = imageman.BlurFace(img)
        } else if strings.Contains(t, "crop-face") {
            values := strings.Split(t, ":")
            if len(values) == 3 {
                width, err := strconv.Atoi(values[1])
                if err != nil {
                    fmt.Println("Invalid width", err, width)
                    c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid width" })
                    return
                }
                height, err := strconv.Atoi(values[2])
                if err != nil {
                    fmt.Println("Invalid height", err, height)
                    c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid height" })
                    return
                }
                img, err = imageman.CropFace(img, width, height)
            } else {
                img, err = imageman.CropFace(img, 0, 0)
            }
        } else if strings.Contains(t, "brightness") {
			values := strings.Split(t, ":")

			if len(values) < 2 {
				fmt.Println("Not enough arguments", err)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Not enough arguments" })
				return
			}

			brightness, err := strconv.Atoi(values[1])
			if err != nil {
				fmt.Println("Provide brighntess value", err, brightness)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Provide brighntess value" })
				return
			}

			img, err = imageman.Brightness(img, brightness)
		} else if strings.Contains(t, "contrast") {
			values := strings.Split(t, ":")

			if len(values) < 2 {
				fmt.Println("Not enough arguments", err)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Not enough arguments" })
				return
			}

			contrast, err := strconv.Atoi(values[1])
			if err != nil {
				fmt.Println("Provide contrast value", err, contrast)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Provide contrast value" })
				return
			}

			img, err = imageman.Contrast(img, contrast)
		} else if strings.Contains(t, "grayscale") {
			img, err = imageman.Grayscale(img)
		} else if strings.Contains(t, "invert") {
			img, err = imageman.Invert(img)
		} else if strings.Contains(t, "resize") {
			values := strings.Split(t, ":")
			if len(values) != 3 {
				c.JSON(http.StatusBadRequest, gin.H{ "message": "provide height and width" })
				return
			}

			width, err := strconv.Atoi(values[1])
			if err != nil {
				fmt.Println("Invalid width", err, width)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid width" })
				return
			}
			height, err := strconv.Atoi(values[2])
			if err != nil {
				fmt.Println("Invalid height", err, height)
				c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid height" })
				return
			}
			img, err = imageman.Resize(img, width, height)
		} else if strings.Contains(t, "flip") {
			values := strings.Split(t, ":")
			if len(values) != 2 {
				c.JSON(http.StatusBadRequest, gin.H{ "message": "provide direction: horizontal or vertical" })
				return
			}
			direction := values[1]

			if direction != "horizontal" && direction != "vertical" {
				c.JSON(http.StatusBadRequest, gin.H{ "message": "provide direction: horizontal or vertical" })
				return
			}

			img, err = imageman.Flip(img, direction)
		} else if strings.Contains(t, "border") {
            values := strings.Split(t, ":")
            if len(values) != 3 {
                c.JSON(http.StatusBadRequest, gin.H{ "message": "provide border color and width" })
                return
            }

            borderWidth, err := strconv.Atoi(values[1])
            if err != nil {
                fmt.Println("Invalid width", err, borderWidth)
                c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid width" })
                return
            }

            borderColor := values[2]

            img, err = imageman.Border(img, borderWidth, borderColor)
        } else {
			c.JSON(http.StatusBadRequest, gin.H{ "message": "Invalid transformation type" })
			return
		}
	}

	path := folder + "/" + transformations + "_" + fileName
	buffer := new(bytes.Buffer)
	jpeg.Encode(buffer, img, nil)
	err = uploadToCloud(path, buffer.String())

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{ "code": "SERVER_ERROR", "message": "Failed to process image" })
		return
	}

	resultUrl := "/api/images/transform/" + transformations + "/" + folder + "/" + fileName

	fmt.Println("SUCCESS " + resultUrl)
	imageman.Publish(folder, transformations + "_" + fileName)
	c.Data(http.StatusCreated, "image/jpeg", buffer.Bytes())
}

func initS3Client() *s3.S3 {
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
