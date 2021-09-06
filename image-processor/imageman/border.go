package imageman

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
)

func Border(img image.Image, borderWidth int, borderHexColor string) (image.Image, error) {
	result := image.NewRGBA(image.Rect(img.Bounds().Min.X, img.Bounds().Min.Y, img.Bounds().Max.X, img.Bounds().Max.Y))

	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	if borderWidth == 0 {
		return img, nil
	}

	if borderHexColor == "" || borderWidth < 0 {
		return nil, fmt.Errorf("invalid width or color: %d %s", borderWidth, borderHexColor)
	}

	borderColor, err := ParseHexToColor("#" + borderHexColor)

	if err != nil {
		return nil, err
	}

	for y := minY; y < maxY; y++  {
		for	x := minX; x < maxX; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			newColor := color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), 1}

			if y < minY + borderWidth || y > maxY - borderWidth || x < minX + borderWidth || x > maxX - borderWidth{
				newColor = borderColor
			}

			draw.Draw(result, image.Rect(x, y, x + 1, y + 1),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}
	return result, nil
}
