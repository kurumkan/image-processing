package imageman

import (
	"image"
	"image/color"
	"image/draw"
)

func Grayscale(path string, keepRatio bool) (image.Image, error) {
	img, err := loadImage(path)

	if err != nil {
		return nil, err
	}

	result := image.NewRGBA(image.Rect(img.Bounds().Min.X, img.Bounds().Min.Y, img.Bounds().Max.X, img.Bounds().Max.Y))

	minX := img.Bounds().Min.X;
	maxX := img.Bounds().Max.X

	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++  {
		for	x := minX; x < maxX; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			med := uint8(float32(r) * 0.299 + float32(g) * 0.587 + float32(b) * 0.114)
			newColor := color.RGBA{med, med, med, 1}

			draw.Draw(result, image.Rect(x, y, x + 1, y + 1),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}

	return result, nil
}
