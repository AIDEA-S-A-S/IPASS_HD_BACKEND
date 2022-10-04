import sys
import cv2
from pythonZxing.zxing import *
import numpy as np


def order_points(pts):
	# initialzie a list of coordinates that will be ordered
	# such that the first entry in the list is the top-left,
	# the second entry is the top-right, the third is the
	# bottom-right, and the fourth is the bottom-left
	rect = np.zeros((4, 2), dtype = "float32")
	# the top-left point will have the smallest sum, whereas
	# the bottom-right point will have the largest sum
	s = pts.sum(axis = 1)
	rect[0] = pts[np.argmin(s)]
	rect[2] = pts[np.argmax(s)]
	# now, compute the difference between the points, the
	# top-right point will have the smallest difference,
	# whereas the bottom-left will have the largest difference
	diff = np.diff(pts, axis = 1)
	rect[1] = pts[np.argmin(diff)]
	rect[3] = pts[np.argmax(diff)]
	# return the ordered coordinates
	return rect


def four_point_transform(image, pts):
	# obtain a consistent order of the points and unpack them
	# individually
	rect = order_points(pts)
	(tl, tr, br, bl) = rect
	# compute the width of the new image, which will be the
	# maximum distance between bottom-right and bottom-left
	# x-coordiates or the top-right and top-left x-coordinates
	widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
	widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
	maxWidth = max(int(widthA), int(widthB))
	# compute the height of the new image, which will be the
	# maximum distance between the top-right and bottom-right
	# y-coordinates or the top-left and bottom-left y-coordinates
	heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
	heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
	maxHeight = max(int(heightA), int(heightB))
	# now that we have the dimensions of the new image, construct
	# the set of destination points to obtain a "birds eye view",
	# (i.e. top-down view) of the image, again specifying points
	# in the top-left, top-right, bottom-right, and bottom-left
	# order
	dst = np.array([
		[0, 0],
		[maxWidth - 1, 0],
		[maxWidth - 1, maxHeight - 1],
		[0, maxHeight - 1]], dtype = "float32")
	# compute the perspective transform matrix and then apply it
	M = cv2.getPerspectiveTransform(rect, dst)
	warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
	# return the warped image
	return warped

def image_resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    (h, w) = image.shape[:2]

    # if both the width and height are None, then return the
    # original image
    if width is None and height is None:
        return image

    # check to see if the width is None
    if width is None:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv2.resize(image, dim, interpolation = inter)

    # return the resized image
    return resized

def check_hw(image):
	height = image.shape[0]
	width = image.shape[1]
	flag = False
	if height > 1280 and not flag:
		image = image_resize(image, height=880)
		flag = True
	elif width > 1280 and not flag:
		image = image_resize(image, width=880)
		flag = True
	else:
		return image
	return image

def unsharp_mask(image, kernel_size=(5, 5), sigma=1.0, amount=4.0, threshold=0):
    blurred = cv2.GaussianBlur(image, kernel_size, sigma)
    sharpened = float(amount + 1) * image - float(amount) * blurred
    sharpened = np.maximum(sharpened, np.zeros(sharpened.shape))
    sharpened = np.minimum(sharpened, 255 * np.ones(sharpened.shape))
    sharpened = sharpened.round().astype(np.uint8)
    if threshold > 0:
        low_contrast_mask = np.absolute(image - blurred) < threshold
        np.copyto(sharpened, image, where=low_contrast_mask)
    return sharpened

def sharp(mat):
    sharpened_image = unsharp_mask(mat)
    return sharpened_image

def get_roi(image):
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	gray = cv2.bilateralFilter(gray, 11, 17, 17)
	edged = cv2.Canny(gray,50,150,apertureSize = 3)
	(_, thresh) = cv2.threshold(edged, 225, 255, cv2.THRESH_BINARY)
	closed = cv2.morphologyEx(edged, cv2.MORPH_CLOSE, kernel)
	closed = cv2.erode(closed, kernel, iterations = 4)
	closed = cv2.dilate(closed, kernel, iterations = 4)
	cnts, _ = cv2.findContours (closed.copy (), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	c = sorted(cnts, key = cv2.contourArea, reverse = True)[0]
	rect = cv2.minAreaRect(c)
	box = cv2.boxPoints(rect)
	box = np.int0(box)
	warped = four_point_transform(image, box)
	height = warped.shape[0]
	width = warped.shape[1]

	if height > width:
		return get_roi(cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE))

	return warped

def find_card(image):
	orig = image.copy()
	birdEye = np.maximum(orig, 10)
	foreground = birdEye.copy()
	gray = cv2.cvtColor(foreground, cv2.COLOR_BGR2GRAY)
	clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
	cl1 = clahe.apply(gray)
	# cv2.imshow("TH", cl1)
	thresh = cv2.threshold(cl1, 100, 255, cv2.THRESH_BINARY)[1]
	thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (15, 5)))
	cntrs, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
	cnts = sorted(cntrs, key=cv2.contourArea, reverse=True)[0]
	rect = cv2.minAreaRect(cnts)
	box = cv2.boxPoints(rect)
	box = np.int0(box)
	warped = four_point_transform(image, box)
	height = warped.shape[0]
	width = warped.shape[1]
	if height > width:
		return find_card(cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE))
	return warped
	
# initialize
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (35, 6))
reader = BarCodeReader()

image = cv2.imread(sys.argv[1])
warped = find_card(image)
warped = check_hw(warped)
warped = get_roi(warped)
warped = sharp(warped)
cv2.imwrite(sys.argv[2], warped)
barcode = reader.decode(sys.argv[2], try_harder=True, pure_barcode=True, possible_formats=["PDF_417"])
print(barcode.raw)