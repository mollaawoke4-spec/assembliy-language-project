MODEL TINY           ; Single segment model
.CODE                 ; Start of code segment
.STARTUP              ; Program entry point

    XOR AX, AX        ; Clear AX (faster than MOV AX, 0)
    XOR BX, BX        ; Clear BX
    XOR CX, CX        ; Clear CX

    MOV SI, AX        ; Copy AX into SI
    MOV DI, AX        ; Copy AX into DI
    MOV BP, AX        ; Copy AX into BP

.EXIT                 ; Exit to DOS
END                   ; End of program
