; This code uses the small memory model
.MODEL SMALL

; Start the data segment
.DATA
DATA1 DB 10H        ; place 10H into DATA1 (Byte)
DATA2 DB 00H        ; place 00H into DATA2 (Byte)
DATA3 DW 0          ; place 0000H into DATA3 (Word)
DATA4 DW 0AAAAH     ; place 0AAAAH into DATA4 (Word)

; Start the code segment
.CODE
.STARTUP            ; start program execution

MOV AL,DATA1        ; copy DATA1 (10H) into AL
MOV AH,DATA2        ; copy DATA2 (00H) into AH
MOV DATA3,AX        ; copy AX (1000H) into DATA3
MOV BX,DATA4        ; copy DATA4 (0AAAAH) into BX

.EXIT               ; exit to DOS
END                 ; end program listing
