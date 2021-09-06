package imageman

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
)

func Flip(img image.Image, direction string) (image.Image, error) {
	result := image.NewRGBA(image.Rect(img.Bounds().Min.X, img.Bounds().Min.Y, img.Bounds().Max.X, img.Bounds().Max.Y))

	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	if direction == "horizontal" {
		for y := minY; y < maxY; y++  {
			for	x := minX; x < maxX; x++ {
				r, g, b, _ := img.At(x, y).RGBA()
				newColor := color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), 1}

				newX := maxX - x - 1

				draw.Draw(result, image.Rect(newX, y, newX + 1, y + 1),  &image.Uniform{newColor}, image.Pt(newX, y), draw.Src)
			}
		}
		return result, nil
	}

	if direction == "vertical" {
		for y := minY; y < maxY; y++  {
			for	x := minX; x < maxX; x++ {
				r, g, b, _ := img.At(x, y).RGBA()
				newColor := color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), 1}

				newY := maxY - y - 1

				draw.Draw(result, image.Rect(x, newY, x + 1, newY + 1),  &image.Uniform{newColor}, image.Pt(x, newY), draw.Src)
			}
		}
		return result, nil
	}

	return nil, fmt.Errorf("invalid direction, must be horizontal or vertical, but got %s", direction)
}
