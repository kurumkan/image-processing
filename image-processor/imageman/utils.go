package imageman

import (
	"image"
	"net/http"
)

// load image from url
func loadImage(path string) (image.Image, error) {
	resp, err := http.Get(path)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	img, _, err := image.Decode(resp.Body)
	return img, err
}

func makeRange(start int, end int, step int) []int {
	result := make([]int, (end - start) / step)

	for i := 0; i < len(result); i ++ {
		result[i] = start + i * step
	}

	return result
}

