; This code uses the small memory model
.MODEL SMALL

; Start the data segment
.DATA
VAL_A   DB 20H      ; Byte value (32 decimal)
VAL_B   DB 05H      ; Byte value (5 decimal)
START_W DW 0F000H   ; Initial word value
SUBTRACT DW 1000H   ; Word to subtract
RESULT_W DW 0       ; Word placeholder for subtraction result

; Start the code segment
.CODE
.STARTUP            ; start program execution

; --- 1. Multiplication (VAL_A * VAL_B) ---
MOV AL, VAL_A       ; Load 20H into AL
MOV BL, VAL_B       ; Load 05H into BL
MUL BL              ; AX = AL * BL. AX now holds 00A0H (32*5 = 160)

; --- 2. Subtraction (START_W - SUBTRACT) ---
MOV DX, START_W     ; Load F000H into DX
MOV BX, SUBTRACT    ; Load 1000H into BX
SUB DX, BX          ; DX = DX - BX. DX now holds 0E000H

; --- 3. Store Result ---
MOV RESULT_W, DX    ; Store E000H into the memory variable RESULT_W

.EXIT               ; exit to DOS
END                 ; end program listing