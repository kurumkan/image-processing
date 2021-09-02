package imageman

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"math"
)

func Resize(img image.Image, width int, height int) (image.Image, error) {
	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	result := image.NewRGBA(image.Rect(minX, minY, minX + width, minY + height))

	xResizeRate := float64(maxX - minX) / float64(width)
	yResizeRate := float64(maxY - minY) / float64(height)

	fmt.Println(xResizeRate, yResizeRate)

	for y := float64(minY); y < float64(maxY); y += yResizeRate  {
		for	x := float64(minX); x < float64(maxX); x += xResizeRate {
			resultX := int(math.Round(x / xResizeRate))
			resultY := int(math.Round(y / yResizeRate))

			r, g, b, _ := img.At(int(x), int(y)).RGBA()

			newColor := color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), 1}
			draw.Draw(result, image.Rect(resultX, resultY, resultX + 1, resultY + 1),  &image.Uniform{newColor}, image.Pt(resultX, resultY), draw.Src)
		}
	}

	return result, nil
}
