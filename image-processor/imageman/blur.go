package imageman

import (
	"image"
	"image/color"
	"image/draw"
	"math"
	"fmt"
)

func Blur(img image.Image, size int) (image.Image, error) {
	minX := img.Bounds().Min.X
	maxX := img.Bounds().Max.X
	minY := img.Bounds().Min.Y
	maxY := img.Bounds().Max.Y

	if size == 0 {
	    return img, nil
	}

	if size < 0 {
	    return nil, fmt.Errorf("Invalid blur size %d", size)
	}

	result := image.NewRGBA(image.Rect(minX, minY, maxX, maxY))

	for y := minY; y < maxY; y += size  {
		for	x := minX; x < maxX; x += size {
			rsum := uint32(0)
			gsum := uint32(0)
			bsum := uint32(0)

			xCount := uint32(math.Min(float64(x + size), float64(maxX)) - float64(x))
			yCount := uint32(math.Min(float64(y + size), float64(maxY)) - float64(y))
			totalCount := xCount * yCount

			for ys := y; ys < y + int(yCount); ys++ {
				for xs := x; xs < x + int(xCount); xs++ {
					r, g, b, _ := img.At(xs, ys).RGBA()
					rsum += r
					gsum += g
					bsum += b
				}
			}

			newColor := color.RGBA{uint8(rsum / totalCount >> 8), uint8(gsum / totalCount >> 8), uint8(bsum / totalCount >> 8), 1}
			draw.Draw(result, image.Rect(x, y, x + int(xCount), y + int(yCount)),  &image.Uniform{newColor}, image.Pt(x, y), draw.Src)
		}
	}

	return result, nil
}
