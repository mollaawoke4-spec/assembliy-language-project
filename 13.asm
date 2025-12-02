; This code uses the small memory model
.MODEL SMALL

; --- Data Segment Setup ---
.DATA
A DB 08H            ; First byte (8)
B DB 12H            ; Second byte (18)
C DB 0AH            ; Third byte (10)
D DB 14H            ; Fourth byte (20)
SUM DW 0            ; Word variable to store the result (8 + 18 + 10 + 20 = 56 decimal or 38H)

; --- Code Segment Setup ---
.CODE
.STARTUP            ; Start program execution

MOV AL, A           ; 1. Load the first number (08H) into AL
ADD AL, B           ; 2. Add the second number (12H) to AL. AL = 08H + 12H = 1AH
ADD AL, C           ; 3. Add the third number (0AH) to AL. AL = 1AH + 0AH = 24H
ADD AL, D           ; 4. Add the fourth number (14H) to AL. AL = 24H + 14H = 38H

; 5. Move the 8-bit sum from AL to the 16-bit SUM variable.
; The instruction MOV SUM, AL is incorrect in the image as it mixes sizes. 
; The correct way to store the result in a word (16-bit) variable is to use AX:
;
; The image code uses: MOV SUM, AL, which is usually not allowed (word dest, byte source).
; I will assume the intention was to store the result from AL, zero-extending it to AX first, 
; which is a common practice to avoid errors.

MOV AH, 00H         ; Ensure the high byte is zero (since the sum is less than 255)
MOV SUM, AX         ; Store the 16-bit result (0038H) into SUM

.EXIT               ; exit to DOS
END                 ; end of program
