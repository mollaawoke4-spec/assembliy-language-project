.; This code uses the small memory model
.MODEL SMALL

; --- Data Segment Setup ---
.DATA
; The array is composed of three parts:

; Part 1: First 16 elements (0 to 15, or 00H to 0FH)
ARRAY DB 16 dup(?)  ; setup ARRAY: 16 undefined bytes

; Part 2: Element 16 (10H)
; This element is explicitly initialized to 29H.
DB 29H              ; element at 10H (index 16) is initialized to 29H

; Part 3: Remaining 30 elements (17 to 46, or 11H to 2EH)
DB 30 dup(?)        ; 30 undefined bytes for elements 11H through 2EH

; --- Code Segment Setup ---
.CODE
.STARTUP            ; start program execution

; 1. Set up the source index
MOV DI, 10H         ; Load the Destination Index (DI) register with 16 (10H).
                    ; This points DI to the element containing 29H.

; 2. Read the source element
MOV AL, ARRAY[DI]   ; Copy the byte contents of the memory location 
                    ; ARRAY + DI (i.e., element 10H) into the AL register.
                    ; AL will now hold 29H.

; 3. Set up the destination index
MOV DI, 20H         ; Load the DI register with 32 (20H).
                    ; This points DI to the 33rd element (element 20H).

; 4. Write to the destination element
MOV ARRAY[DI], AL   ; Copy the contents of the AL register (29H) into the memory 
                    ; location ARRAY + DI (i.e., element 20H).
                    ; The byte at index 20H will now hold 29H.

.EXIT               ; exit to DOS
END                 ; end of program
