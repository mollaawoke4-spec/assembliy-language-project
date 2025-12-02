; This code uses the small memory model
.MODEL SMALL

; --- Data Segment Setup ---
.DATA
DATAS DW 1000H, 2000H, 3000H, 4000H ; An array of 4 words
TARGET_WORD DW ?                    ; A memory location to store a result

; --- Code Segment Setup ---
.CODE
.STARTUP            ; Start program execution

; 1. Initialize Segment Registers and Pointers
MOV AX, @DATA       ; Load the data segment address into AX
MOV DS, AX          ; Set the Data Segment (DS) register
MOV BX, OFFSET DATAS; BX (Base Register) points to the start of the DATAS array
MOV DI, 2           ; DI (Index Register) is set to 2 bytes (to point to the second word, 2000H)
MOV CX, 0FFFFH      ; Initialize CX (Destination Register)

; 2. Example 1: MOV CX, [BX+DI]
; Operation: Copies the word contents of the data segment memory location
;            addressed by (BX + DI) into CX.
; Calculation: [OFFSET DATAS + 2]. This points to the word '2000H'.
MOV CX, [BX+DI]     ; CX will now hold 2000H

; 3. Example 2: MOV [BX+DI], CX
; Operation: Copies CX (2000H) into the data segment memory location
;            addressed by (BX + DI).
; Calculation: [OFFSET DATAS + 2]. The word '2000H' in the array is replaced by 2000H (no change in this case).
; Let's change CX first to show a real write operation:
MOV CX, 5555H       ; CX now holds 5555H
MOV [BX+DI], CX     ; DATAS[1] (the second word) is now 5555H

; 4. Cleanup and Exit
.EXIT               ; Exit to DOS
END                 ; End program listing