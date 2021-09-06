package imageman

import (
	"fmt"
	"gocv.io/x/gocv"
	"image"
)

func BlurFace(source image.Image) (image.Image, error) {
	img, err := gocv.ImageToMatRGB(source)

	if err != nil {
		return nil, err
	}

	classifier := gocv.NewCascadeClassifier()
	defer classifier.Close()

	xmlFile := "imageman/cascade.xml"
	if !classifier.Load(xmlFile) {
		fmt.Printf("Error reading cascade file: %v\n", xmlFile)
		return nil, nil
	}

	rects := classifier.DetectMultiScale(img)
	fmt.Printf("found %d faces\n", len(rects))

	for _, r := range rects {
		imgFace := img.Region(r)
		// blur face
		gocv.GaussianBlur(imgFace, &imgFace, image.Pt(75, 75), 0, 0, gocv.BorderDefault)
		imgFace.Close()
	}

	result, err := img.ToImage()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return result, nil
}