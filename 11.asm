.MODEL SMALL              ; Choose small memory model
.STACK 100h              ; Allocate 256 bytes for stack

.DATA                    ; Start of data segment
    DATA1 DB 10h         ; Initialize DATA1 with 10h
    DATA2 DB 0           ; Initialize DATA2 with 00h
    DATA3 DW 0           ; Initialize DATA3 with 0000h
    DATA4 DW 0AAAAh      ; Initialize DATA4 with AAAAh

.CODE                    ; Start of code segment
.STARTUP                 ; Program entry point

    MOV AL, DATA1        ; Load DATA1 into AL
    MOV AH, DATA2        ; Load DATA2 into AH
    MOV DATA3, AX        ; Store AX into DATA3
    MOV BX, DATA4        ; Load DATA4 into BX

.EXIT                    ; Exit to DOS
END                      ; End of program
