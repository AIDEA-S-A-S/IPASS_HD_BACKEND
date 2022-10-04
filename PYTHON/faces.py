import cv2
import dlib
import sys

    # print(dlib.__version__)
    # print(cv2.__version__)
    # print (sys.argv[1])
img = cv2.imread(sys.argv[1])
detector = dlib.get_frontal_face_detector()

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = detector(gray)

i = 0
for face in faces:
    i += 1

print(i)
