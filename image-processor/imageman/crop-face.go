package imageman

import (
	"fmt"
	"gocv.io/x/gocv"
	"image"
)

func CropFace(source image.Image, width int, height int) (image.Image, error) {
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

	if width == 0 && height == 0 {
		imgFace := img.Region(rects[0])
		result, err := imgFace.ToImage()
		imgFace.Close()

		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		return result, nil
	} else {
		minX := (rects[0].Min.X + rects[0].Max.X - width) / 2.0
		minY := (rects[0].Min.Y + rects[0].Max.Y - height) / 2.0
		imgFace := img.Region(image.Rectangle{
			Min: image.Point{minX, minY },
			Max: image.Point{minX + width, minY + height },
		})
		result, err := imgFace.ToImage()
		imgFace.Close()

		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		return result, nil
	}
}