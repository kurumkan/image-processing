package imageman

import (
	"image"
	"image/color"
	"image/draw"
	"math"
)

func Brightness(img image.Image, brightness int) (image.Image, error) {
	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	result := image.NewRGBA(image.Rect(minX, minY, maxX, maxY))

	for y := minY; y < maxY; y += 1  {
		for	x := minX; x < maxX; x += 1 {
			r, g, b, _ := img.At(x, y).RGBA()
			newR := convertBrightness(r, brightness)
			newG := convertBrightness(g, brightness)
			newB := convertBrightness(b, brightness)

			newColor := color.RGBA{newR, newG, newB, 1}
			draw.Draw(result, image.Rect(x, y, x + 1, y + 1),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}

	return result, nil
}

func convertBrightness(component uint32, brightness int) uint8 {
	val := float64((component >> 8) + uint32(2.55 * float64(brightness)))

	if brightness > 0 {
		return uint8(math.Min(val, 255))
	}

	return uint8(math.Max(val, 0))
}