import sys
import cv2
import pytesseract
import numpy as np

# pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract'

# sys.argv[1]=sys.argv[1].strip("\r\n")
# print(sys.argv[1].strip("\r\n"))
image = cv2.imread(sys.argv[1])
image = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
image = cv2.GaussianBlur(image, (5,5), 0)
se= cv2.getStructuringElement(cv2.MORPH_RECT , (10,10))
bg= cv2.morphologyEx(image, cv2.MORPH_DILATE, se)

out_gray=cv2.divide(image, bg, scale=255)
out_binary=cv2.threshold(out_gray, 0, 255, cv2.THRESH_OTSU )[1]

text = pytesseract.image_to_string(out_binary)
print(text)
if ">" in text:
    print("MALA ORIENTACION")
    height = out_binary.shape[0]
    width = out_binary.shape[1]
    matrix = cv2.getRotationMatrix2D((width/2, height/2), 180, 1)
    imageOut = cv2.warpAffine(out_binary,matrix,(width,height))
    cv2.imwrite(sys.argv[3], imageOut)
else:
    cv2.imwrite(sys.argv[3], out_binary)
