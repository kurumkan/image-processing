package imageman

import (
	"image"
	"image/color"
	"image/draw"
)

func Invert(img image.Image) (image.Image, error) {
	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	result := image.NewRGBA(image.Rect(minX, minY, maxX, maxY))

	for y := minY; y < maxY; y += 1  {
		for	x := minX; x < maxX; x += 1 {
			r, g, b, _ := img.At(x, y).RGBA()
			newR := 255 - r
			newG := 255 - g
			newB := 255 - b

			newColor := color.RGBA{uint8(newR >> 8), uint8(newG >> 8), uint8(newB >> 8), 1}
			draw.Draw(result, image.Rect(x, y, x + 1, y + 1),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}

	return result, nil
}
