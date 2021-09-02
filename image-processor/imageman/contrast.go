package imageman

import (
	"image"
	"image/color"
	"image/draw"
)

func Contrast(img image.Image, contrast int) (image.Image, error) {
	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	result := image.NewRGBA(image.Rect(minX, minY, maxX, maxY))

	for y := minY; y < maxY; y += 1  {
		for	x := minX; x < maxX; x += 1 {
			r, g, b, _ := img.At(x, y).RGBA()
			newR := convertContrast(r, contrast)
			newG := convertContrast(g, contrast)
			newB := convertContrast(b, contrast)

			newColor := color.RGBA{newR, newG, newB, 1}
			draw.Draw(result, image.Rect(x, y, x + 1, y + 1),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}

	return result, nil
}

func convertContrast(component uint32, contrast int) uint8 {
	return uint8(((1 + float64(contrast) / 100) * float64(int(component) >> 8 - 128)) + 128)
}