; This code uses the small memory model
.MODEL SMALL

; Start the data segment
.DATA
DATAS DW 50 DUP(?)  ; setup array of 50 words (50 * 2 = 100 bytes)

; Start the code segment
.CODE
.STARTUP            ; start program execution

; Setup
MOV AX, 0           ; Initialize AX to 0
MOV ES, AX          ; Load ES (Extra Segment) register with 0.
                    ; This sets ES:046Ch to point to the BIOS data area.
MOV BX, OFFSET DATAS; Load BX with the starting offset address of the DATAS array
MOV CX, 50          ; Load loop counter CX with 50 (number of iterations)

AGAIN:              ; Loop start label
MOV AX, ES:[046CH]  ; get clock value from memory location 0000:046C into AX
MOV [BX], AX        ; save the word value of AX into the DATAS array element pointed to by BX
INC BX              ; increment BX (low byte)
INC BX              ; increment BX (high byte). BX is incremented by 2
                    ; because each element (word) is 2 bytes long.
LOOP AGAIN          ; decrement CX and jump back to AGAIN if CX is not zero

.EXIT               ; exit to DOS
END                 ; end program listing
